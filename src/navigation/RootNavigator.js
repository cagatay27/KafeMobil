import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Navigators
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import AdminPanel from '../screens/AdminPanel';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="App" component={AppNavigator} />
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
