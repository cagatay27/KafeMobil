import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useCart} from '../../../context/CartContext';
import CustomText from '../../atoms/Text/CustomText';
import styles from './ProductCard.style';

const ProductCard = ({product}) => {
  const {addToCart} = useCart();

  return (
    <View style={styles.container}>
      <Image source={{uri: product.image}} style={styles.image} />
      <View style={styles.details}>
        <CustomText type="subtitle">{product.name}</CustomText>
        <CustomText style={styles.price}>{product.price}₺</CustomText>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(product)}>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;
