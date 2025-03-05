import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import PropTypes from "prop-types";

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(
    recipe.description || "Aquí irá la descripción y pasos de la receta."
  );
  const [image, setImage] = useState(recipe.image || null);
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

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "image",
      allowsEditing: true,
      aspect: undefined,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImageUri = result.assets[0].uri;
      setImage(newImageUri);
      await saveRecipe({ ...recipe, image: newImageUri });
    }
  };

  const saveRecipe = async (updatedRecipe) => {
    try {
      const storedRecipes = await AsyncStorage.getItem("recipes");
      let recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      // 🔹 Buscar la receta por ID y actualizarla
      recipes = recipes.map((r) =>
        r.id === updatedRecipe.id ? updatedRecipe : r
      );

      await AsyncStorage.setItem("recipes", JSON.stringify(recipes));

      console.log("✅ Receta guardada correctamente:", updatedRecipe);

      // 🔹 Recarga la pantalla en lugar de regresar a Home
      navigation.replace("RecipeDetail", { recipe: updatedRecipe });
    } catch (error) {
      console.error("❌ Error al guardar receta:", error);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem("recipes");
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      const updatedRecipes = recipes.filter((r) => r.id !== recipe.id);
      await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      navigation.navigate("Home", { updated: true }); // ✅ Se asegura de que Home sepa que se eliminó una receta
    } catch (error) {
      console.error("Failed to delete recipe", error);
    }
  };

  return (
    <View style={styles.container}>
      {isEditingTitle ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la Receta"
            value={title}
            onChangeText={setTitle}
          />
        </View>
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {isEditingDescription ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la Receta"
            value={description}
            onChangeText={setDescription}
          />
        </View>
      ) : (
        <Text style={styles.description}>{description}</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={
            isEditingTitle ? handleSaveTitle : () => setIsEditingTitle(true)
          }
        >
          <Text style={styles.buttonText}>
            {isEditingTitle ? "Guardar Título" : "Editar Título"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={
            isEditingDescription
              ? handleSaveDescription
              : () => setIsEditingDescription(true)
          }
        >
          <Text style={styles.buttonText}>
            {isEditingDescription
              ? "Guardar Descripción"
              : "Editar Descripción"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAddImage}>
          <Text style={styles.buttonText}>
            {image ? "Editar Foto" : "Agregar Foto"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteRecipe}
        >
          <Text style={styles.buttonText}>Eliminar Receta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

RecipeDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      recipe: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        image: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#ffffff", flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  description: { fontSize: 16, marginBottom: 12 },
  inputContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    justifyContent: "center",
  },
  input: {
    color: "#1F2937",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    height: 56,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "white", textAlign: "center", fontSize: 16 },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 12,
    height: 56,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: "auto",
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 4,
    resizeMode: "cover",
  },
});
