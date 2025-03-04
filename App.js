import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './screens/navigation/MainNavigation';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (email) => {
    // Mock successful login
    setUser({ email });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#ffffff' />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name='Login'>
              {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name='Main'>
              {(props) => (
                <MainNavigator
                  {...props}
                  email={user?.email}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
