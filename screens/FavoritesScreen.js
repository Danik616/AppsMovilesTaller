// FavoritesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { database, ref, get, child } from "../firebase";
const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener recetas favoritas desde Firebase
  const getFavorites = async () => {
    try {
      const favoritesRef = ref(database, "/favorites");
      const snapshot = await get(favoritesRef);
      const data = snapshot.val();
      const recipes = data ? Object.values(data) : [];
      setFavorites(recipes);
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = (recipe) => {
    const newFavorite = { ...recipe };
    const favoritesRef = ref(database, "/favorites");
    push(favoritesRef, newFavorite)
      .then(() => alert("Receta agregada a favoritos"))
      .catch((error) => console.error("Error adding favorite: ", error));
  };

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <View>
      <Text>Mis Recetas Favoritas</Text>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("RecipeDetail", { recipe: item })
              }
            >
              <Text>{item.strMeal}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;
