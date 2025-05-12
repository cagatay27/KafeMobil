import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import CustomText from '../../atoms/Text/CustomText';
import {COLORS} from '../../../styles/theme';

const UrunDagilimi = ({data = []}) => {
  // Verilerin geçerli olup olmadığını kontrol et
  const validData = data.filter(
    item =>
      item &&
      item.name &&
      typeof item.value === 'number' &&
      !isNaN(item.value) &&
      item.value > 0,
  );

  // En az iki geçerli veri olması gerekiyor, aksi takdirde PieChart hata verebilir
  const hasValidData = validData.length > 0;

  return (
    <View style={styles.container}>
      <CustomText type="subtitle" style={styles.title}>
        Ürün Satış Dağılımı
      </CustomText>

      {hasValidData ? (
        <PieChart
          data={validData}
          width={Dimensions.get('window').width - 64}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <CustomText style={styles.emptyMessage}>
          Dağılım için yeterli veri bulunmuyor
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
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 16,
    color: COLORS.secondary,
  },
});

export default UrunDagilimi;
