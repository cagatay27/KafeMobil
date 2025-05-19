import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useCart} from '../../../context/CartContext';
import {useFavorites} from '../../../context/FavoritesContext';
import CustomText from '../../atoms/Text/CustomText';
import {COLORS} from '../../../styles/theme';
import styles from './ProductCard.style';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCartPlus,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import {faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons';

const ProductCard = ({product}) => {
  const {addToCart} = useCart();
  const {toggleFavorite, isFavorite} = useFavorites();
  const navigation = useNavigation();

  const isProductFavorite = isFavorite(product.id);

  return (
    <View style={styles.container}>
      <Image source={{uri: product.image}} style={styles.image} />
      <View style={styles.details}>
        <CustomText type="subtitle">{product.name}</CustomText>
        <CustomText style={styles.price}>{product.price}₺</CustomText>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product)}>
          <FontAwesomeIcon
            icon={isProductFavorite ? faHeartSolid : faHeartRegular}
            size={18}
            color={isProductFavorite ? '#e74c3c' : COLORS.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(product)}>
          <FontAwesomeIcon icon={faCartPlus} size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;
