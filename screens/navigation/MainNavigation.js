import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryDetailScreen from '../CategoryDetailScreen';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import HomeScreen from '../HomeScreen';
import { Text } from 'react-native';
import RecipeDetailScreen from '../RecipeDetailScreen';
import RandomRecipe from '../RandomRecipe';
import CreateRecipeScreen from '../CreateRecipeScreen';
import FavoritesScreen from '../FavoritesScreen';
import { getAuth, signOut } from 'firebase/auth';
import { Alert, View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente para los tabs de navegación
function HomeTabs({ email }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    // Obtener el usuario actual
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
    setLoadingUser(false);
  }, []);

  const handleSignOut = () => {
    setIsLoading(true);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.navigate('Login');
      })
      .catch((error) => {
        // An error happened.
        Alert.alert('Error', error.message);
        setIsLoading(false);
      });
  };

  if (loadingUser) {
    return (
      <View>
        <ActivityIndicator size='large' color='#1976d2' />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name='Home'
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <HomeScreen {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name='Receta aleatoria'
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🔀</Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <RandomRecipe {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name='Favoritos'
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>❤️</Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <FavoritesScreen {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name='Crear receta'
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>✍️</Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <CreateRecipeScreen {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name='Cerrar sesión'
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🚪</Text>
          ),
          headerShown: false,
        }}
      >
        {() => {
          useEffect(() => {
            handleSignOut();
          }, []);
          return null;
        }}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Navegador principal que incluye los tabs y las pantallas adicionales
export default function MainNavigator({ email }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' options={{ headerShown: false }}>
        {(props) => <HomeTabs {...props} email={email} />}
      </Stack.Screen>

      <Stack.Screen
        name='CategoryDetail'
        component={CategoryDetailScreen}
        options={{
          headerTitle: 'Categoria',
          headerBackTitle: 'Atrás',
          headerTintColor: '#000000',
        }}
      />

      <Stack.Screen
        name='RecipeDetail'
        component={RecipeDetailScreen}
        options={{
          headerTitle: 'Detalles de la receta',
          headerBackTitle: 'Atrás',
          headerTintColor: '#000000',
        }}
      />
    </Stack.Navigator>
  );
}
