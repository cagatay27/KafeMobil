import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet} from 'react-native';
import {COLORS} from '../styles/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCartShopping,
  faComment,
  faHeart,
  faHouse,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for screens that need nested navigation
const HomeStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Comments" component={CommentsScreen} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
    <Stack.Screen name="Comments" component={CommentsScreen} />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="CartMain" component={CartScreen} />
    <Stack.Screen name="Comments" component={CommentsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Comments" component={CommentsScreen} />
  </Stack.Navigator>
);

const CommentsStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="CommentsMain" component={CommentsScreen} />
  </Stack.Navigator>
);

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
        component={HomeStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesomeIcon
              icon={faHouse}
              size={24}
              color={focused ? 'brown' : 'gray'}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesomeIcon
              icon={faHeart}
              size={24}
              color={focused ? 'brown' : 'gray'}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesomeIcon
              icon={faCartShopping}
              size={24}
              color={focused ? 'brown' : 'gray'}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Comments"
        component={CommentsStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesomeIcon
              icon={faComment}
              size={24}
              color={focused ? 'brown' : 'gray'}></FontAwesomeIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesomeIcon
              icon={faUser}
              size={24}
              color={focused ? 'brown' : 'gray'}></FontAwesomeIcon>
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
