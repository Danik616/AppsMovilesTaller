import React, { useReducer, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = [];

function recipesReducer(state, action) {
  switch (action.type) {
    case "ADD_RECIPE":
      const updatedRecipes = [...state, action.payload]; // Agregar nueva receta sin perder las anteriores
      AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes)); // Guardar en AsyncStorage
      return updatedRecipes;

    case "SET_RECIPES":
      return action.payload;

    default:
      return state;
  }
}

export default function HomeScreen({ navigation, route }) {
  const [recipes, dispatch] = useReducer(recipesReducer, initialState);

  //--------------------------------------------------------------------------------
  useEffect(() => {
    const reloadRecipes = async () => {
      try {
        console.log("🔄 Recargando recetas desde AsyncStorage...");
        const storedRecipes = await AsyncStorage.getItem("recipes");
        if (storedRecipes) {
          dispatch({ type: "SET_RECIPES", payload: JSON.parse(storedRecipes) });
        }
      } catch (error) {
        console.error("Error al recargar recetas:", error);
      }
    };
  
    // Se ejecuta cada vez que `Home` recibe el foco
    const unsubscribe = navigation.addListener("focus", () => {
      reloadRecipes();
    });
  
    return unsubscribe;
  }, [navigation]);
  
  
  

  useEffect(() => {
    const addRecipe = async () => {
      if (route.params?.newRecipe) {
        try {
          const storedRecipes = await AsyncStorage.getItem("recipes");
          const currentRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
          const updatedRecipes = [...currentRecipes, route.params.newRecipe];

          await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes));
          dispatch({ type: "SET_RECIPES", payload: updatedRecipes });

          navigation.setParams({ newRecipe: null }); // Evita que se repita la adición
        } catch (error) {
          console.error("Failed to save recipe", error);
        }
      }
    };

    addRecipe();
  }, [route.params?.newRecipe]);

  console.log("Recipes:", recipes);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas</Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
          >
            <Text style={styles.recipeTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddRecipe")}
      >
        <Text style={styles.addButtonText}>+ Agregar Receta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#ED9277",flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  recipeItem: {
    padding: 16,
    backgroundColor: "#e2c456",
    marginBottom: 10,
    borderRadius: 5,
  },
  recipeTitle: { fontSize: 18 },
  addButton: {
    backgroundColor: "#ffa500",
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
  },
  addButtonText: { color: "white", textAlign: "center", fontSize: 16 },
});