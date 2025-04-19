import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {COLORS} from '../../../styles/theme';
import styles from './Button.style';

const Button = ({title, onPress, type = 'primary', icon, style}) => {
  const buttonStyle = [
    styles.button,
    type === 'primary' && styles.primaryButton,
    type === 'secondary' && styles.secondaryButton,
    style,
  ];

  const textStyle = [
    styles.text,
    type === 'primary' && styles.primaryText,
    type === 'secondary' && styles.secondaryText,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      {icon}
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
