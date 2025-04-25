import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import {CartProvider} from './src/context/CartContext';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
