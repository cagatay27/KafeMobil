import React, {useState, useEffect} from 'react';
import {ScrollView, View, SafeAreaView, StyleSheet} from 'react-native';
import {COLORS} from '../styles/theme';
import LocationHeader from '../components/organisms/LocationHeader/LocationHeader';
import SearchBar from '../components/molecules/SearchBar/SearchBar';
import CategoryList from '../components/organisms/CategoryList/CategoryList';
import ProductList from '../components/organisms/ProductList/ProductList';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('KAHVE');
  const [products, setProducts] = useState([]);

  // Mock ürün verileri
  const allProducts = {
    KAHVE: [
      {
        id: 1,
        name: 'Türk  Kahvesi',
        price: '100',
        image:
          'https://coffeetropic.com/wp-content/uploads/2020/05/turk-kahvesi.jpg',
      },
      {
        id: 2,
        name: 'Kahve',
        price: '100',
        image:
          'https://www.hataykapinda.com/wp-content/uploads/2020/08/Menengic02-1-1200x1200-1.png',
      },
      {
        id: 3,
        name: 'Kahve',
        price: '100',
        image:
          'https://i.lezzet.com.tr/images-xxlarge-recipe/turk-kahvesi-nasil-yapilir-ad36f6b1-b162-4b7f-a462-b1completelyb844f0.jpg',
      },
      {
        id: 4,
        name: 'Kahve',
        price: '100',
        image:
          'https://i.lezzet.com.tr/images-xxlarge-recipe/turk-kahvesi-nasil-yapilir-ad36f6b1-b162-4b7f-a462-b1completelyb844f0.jpg',
      },
    ],
    KURABİYE: [
      {
        id: 5,
        name: 'Çikolatalı Kurabiye',
        price: '50',
        image:
          'https://cdn.yemek.com/mncrop/940/625/uploads/2014/10/findikli-kurabiye-yemekcom.jpg',
      },
      {
        id: 6,
        name: 'Fındıklı Kurabiye',
        price: '60',
        image:
          'https://cdn.yemek.com/mncrop/940/625/uploads/2014/10/findikli-kurabiye-yemekcom.jpg',
      },
    ],
    YEMEKLER: [
      {
        id: 7,
        name: 'Tost',
        price: '80',
        image:
          'https://cdn.yemek.com/mncrop/940/625/uploads/2021/08/kasarli-tost-yemekcom.jpg',
      },
      {
        id: 8,
        name: 'Sandviç',
        price: '90',
        image:
          'https://cdn.yemek.com/mncrop/940/625/uploads/2015/11/tavuklu-sandvic-yeni.jpg',
      },
    ],
    'SOĞUK İÇECEKLER': [
      {
        id: 9,
        name: 'Limonata',
        price: '70',
        image:
          'https://cdn.yemek.com/mncrop/940/625/uploads/2015/04/ev-yapimi-limonata-yemekcom.jpg',
      },
      {
        id: 10,
        name: 'Soğuk Kahve',
        price: '85',
        image:
          'https://cdn.yemek.com/mncrop/940/625/uploads/2016/06/buzlu-kahve-yemekcom.jpg',
      },
    ],
  };

  useEffect(() => {
    setProducts(allProducts[selectedCategory] || []);
  }, [selectedCategory]);

  const handleSearch = text => {
    setSearchQuery(text);
    if (text) {
      const filteredProducts = allProducts[selectedCategory].filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase()),
      );
      setProducts(filteredProducts);
    } else {
      setProducts(allProducts[selectedCategory] || []);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LocationHeader location="Kafe Ottoman/Elazığ" />
      <SearchBar
        placeholder="Search.."
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <CategoryList onSelectCategory={setSelectedCategory} />
      <ProductList products={products} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default HomeScreen;
