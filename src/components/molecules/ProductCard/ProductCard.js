import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

import {useCart} from '../../../context/CartContext';
import CustomText from '../../atoms/Text/CustomText';
import styles from './ProductCard.style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCartPlus, faPlus } from '@fortawesome/free-solid-svg-icons';



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
          <FontAwesomeIcon icon = {faCartPlus} size={18} color='white'></FontAwesomeIcon>
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;
