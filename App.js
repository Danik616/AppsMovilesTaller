import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './screens/navigation/MainNavigation';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#ffffff' />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Register'
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Forgot Password'
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='Main'>
            {(props) => <MainNavigator {...props} />}
          </Stack.Screen>
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
