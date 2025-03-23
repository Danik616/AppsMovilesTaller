import React, { useState } from "react";
import { View, TextInput, Button, Text, ScrollView, Image } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { database, ref as dbRef, push } from "../firebase";

const CreateRecipeScreen = () => {
  const [mealName, setMealName] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);

  const pickImage = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("El usuario canceló la selección de imagen");
      } else if (response.errorCode) {
        console.log("Error en ImagePicker: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageBase64(response.assets[0].base64);
      }
    });
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
      strMealThumb: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : "",
    };

    push(dbRef(database, "/userRecipes"), newRecipe)
      .then(() => {
        alert("Receta creada con éxito");
        setMealName("");
        setCategory("");
        setInstructions("");
        setIngredients([""]);
        setImageBase64(null);
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
        {imageBase64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
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
