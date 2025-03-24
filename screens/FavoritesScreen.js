// FavoritesScreen.js
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { database, ref, get, child, push } from "../firebase"; // Ensure push is imported

const windowWidth = Dimensions.get('window').width;

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

  const renderMealItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <View style={styles.imageContainer}>
         <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      </View>
      <Text style={styles.recipeTitle} numberOfLines={2}>
         {item.strMeal}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    getFavorites();
  }, []);

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favoritos</Text>
        </View>
  
        <Text style={styles.sectionTitle}>Recipes</Text>
  
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size='large' color='#FF6B6B' />
          </View>
        ) : favorites.length === 0 ? (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFound}>No recipes found.</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id || item.strMeal}
            renderItem={renderMealItem}
            contentContainerStyle={styles.listContainer}
            numColumns={3}
            columnWrapperStyle={styles.row}
          />
        )}
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { 
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3436',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3436',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notFound: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FF6B6B',
  },
  listContainer: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recipeItem: {
    width: (windowWidth - 60) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FF6B6B',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recipeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    lineHeight: 16,
  },
});


export default FavoritesScreen;