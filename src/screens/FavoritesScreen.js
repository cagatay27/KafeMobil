import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {COLORS} from '../styles/theme';
import CustomText from '../components/atoms/Text/CustomText';

const FavoritesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CustomText type="title">Favoriler</CustomText>
        <CustomText style={styles.message}>
          Henüz favori ürününüz bulunmuyor.
        </CustomText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
  },
});

export default FavoritesScreen;
