import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './CategoryButton.style';

const CategoryButton = ({title, icon, isActive, onPress, style}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive ? styles.activeContainer : styles.inactiveContainer,
        style,
      ]}
      onPress={onPress}>
      <View style={styles.content}>
        {icon}
        <Text
          style={[
            styles.text,
            isActive ? styles.activeText : styles.inactiveText,
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryButton;
