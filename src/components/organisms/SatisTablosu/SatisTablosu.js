import React from 'react';
import {View, StyleSheet} from 'react-native';
import {DataTable} from 'react-native-paper';
import CustomText from '../../atoms/Text/CustomText';
import {COLORS} from '../../../styles/theme';

const SatisTablosu = ({satislar = []}) => {
  // Tarih formatını güvenli şekilde dönüştürme
  const formatTarih = tarih => {
    try {
      // Eğer tarih bir Firebase Timestamp ise
      if (tarih && typeof tarih.toDate === 'function') {
        return new Date(tarih.toDate()).toLocaleDateString();
      }
      // Eğer tarih zaten bir Date nesnesi ise
      else if (tarih instanceof Date) {
        return tarih.toLocaleDateString();
      }
      // Eğer tarih bir sayı veya string ise
      else if (tarih) {
        return new Date(tarih).toLocaleDateString();
      }
      // Hiçbiri değilse boş değer döndür
      return '-';
    } catch (error) {
      console.error('Tarih dönüştürme hatası:', error);
      return '-';
    }
  };

  return (
    <View style={styles.container}>
      <CustomText type="subtitle" style={styles.title}>
        Son Siparişler
      </CustomText>

      {satislar.length > 0 ? (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Ürün</DataTable.Title>
            <DataTable.Title numeric>Adet</DataTable.Title>
            <DataTable.Title numeric>Fiyat</DataTable.Title>
            <DataTable.Title>Tarih</DataTable.Title>
          </DataTable.Header>

          {satislar.slice(0, 10).map((satis, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{satis.urun_adi || '-'}</DataTable.Cell>
              <DataTable.Cell numeric>{satis.adet || 0}</DataTable.Cell>
              <DataTable.Cell numeric>
                {satis.fiyat ? `${satis.fiyat}₺` : '0₺'}
              </DataTable.Cell>
              <DataTable.Cell>{formatTarih(satis.tarih)}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      ) : (
        <CustomText style={styles.emptyMessage}>
          Henüz veri bulunmuyor
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
  emptyMessage: {
    textAlign: 'center',
    padding: 16,
    color: COLORS.secondary,
  },
});

export default SatisTablosu;
