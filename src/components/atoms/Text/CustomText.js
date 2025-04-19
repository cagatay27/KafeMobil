import React from 'react';
import {Text} from 'react-native';
import styles from './CustomText.style';

const CustomText = ({children, style, type = 'regular', ...props}) => {
  const textStyle = [
    styles.text,
    type === 'title' && styles.title,
    type === 'subtitle' && styles.subtitle,
    type === 'small' && styles.small,
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
