import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

const recipes = [
  { id: "1", title: "Spaghetti Bolognese" },
  { id: "2", title: "Ensalada César" },
  { id: "3", title: "Tacos al Pastor" },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() =>
              navigation.navigate("RecipeDetail", { recipe: item })
            }
          >
            <Text style={styles.recipeTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddRecipe")}
      >
        <Text style={styles.addButtonText}>+ Agregar Receta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  recipeItem: {
    padding: 16,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 5,
  },
  recipeTitle: { fontSize: 18 },
  addButton: {
    backgroundColor: "#1976d2",
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
  },
  addButtonText: { color: "white", textAlign: "center", fontSize: 16 },
});
