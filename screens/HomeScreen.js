import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import PropTypes from "prop-types";
import { useFocusEffect } from "@react-navigation/native";
import { database, ref, get } from "../firebase";

const windowWidth = Dimensions.get("window").width;

export default function HomeScreen({ user, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [selectedView, setSelectedView] = useState("categories");

  const getCategories = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const json = await response.json();
      setCategories(json.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRecipes = async () => {
    try {
      const userRecipesRef = ref(database, "/userRecipes");
      const snapshot = await get(userRecipesRef);
      const recipes = snapshot.val() ? Object.values(snapshot.val()) : [];
      setUserRecipes(recipes);
    } catch (error) {
      console.error("Error fetching user's recipes: ", error);
    }
  };

  useEffect(() => {
    getCategories();
    getUserRecipes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUserRecipes();
    }, [])
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() =>
        navigation.navigate("CategoryDetail", { category: item.strCategory })
      }
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.strCategoryThumb }} style={styles.image} />
      </View>
      <Text style={styles.categoryName}>{item.strCategory}</Text>
      <Text style={styles.categoryDescription} numberOfLines={1}>
        {item.strCategoryDescription.split(".")[0]}
      </Text>
    </TouchableOpacity>
  );

  const renderUserRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() =>
        navigation.navigate("RecipeDetail", {
          recipe: item,
          isUserRecipe: true,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.strMealThumb || "https://via.placeholder.com/150",
          }}
          style={styles.image}
        />
      </View>
      <Text style={styles.categoryName}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes App</Text>
        <Text>Hola, {user.displayName}!</Text>
      </View>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedView}
          onValueChange={(itemValue) => setSelectedView(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Categorías" value="categories" />
          <Picker.Item label="Recetas creadas" value="userRecipes" />
        </Picker>
      </View>

      {selectedView === "categories" ? (
        <>
          <Text style={styles.sectionTitle}>Categorías</Text>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.idCategory}
              renderItem={renderCategoryItem}
              contentContainerStyle={styles.listContainer}
              numColumns={3}
              columnWrapperStyle={styles.row}
            />
          )}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Recetas Creadas por Mí</Text>
          {userRecipes.length > 0 ? (
            <FlatList
              data={userRecipes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderUserRecipeItem}
              contentContainerStyle={styles.listContainer}
              numColumns={3}
              columnWrapperStyle={styles.row}
            />
          ) : (
            <Text>No tienes recetas creadas aún.</Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3436",
  },
  dropdownContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 12,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recipeItem: {
    width: (windowWidth - 60) / 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#FF6B6B",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2D3436",
    textAlign: "center",
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  categoryDescription: {
    fontSize: 10,
    color: "#636E72",
    textAlign: "center",
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
});
