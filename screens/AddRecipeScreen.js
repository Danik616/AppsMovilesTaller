import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";

export default function AddRecipeScreen({ navigation }) {
  const [recipeName, setRecipeName] = useState("");

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleAddRecipe = () => {
    if (recipeName.trim()) {
      const newRecipe = {
        id: generateId(), // Genera un ID único para cada receta
        title: recipeName.trim(),
      };
      console.log("New Recipe:", newRecipe); // Verifica el objeto newRecipe
      navigation.navigate("Home", { newRecipe }); // Pasa el objeto de receta
      setRecipeName(""); // Limpia el input después de agregar
    } else {
      alert("Por favor ingrese un nombre válido.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Receta"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddRecipe}>
        <Text style={styles.buttonText}>Agregar Receta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: { backgroundColor: "#1976d2", padding: 12, borderRadius: 4 },
  buttonText: { color: "white", textAlign: "center", fontSize: 16 },
});