import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from '../../atoms/Text/CustomText';
import {COLORS} from '../../../styles/theme';

const BirlikteSatilanlarListesi = ({items = []}) => {
  // Boş veya null öğeleri filtrele
  const validItems = Array.isArray(items)
    ? items.filter(
        item =>
          item &&
          item.pair &&
          typeof item.count === 'number' &&
          !isNaN(item.count),
      )
    : [];

  return (
    <View style={styles.container}>
      <CustomText type="subtitle" style={styles.title}>
        En Çok Birlikte Satılan Ürünler
      </CustomText>
      {validItems.length > 0 ? (
        validItems.map((item, index) => (
          <View key={index} style={styles.item}>
            <CustomText>{item.pair}</CustomText>
            <CustomText>{item.count} kez</CustomText>
          </View>
        ))
      ) : (
        <CustomText style={styles.emptyMessage}>
          Birlikte satılan ürün verisi bulunmuyor
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.card,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 16,
    color: COLORS.secondary,
  },
});

export default BirlikteSatilanlarListesi;
