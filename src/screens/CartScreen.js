import React from 'react';
import {View, FlatList, SafeAreaView, StyleSheet, Alert} from 'react-native';
import {COLORS} from '../styles/theme';
import {useCart} from '../context/CartContext';
import CustomText from '../components/atoms/Text/CustomText';
import Button from '../components/atoms/Button/Button';
import {firestore} from '../config/firebase';

const CartScreen = () => {
  const {cart, removeFromCart, clearCart} = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  const handleCompleteOrder = async () => {
    try {
      // Benzersiz bir sepet ID'si oluştur
      const sepetId = firestore().collection('satislar').doc().id;
      const tarih = new Date();

      // Her ürün için satış kaydı oluştur
      const satisPromises = cart.map(item => {
        return firestore()
          .collection('satislar')
          .add({
            adet: item.quantity,
            fiyat: parseFloat(item.price),
            id: item.id,
            sepetId: sepetId,
            tarih: tarih,
            urun_adi: item.name,
          });
      });

      // Tüm satış kayıtlarını oluştur
      await Promise.all(satisPromises);

      // Sepeti temizle
      clearCart();
      Alert.alert('Başarılı', 'Siparişiniz başarıyla tamamlandı!');
    } catch (error) {
      Alert.alert(
        'Hata',
        'Sipariş tamamlanırken bir hata oluştu: ' + error.message,
      );
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.cartItem}>
      <View>
        <CustomText type="subtitle">{item.name}</CustomText>
        <CustomText>
          {item.price}₺ x {item.quantity}
        </CustomText>
      </View>
      <Button
        title="Kaldır"
        type="secondary"
        onPress={() => removeFromCart(item.id)}
        style={styles.removeButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText type="title">Sepetim</CustomText>
      </View>

      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <CustomText type="subtitle">Toplam:</CustomText>
              <CustomText type="subtitle">{totalPrice.toFixed(2)}₺</CustomText>
            </View>

            <Button title="Siparişi Tamamla" onPress={handleCompleteOrder} />
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <CustomText>Sepetinizde ürün bulunmuyor.</CustomText>
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
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartScreen;
