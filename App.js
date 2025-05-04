import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import {CartProvider} from './src/context/CartContext';
import {AuthProvider} from './src/context/AuthContext';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
