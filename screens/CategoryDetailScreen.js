import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import PropTypes from "prop-types";

const windowWidth = Dimensions.get("window").width;

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
      onPress={() =>
        navigation.navigate("RecipeDetail", {
          recipe: item,
          isUserRecipe: false,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      </View>
      <Text style={styles.recipeTitle} numberOfLines={2}>
        {item.strMeal}
      </Text>
    </TouchableOpacity>
  );

  const getBackgroundColor = (index) => {
    // Alternate between different background colors based on index
    const colors = ["#FF6B6B", "#FFD166", "#F38181"];
    return colors[index % colors.length];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{category}</Text>
      </View>

      <Text style={styles.sectionTitle}>Recipes</Text>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : meals.length === 0 ? (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFound}>No recipes found.</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderMealItem}
          contentContainerStyle={styles.listContainer}
          numColumns={3}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
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
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3436",
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
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  notFound: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#FF6B6B",
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  recipeTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2D3436",
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    lineHeight: 16,
  },
});
