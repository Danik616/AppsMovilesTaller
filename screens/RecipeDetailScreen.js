import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { database, ref as dbRef, push } from "../firebase";

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to get recipe details by ID
  const fetchRecipeDetails = async (idMeal) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      const json = await response.json();
      if (json.meals && json.meals.length > 0) {
        setRecipeDetails(json.meals[0]);
      }
    } catch (error) {
      console.error('Error al obtener los detalles de la receta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract ingredients and measurements from recipe data
  const getIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          ingredient: ingredient,
          measure: measure || '',
        });
      }
    }
    return ingredients;
  };

  useEffect(() => {
    if (recipe.idMeal) {
      fetchRecipeDetails(recipe.idMeal);
    }
  }, [recipe.idMeal]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size='large' color='#FF6B6B' />
      </View>
    );
  }

  if (!recipeDetails) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>
          No se encontraron detalles de la receta.
        </Text>
      </View>
    );
  }

  const ingredients = getIngredients(recipeDetails);

  const handleNewFavorite = () => {
    setIsSubmitting(true);

    const newFavorite = {
      strMeal: recipeDetails.strMeal,
      strCategory: recipeDetails.strCategory,
      strArea: recipeDetails.strArea,
      strInstructions: recipeDetails.strInstructions,
      stringredients: ingredients,
      strMealThumb: recipeDetails.strMealThumb || " ",
    };

    push(dbRef(database, "/favorites"), newFavorite)
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipeDetails.strMealThumb }}
            style={styles.image}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{recipeDetails.strMeal}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Categoría</Text>
              <Text style={styles.infoValue}>{recipeDetails.strCategory}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Origen</Text>
              <Text style={styles.infoValue}>{recipeDetails.strArea}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <View style={styles.ingredientsContainer}>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientDot} />
                <Text style={styles.ingredientText}>
                  {item.ingredient} {item.measure ? `(${item.measure})` : ''}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Instrucciones</Text>
          <Text style={styles.instructions}>
            {recipeDetails.strInstructions}
          </Text>

          {recipeDetails.strYoutube && (
            <View style={styles.youtubeContainer}>
              <Text style={styles.sectionTitle}>Video Tutorial</Text>
              <TouchableOpacity
                style={styles.youtubeButton}
                onPress={() => {
                  Linking.openURL(recipeDetails.strYoutube);
                }}
              >
                <Text style={styles.youtubeButtonText}>Ver en YouTube</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.favoriteButton} onPress={handleNewFavorite}>
            <Text style={styles.favoriteButtonText}>Agregar a Favoritos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

RecipeDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      recipe: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#FF6B6B',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginHorizontal: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 24,
    marginBottom: 16,
  },
  ingredientsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: '#2D3436',
    flex: 1,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D3436',
    textAlign: 'justify',
  },
  youtubeContainer: {
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  youtubeButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  youtubeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
