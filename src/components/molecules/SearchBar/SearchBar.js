import React from 'react';
import {View, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../../styles/theme';
import styles from './SearchBar.style';

const SearchBar = ({placeholder, onChangeText, value}) => {
  return (
    <View style={styles.container}>
      <Icon
        name="search-outline"
        size={20}
        color={COLORS.secondary}
        style={styles.icon}
      />
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
