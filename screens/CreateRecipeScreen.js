import React, { useState } from "react";
import { View, TextInput, Button, Text, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { database, ref as dbRef, push } from "../firebase";

const CreateRecipeScreen = () => {
  const [mealName, setMealName] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: undefined,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleCreateRecipe = () => {
    if (!mealName || !category || !instructions || ingredients.length === 0) {
      alert("Por favor complete todos los campos.");
      return;
    }

    setIsSubmitting(true);

    const newRecipe = {
      strMeal: mealName,
      strCategory: category,
      strInstructions: instructions,
      ingredients: ingredients,
      strMealThumb: imageUri || "",
    };

    push(dbRef(database, "/userRecipes"), newRecipe)
      .then(() => {
        alert("Receta creada con éxito");
        setMealName("");
        setCategory("");
        setInstructions("");
        setIngredients([""]);
        setImageUri(null);
      })
      .catch((error) => {
        console.error("Error al crear receta: ", error);
        alert("Hubo un error al crear la receta.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>
          Crear Nueva Receta
        </Text>
        <TextInput
          placeholder="Nombre de la receta"
          value={mealName}
          onChangeText={setMealName}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Categoría"
          value={category}
          onChangeText={setCategory}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Instrucciones"
          value={instructions}
          onChangeText={setInstructions}
          multiline
          style={{
            borderWidth: 1,
            marginBottom: 10,
            height: 100,
            textAlignVertical: "top",
          }}
        />

        <Text style={{ fontSize: 18 }}>Ingredientes</Text>
        {ingredients.map((ingredient, index) => (
          <TextInput
            key={index}
            placeholder={`Ingrediente ${index + 1}`}
            value={ingredient}
            onChangeText={(text) => handleIngredientChange(text, index)}
            style={{ borderBottomWidth: 1, marginBottom: 5 }}
          />
        ))}
        <Button title="Agregar Ingrediente" onPress={handleAddIngredient} />

        <Button title="Seleccionar Imagen" onPress={pickImage} />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, marginVertical: 10 }}
          />
        )}

        <Button
          title={isSubmitting ? "Guardando..." : "Crear Receta"}
          onPress={handleCreateRecipe}
          disabled={isSubmitting}
        />
      </View>
    </ScrollView>
  );
};

export default CreateRecipeScreen;
