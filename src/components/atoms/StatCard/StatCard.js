import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from '../Text/CustomText';
import {COLORS} from '../../../styles/theme';

const StatCard = ({title, value}) => (
  <View style={styles.card}>
    <CustomText type="subtitle">{title}</CustomText>
    <CustomText type="title">{value}</CustomText>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    margin: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default StatCard;
