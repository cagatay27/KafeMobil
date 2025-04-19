import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../../../styles/theme';
import CategoryButton from '../../molecules/CategoryButton/CategoryButton';
import styles from './CategoryList.style';

const CategoryList = ({onSelectCategory}) => {
  const [selectedCategory, setSelectedCategory] = useState('KAHVE');

  const categories = [
    {id: 'KAHVE', title: 'KAHVE', icon: 'coffee'},
    {id: 'KURABİYE', title: 'KURABİYE', icon: 'cookie'},
    {id: 'YEMEKLER', title: 'YEMEKLER', icon: 'utensils'},
    {id: 'SOĞUK İÇECEKLER', title: 'SOĞUK İÇECEKLER', icon: 'glass-whiskey'},
  ];

  const handleSelect = categoryId => {
    setSelectedCategory(categoryId);
    onSelectCategory && onSelectCategory(categoryId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {categories.map(category => (
          <CategoryButton
            key={category.id}
            title={category.title}
            icon={
              <Icon
                name={category.icon}
                size={16}
                color={
                  selectedCategory === category.id ? '#fff' : COLORS.primary
                }
              />
            }
            isActive={selectedCategory === category.id}
            onPress={() => handleSelect(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryList;
