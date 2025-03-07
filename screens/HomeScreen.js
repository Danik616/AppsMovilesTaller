import React, { useReducer, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";

const initialState = [];

function recipesReducer(state, action) {
  switch (action.type) {
    case "ADD_RECIPE":
      return addRecipeToState(state, action.payload);

    case "SET_RECIPES":
      return action.payload;

    default:
      return state;
  }
}

export default function HomeScreen({ navigation, route }) {
  const [recipes, dispatch] = useReducer(recipesReducer, initialState);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getCategories = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const json = await response.json();
      setData(json.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

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

    const unsubscribe = navigation.addListener("focus", () => {
      reloadRecipes();
    });

    return unsubscribe;
  }, [navigation]);

  console.log("Recipes:", recipes);

  const renderCategories = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() =>
        navigation.navigate("CategoryDetail", { category: item.strCategory })
      }
    >
      <Text style={styles.recipeTitle}>{item.strCategory}</Text>
      <Image source={{ uri: item.strCategoryThumb }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.idCategory}
          renderItem={renderCategories}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      newRecipe: PropTypes.object,
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#ffffff", flex: 1, padding: 16 },
  notFound: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  recipeItem: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderColor: "#6366F1",
    borderWidth: 2,
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
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 4,
    resizeMode: "cover",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  addButtonText: { color: "white", textAlign: "center", fontSize: 16 },
});
