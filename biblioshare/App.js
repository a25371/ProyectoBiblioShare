import React, { useEffect, useState, useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import * as SplashScreen from "expo-splash-screen";
import * as Font from 'expo-font';
import { Lexend_400Regular, Lexend_700Bold } from '@expo-google-fonts/lexend';
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootTabs from "./navigators/RootTabs";
import BookDetailsScreen from "./screens/BookDetailsScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateUserScreen from "./screens/CreateUserScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ListDetails from './screens/ListDetails';
import ReviewScreen from './screens/ReviewScreen';
import BookListScreen from './screens/BookListScreen';
import ReadingStatusScreen from './screens/ReadingStatusScreen';
import UserProfile from './screens/UserProfile';
import UserSearchScreen from './screens/UserSearchScreen';
import { getUserProfile } from './utils/API';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const ThemedNavigationContainer = ({ isLoggedIn }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName={isLoggedIn ? "RootTabs" : "Login"}>
        <Stack.Screen name="RootTabs" component={RootTabs} options={{ headerShown: false }} />
        <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={CreateUserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ListDetails" component={ListDetails} options={{ headerShown: false }} />
        <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BookListScreen" component={BookListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ReadingStatusScreen" component={ReadingStatusScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
        <Stack.Screen name="UserSearchScreen" component={UserSearchScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.log('User ID is null');
          setIsLoggedIn(false);
          return;
        }
        const userProfile = await getUserProfile(userId);
        if (userProfile) {
          console.log(`User ID: ${userId}, Username: ${userProfile.username}`);
          setIsLoggedIn(true);
        } else {
          console.log('Invalid user profile');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error validating user token:', error);
        setIsLoggedIn(false);
      }
    } else {
      console.log('No token found');
      setIsLoggedIn(false);
    }
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      Lexend_400Regular,
      Lexend_700Bold,
    });
    setFontsLoaded(true);
  };

  const prepareApp = async () => {
    try {
      await checkLoginStatus();
      await loadFonts();
    } catch (e) {
      console.warn(e);
    } finally {
      SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    prepareApp();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <ThemedNavigationContainer isLoggedIn={isLoggedIn} />
    </ThemeProvider>
  );
}