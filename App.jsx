import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {CartProvider} from './src/context/CartContext';

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
