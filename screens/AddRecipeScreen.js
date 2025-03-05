import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import PropTypes from "prop-types";

export default function AddRecipeScreen({ navigation }) {
  const [recipeName, setRecipeName] = useState("");

  const generateId = () => {
    return Math.random().toString(36).slice(2, 11);
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

  AddRecipeScreen.propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la Receta"
          value={recipeName}
          onChangeText={setRecipeName}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddRecipe}>
          <Text style={styles.buttonText}>Agregar Receta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
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
  buttonContainer: {
    marginTop: "auto",
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
});
