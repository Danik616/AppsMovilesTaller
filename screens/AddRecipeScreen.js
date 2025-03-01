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

  const handleAddRecipe = () => {
    if (recipeName.trim()) {
      alert("Receta añadida con éxito!");

      navigation.navigate("HomeScreen", {
        recipies: [...{ title: recipeName }],
      });
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
