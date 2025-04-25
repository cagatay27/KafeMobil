import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../../styles/theme';
import CustomText from '../../atoms/Text/CustomText';
import styles from './LocationHeader.style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const LocationHeader = ({location}) => {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faLocationDot} size={24} color='brown'></FontAwesomeIcon>
      <CustomText style={styles.locationText}>{location}</CustomText>
    </View>
  );
};

export default LocationHeader;
