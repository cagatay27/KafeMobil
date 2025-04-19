import React from 'react';
import {View, FlatList} from 'react-native';
import ProductCard from '../../molecules/ProductCard/ProductCard';
import styles from './ProductList.style';

const ProductList = ({products}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({item}) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ProductList;
