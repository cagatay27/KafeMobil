import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet} from 'react-native';
import {COLORS} from '../styles/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCartShopping, faHeart, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: styles.tabBar,
        initialRouteName: 'Home',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size , focused}) => (
            <FontAwesomeIcon icon={faHouse} size={24} color= {focused ? "brown" : "gray"}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({color, size,focused}) => (
            <FontAwesomeIcon icon={faHeart} size={24} color= {focused ? "brown" : "gray"}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({color, size,focused}) => (
            <FontAwesomeIcon icon={faCartShopping} size={24} color= {focused ? "brown" : "gray"}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size,focused}) => (
            <FontAwesomeIcon icon={faUser} size={24} color= {focused ? "brown" : "gray"}></FontAwesomeIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopColor: COLORS.border,
  },
});

export default AppNavigator;
