import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description || "Aquí irá la descripción y pasos de la receta.");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleSaveTitle = async () => {
    setIsEditingTitle(false);
    const updatedRecipe = { ...recipe, title };
    await saveRecipe(updatedRecipe);
  };

  const handleSaveDescription = async () => {
    setIsEditingDescription(false);
    const updatedRecipe = { ...recipe, description };
    await saveRecipe(updatedRecipe);
  };

  const saveRecipe = async (updatedRecipe) => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      const updatedRecipes = recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r);
      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      navigation.navigate('Home', { updatedRecipes });
    } catch (error) {
      console.error('Failed to save recipe', error);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      const updatedRecipes = recipes.filter(r => r.id !== recipe.id);
      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      navigation.navigate('Home', { updatedRecipes });
    } catch (error) {
      console.error('Failed to delete recipe', error);
    }
  };

  return (
    <View style={styles.container}>
      {isEditingTitle ? (
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={isEditingTitle ? handleSaveTitle : () => setIsEditingTitle(true)}
      >
        <Text style={styles.buttonText}>{isEditingTitle ? "Guardar Título" : "Editar Título"}</Text>
      </TouchableOpacity>

      {isEditingDescription ? (
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
      ) : (
        <Text style={styles.description}>{description}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={isEditingDescription ? handleSaveDescription : () => setIsEditingDescription(true)}
      >
        <Text style={styles.buttonText}>{isEditingDescription ? "Guardar Descripción" : "Editar Descripción"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteRecipe}
      >
        <Text style={styles.deleteButtonText}>Eliminar Receta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  description: { fontSize: 16, marginBottom: 12 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#1976d2",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  buttonText: { color: "white", textAlign: "center", fontSize: 16 },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 4,
    marginTop: 'auto',
  },
  deleteButtonText: { color: "white", textAlign: "center", fontSize: 16 },
});