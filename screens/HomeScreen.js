import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation, route }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getCategories = async () => {
    try {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/categories.php'
      );
      const json = await response.json();
      setData(json.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const renderCategories = ({ item, index }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() =>
        navigation.navigate('CategoryDetail', { category: item.strCategory })
      }
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.strCategoryThumb }} style={styles.image} />
      </View>
      <Text style={styles.categoryName}>{item.strCategory}</Text>
      <Text style={styles.categoryDescription} numberOfLines={1}>
        {item.strCategoryDescription.split('.')[0]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes App</Text>
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size='large' color='#FF6B6B' />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.idCategory}
          renderItem={renderCategories}
          contentContainerStyle={styles.listContainer}
          numColumns={3}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      newRecipe: PropTypes.object,
    }),
  }).isRequired,
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
  title: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  categoryDescription: {
    fontSize: 10,
    color: '#636E72',
    textAlign: 'center',
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
});
