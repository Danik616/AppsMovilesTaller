import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoryDetailScreen from "../CategoryDetailScreen";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import HomeScreen from "../HomeScreen";
import { Text } from "react-native";
import RecipeDetailScreen from "../RecipeDetailScreen";
import RandomRecipe from '../RandomRecipe';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente para los tabs de navegación
function HomeTabs({ email, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <HomeScreen {...props} email={email} onLogout={onLogout} />}
      </Tab.Screen>

      <Tab.Screen
        name="Receta aleatoria"
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
        name="Cerrar sesión"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🚪</Text>
          ),
          headerShown: false,
        }}
      >
        {() => {
          useEffect(() => {
            onLogout();
          }, []);
          return null;
        }}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Navegador principal que incluye los tabs y las pantallas adicionales
export default function MainNavigator({ email, onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => <HomeTabs {...props} email={email} onLogout={onLogout} />}
      </Stack.Screen>

      <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen} // Nueva pantalla
        options={{
          headerTitle: "Categoria",
          headerBackTitle: "Atrás",
          headerTintColor: "#000000",

        }}
      />

      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{
          headerTitle: "Detalles de la receta",
          headerBackTitle: "Atrás",
          headerTintColor: "#000000",
        }}
      />
    </Stack.Navigator>
  );
}

HomeTabs.propTypes = {
  email: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

MainNavigator.propTypes = {
  email: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};
