import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  Image,
  Picker,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { database, ref as dbRef, push } from "../firebase";

const CreateRecipeScreen = () => {
  const [mealName, setMealName] = useState("");
  const [category, setCategory] = useState("Seleccionar");
  const [instructions, setInstructions] = useState([""]);
  const [ingredients, setIngredients] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dynamicHeight, setDynamicHeight] = useState(100);
  const [area, setArea] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error al obtener categorías: ", error);
      }
    };

    fetchCategories();
  }, []);

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

  const handleInstructionChange = (text, index) => {
    const newInstructions = [...instructions];
    newInstructions[index] = text;
    setInstructions(newInstructions);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleCreateRecipe = () => {
    if (
      !mealName ||
      category === "Seleccionar" ||
      !instructions.length ||
      ingredients.length === 0
    ) {
      alert("Por favor complete todos los campos.");
      return;
    }

    setIsSubmitting(true);

    const formattedInstructions = instructions.join("\n");
    const formattedIngredients = ingredients.join(", ");

    const newRecipe = {
      strMeal: mealName,
      strCategory: category,
      strInstructions: formattedInstructions,
      ingredients: formattedIngredients,
      strMealThumb: imageUri || "",
      strArea: area || "",
      strYoutube: youtubeLink || "",
    };

    push(dbRef(database, "/userRecipes"), newRecipe)
      .then(() => {
        alert("Receta creada con éxito");
        setMealName("");
        setCategory("Seleccionar");
        setInstructions([""]);
        setIngredients([""]);
        setImageUri(null);
        setArea("");
        setYoutubeLink("");
      })
      .catch((error) => {
        console.error("Error al crear receta: ", error);
        alert("Hubo un error al crear la receta.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Nueva Receta</Text>
        <TextInput
          placeholder="Nombre de la receta"
          value={mealName}
          onChangeText={setMealName}
          style={styles.input}
        />

        <Text style={styles.label}>Categoría</Text>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.picker}
        >
          <Picker.Item label="Seleccionar" value="Seleccionar" />
          {categories.map((cat, index) => (
            <Picker.Item
              key={index}
              label={cat.strCategory}
              value={cat.strCategory}
            />
          ))}
        </Picker>

        <TextInput
          placeholder="Área de origen (opcional)"
          value={area}
          onChangeText={setArea}
          style={styles.input}
        />

        <TextInput
          placeholder="Enlace de YouTube (opcional)"
          value={youtubeLink}
          onChangeText={setYoutubeLink}
          style={styles.input}
        />

        <Text style={styles.label}>Instrucciones</Text>
        {instructions.map((instruction, index) => (
          <View style={styles.instructionContainer} key={index}>
            <TextInput
              placeholder={`Paso ${index + 1}`}
              value={instruction}
              onChangeText={(text) => handleInstructionChange(text, index)}
              multiline
              style={[styles.input, { height: dynamicHeight, flex: 1 }]}
              onContentSizeChange={(contentWidth, contentHeight) => {
                setDynamicHeight(contentHeight < 100 ? 100 : contentHeight);
              }}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddInstruction}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.label}>Ingredientes</Text>
        {ingredients.map((ingredient, index) => (
          <View style={styles.ingredientContainer} key={index}>
            <TextInput
              placeholder={`Ingrediente ${index + 1}`}
              value={ingredient}
              onChangeText={(text) => handleIngredientChange(text, index)}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddIngredient}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.selectImageButton} onPress={pickImage}>
          <Text style={styles.selectImageText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleCreateRecipe}
          disabled={isSubmitting || category === "Seleccionar"}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Guardando..." : "Crear Receta"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#636E72",
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    marginBottom: 20,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  selectImageButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  selectImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 10,
    borderRadius: 8,
    alignSelf: "center",
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#d3d3d3",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default CreateRecipeScreen;
