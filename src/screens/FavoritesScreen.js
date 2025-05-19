import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../styles/theme';
import CustomText from '../components/atoms/Text/CustomText';
import {useFavorites} from '../context/FavoritesContext';
import {useCart} from '../context/CartContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash, faCartPlus} from '@fortawesome/free-solid-svg-icons';

const FavoritesScreen = () => {
  const {favorites, removeFromFavorites} = useFavorites();
  const {addToCart} = useCart();

  // Favori ürün kartı
  const renderFavoriteItem = ({item}) => (
    <View style={styles.favoriteItem}>
      <Image source={{uri: item.image}} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <CustomText type="subtitle">{item.name}</CustomText>
        <CustomText style={styles.itemPrice}>{item.price}₺</CustomText>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => addToCart(item)}>
          <FontAwesomeIcon icon={faCartPlus} size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => removeFromFavorites(item.id)}>
          <FontAwesomeIcon icon={faTrash} size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText type="title">Favoriler</CustomText>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <CustomText style={styles.emptyMessage}>
            Henüz favori ürününüz bulunmuyor.
          </CustomText>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    marginTop: 10,
    color: COLORS.secondary,
  },
  listContent: {
    padding: 16,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemPrice: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButton: {
    borderColor: '#e74c3c',
  },
});

export default FavoritesScreen;
