import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>
        Aquí irá la descripción y pasos de la receta.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  description: { fontSize: 16 },
});
