import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../../styles/theme';
import CustomText from '../../atoms/Text/CustomText';
import styles from './LocationHeader.style';

const LocationHeader = ({location}) => {
  return (
    <View style={styles.container}>
      <Icon name="location-outline" size={22} color={COLORS.primary} />
      <CustomText style={styles.locationText}>{location}</CustomText>
    </View>
  );
};

export default LocationHeader;
