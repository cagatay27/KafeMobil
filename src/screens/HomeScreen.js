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
        name: 'Menengiç Kahvesi',
        price: '100',
        image:
          'https://www.hataykapinda.com/wp-content/uploads/2020/08/Menengic02-1-1200x1200-1.png',
      },
      {
        id: 3,
        name: 'Filtre Kahve',
        price: '100',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYMJIs8DvfpqJLaagmDjvxbPDSH9lJLGHwuA&s',
      },
      {
        id: 4,
        name: 'Espresso',
        price: '100',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgDuPqIWUwfn1egOtY9j_VZZ6fdaizTGYP6g&s',
      },
      {
        id: 5,
        name: 'Osmanlı Kahvesi',
        price: '100',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtIgbu5AuNmpcZZbzo-Zi4Lu_MIzEJ1ppjOg&s',
      },
    ],
    KURABİYE: [
      {
        id: 6,
        name: 'Çikolatalı Kurabiye',
        price: '50',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStkxWO0g7dn78I61tpqBG8ZB5HHLo3EBICRg&s',
      },
      {
        id: 7,
        name: 'Susamlı Kurabiye',
        price: '50',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU0z4AIXHl0CwdN70QRktDJ8ja1cCqZ8iP9w&s',
      },
      {
        id: 8,
        name: 'Kıbrıs Tatlısı',
        price: '75',
        image:
          'https://i.nefisyemektarifleri.com/2020/01/15/kibris-tatlisi-videolu.jpg',
      },
      {
        id: 9,
        name: 'Triliçe',
        price: '75',
        image: 'https://www.taddoy.com/uploads/thumb/2794414440.jpg',
      },
      {
        id: 10,
        name: 'Islak Kek',
        price: '60',
        image:
          'https://i.lezzet.com.tr/images-xxlarge/bol-soslu-islak-kek-d7ba240e-cc3e-4f80-9dab-59aeba9fa6cf',
      },
    ],
    YEMEKLER: [
      {
        id: 11,
        name: 'Tost',
        price: '80',
        image: 'https://i.nefisyemektarifleri.com/2021/02/12/ayvalik-tost.jpg',
      },
      {
        id: 12,
        name: 'Sandviç',
        price: '90',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Sandwich_%281%29.jpg/330px-Sandwich_%281%29.jpg',
      },
      {
        id: 12,
        name: 'Poğaça',
        price: '15',
        image:
          'https://cdn.ye-mek.net/App_UI/Img/out/650/2017/04/susamli-pogaca-resimli-yemek-tarifi(16).jpg',
      },
      {
        id: 13,
        name: 'Simit',
        price: '90',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Simit-2x.JPG/500px-Simit-2x.JPG',
      },
    ],
    'SOĞUK İÇECEKLER': [
      {
        id: 14,
        name: 'Limonata',
        price: '70',
        image:
          'https://i.lezzet.com.tr/images-xxlarge-recipe/ev-yapimi-konsantre-limonata-01e50b99-5890-411f-a4c2-997a71e8a5cc.jpg',
      },
      {
        id: 15,
        name: 'Cold Brew',
        price: '85',
        image:
          'https://lifesimplified.gorenje.com/wp-content/uploads/2024/06/gorenje-blog-refreshing_cold_brew_coffee.jpg',
      },
      {
        id: 16,
        name: 'Kola',
        price: '85',
        image:
          'https://i.pinimg.com/736x/59/16/7e/59167ebdb4d3433abeab26cfb6dbb50d.jpg',
      },
      {
        id: 17,
        name: 'Iced Latte',
        price: '85',
        image:
          'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/iced-latte-30188f7.jpg?quality=90&webp=true&resize=375,341',
      },
      {
        id: 18,
        name: 'Iced Mocha',
        price: '85',
        image:
          'https://www.barrelleaf.com/wp-content/uploads/2024/07/iced-mocha-latte-BarrelLeaf-2.jpg',
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
