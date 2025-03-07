import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

export default function CategoryDetailScreen({ route, navigation }) {
  const { category } = route.params;
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMealsByCategory = async (category) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const json = await response.json();
      setMeals(json.meals || []); 
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (category) {
      getMealsByCategory(category);
    }
  }, [category]);

  const renderMealItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate("RecipeDetail", { meal: item })}
    >
      <Text style={styles.recipeTitle}>{item.strMeal}</Text>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Recipes</Text>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {meals.length === 0 && !isLoading && (
        <Text style={styles.notFound}>No recipes found.</Text>
      )}
      {meals.length > 0 && !isLoading && (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderMealItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

CategoryDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      category: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
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
});
