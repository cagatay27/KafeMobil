import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../styles/theme';
import CustomText from '../components/atoms/Text/CustomText';
import {firestore} from '../config/firebase';
import {useAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowRightFromBracket,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';

// Bileşenler
import StatCard from '../components/atoms/StatCard/StatCard';
import BirlikteSatilanlarListesi from '../components/molecules/BirlikteSatilanlarListesi/BirlikteSatilanlarListesi';
import SatisTablosu from '../components/organisms/SatisTablosu/SatisTablosu';
import UrunDagilimi from '../components/organisms/UrunDagilimi/UrunDagilimi';

const AdminPanel = () => {
  const {user, signOut} = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [satislar, setSatislar] = useState([]);
  const [toplamSatis, setToplamSatis] = useState(0);
  const [toplamKazanc, setToplamKazanc] = useState(0);
  const [urunDagilimi, setUrunDagilimi] = useState([]);
  const [birlikteSatilanlar, setBirlikteSatilanlar] = useState([]);

  // Admin yetkisi kontrolü
  useEffect(() => {
    if (!user?.isAdmin) {
      Alert.alert(
        'Yetkisiz Erişim',
        'Bu sayfaya erişim yetkiniz bulunmamaktadır',
      );
      navigation.replace('Auth');
    }
  }, [user, navigation]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  // Veri güvenli bir şekilde alınır
  const safeGetValue = (obj, path, defaultValue = 0) => {
    try {
      const keys = path.split('.');
      let result = obj;
      for (const key of keys) {
        if (result === null || result === undefined) return defaultValue;
        result = result[key];
      }
      return result !== null && result !== undefined ? result : defaultValue;
    } catch (error) {
      console.error(`safeGetValue hatası (${path}):`, error);
      return defaultValue;
    }
  };

  useEffect(() => {
    const fetchSatislar = async () => {
      try {
        setLoading(true);
        setError(null);

        const satislarSnapshot = await firestore()
          .collection('satislar')
          .orderBy('tarih', 'desc')
          .get();

        // Veri formatlama ve doğrulama
        const satislarData = satislarSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            urun_adi: safeGetValue(data, 'urun_adi', '-'),
            adet: parseInt(safeGetValue(data, 'adet', 0)),
            fiyat: parseFloat(safeGetValue(data, 'fiyat', 0)),
            sepetId: safeGetValue(data, 'sepetId', ''),
            tarih: data.tarih || new Date(), // Eğer tarih yoksa şu anki tarih
          };
        });

        setSatislar(satislarData);

        // Toplam satış ve kazanç hesaplama (hata kontrolü ile)
        const toplam = satislarData.length;
        const kazanc = satislarData.reduce((sum, satis) => {
          const fiyat = parseFloat(safeGetValue(satis, 'fiyat', 0));
          const adet = parseInt(safeGetValue(satis, 'adet', 0));
          const artis = fiyat * adet;
          // NaN kontrolü
          return isNaN(artis) ? sum : sum + artis;
        }, 0);

        setToplamSatis(toplam);
        setToplamKazanc(kazanc);

        // Ürün dağılımı hesaplama (hata kontrolü ile)
        const urunler = {};
        satislarData.forEach(satis => {
          const urunAdi = safeGetValue(satis, 'urun_adi', '-');
          const adet = parseInt(safeGetValue(satis, 'adet', 0));

          if (!isNaN(adet) && urunAdi !== '-') {
            if (urunler[urunAdi]) {
              urunler[urunAdi] += adet;
            } else {
              urunler[urunAdi] = adet;
            }
          }
        });

        const dagilim = Object.entries(urunler).map(([name, value]) => ({
          name,
          value,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        }));

        setUrunDagilimi(dagilim);

        // Birlikte satılan ürünleri hesaplama (hata kontrolü ile)
        const sepetler = {};
        satislarData.forEach(satis => {
          const sepetId = safeGetValue(satis, 'sepetId', '');
          const urunAdi = safeGetValue(satis, 'urun_adi', '');

          if (sepetId && urunAdi) {
            if (!sepetler[sepetId]) {
              sepetler[sepetId] = [];
            }
            sepetler[sepetId].push(urunAdi);
          }
        });

        const birlikteSatilan = {};
        Object.values(sepetler).forEach(urunler => {
          if (urunler.length > 1) {
            for (let i = 0; i < urunler.length; i++) {
              for (let j = i + 1; j < urunler.length; j++) {
                const pair = [urunler[i], urunler[j]].sort().join(' - ');
                birlikteSatilan[pair] = (birlikteSatilan[pair] || 0) + 1;
              }
            }
          }
        });

        const enCokSatilanlar = Object.entries(birlikteSatilan)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([pair, count]) => ({pair, count}));

        setBirlikteSatilanlar(enCokSatilanlar);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        setError(error.message);
        Alert.alert(
          'Hata',
          `Veriler yüklenirken bir hata oluştu: ${error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSatislar();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <CustomText style={styles.loadingText}>
          Veriler yükleniyor...
        </CustomText>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.errorContainer]}>
        <FontAwesomeIcon
          icon={faCircleExclamation}
          size={50}
          color={COLORS.error}
        />
        <CustomText style={styles.errorText}>
          Bir hata oluştu: {error}
        </CustomText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace('AdminPanel')}>
          <CustomText style={styles.retryButtonText}>Tekrar Dene</CustomText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText type="title">Admin Paneli</CustomText>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.statsContainer}>
          <StatCard title="Toplam Satış" value={toplamSatis.toString()} />
          <StatCard
            title="Toplam Kazanç"
            value={`${toplamKazanc.toFixed(2)}₺`}
          />
        </View>

        <UrunDagilimi data={urunDagilimi} />

        <BirlikteSatilanlarListesi items={birlikteSatilanlar} />

        <SatisTablosu satislar={satislar} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signOutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
});

export default AdminPanel;
