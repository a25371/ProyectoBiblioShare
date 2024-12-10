import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Search, Profile, Biblio, Social } from "./../screens";
import { colors } from "../config/theme";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const RootTabs = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#333' : colors?.primary,
          borderTopColor: theme === 'dark' ? '#555' : colors?.secondary,
          borderTopWidth: 2,
          height: 60,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarInactiveTintColor: theme === 'dark' ? '#888' : colors?.terciary + "cc",
        tabBarActiveTintColor: theme === 'dark' ? '#fff' : colors?.accent + "cc",
        tabBarIcon: ({ size, color }) => {
          let iconName;

          if (route.name === "Biblio") {
            iconName = "book";
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Profile") {
            iconName = "user";
          } else if (route.name === "Social") {
            iconName = "user-friends";
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarHideOnKeyboard: true
      })}
    >
      <Tab.Screen name="Biblio" component={Biblio} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Social" component={Social} />
    </Tab.Navigator>
  );
};

export default RootTabs;