import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Función para obtener los detalles de la receta por ID
  const fetchRecipeDetails = async (idMeal) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      const json = await response.json();
      if (json.meals && json.meals.length > 0) {
        setRecipeDetails(json.meals[0]); // Guardar los detalles en el estado
      }
    } catch (error) {
      console.error('Error al obtener los detalles de la receta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (recipe.idMeal) {
      fetchRecipeDetails(recipe.idMeal);
    }
  }, [recipe.idMeal]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipeDetails.strMeal}</Text>
      <Image
        source={{ uri: recipeDetails.strMealThumb }}
        style={styles.image}
      />
      <Text style={styles.subtitle}>
        Categoría: {recipeDetails.strCategory}
      </Text>
      <Text style={styles.subtitle}>Área: {recipeDetails.strArea}</Text>
      <Text style={styles.sectionTitle}>Instrucciones</Text>
      <Text style={styles.description}>{recipeDetails.strInstructions}</Text>
    </ScrollView>
  );
}

RecipeDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      recipe: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: { fontSize: 18, textAlign: 'center', marginVertical: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  description: { fontSize: 16, textAlign: 'justify', marginTop: 10 },
  image: { width: '100%', height: 250, borderRadius: 10, marginBottom: 10 },
});
