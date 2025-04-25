import React from 'react';
import {View, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../../styles/theme';
import styles from './SearchBar.style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({placeholder, onChangeText, value}) => {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faMagnifyingGlass} size={24} color='brown' style={{marginRight : 10}}></FontAwesomeIcon>
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Search...'}
        placeholderTextColor={COLORS.secondary}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

export default SearchBar;
