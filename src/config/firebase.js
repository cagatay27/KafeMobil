import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyALPm7cLXp9hAIBNvZ9M87PENK2b8jCa1w',
  authDomain: 'stok-urun.firebaseapp.com',
  projectId: 'stok-urun',
  storageBucket: 'stok-urun.firebasestorage.app',
  messagingSenderId: '616262886686',
  appId: '1:616262886686:android:5f4e803e4b2c94bee7950f',
};

let firestoreDb;

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);

    // Firestore ayarlarını yapılandır
    firestoreDb = firebase.firestore();

    // Türkçe karakter desteği ve Unicode için
    firestoreDb.settings({
      ignoreUndefinedProperties: true, // undefined değerleri yok say
      persistence: true, // offline veri desteği
    });

    console.log('Firebase başarıyla başlatıldı');
  } catch (error) {
    console.error('Firebase başlatma hatası:', error);
  }
} else {
  firestoreDb = firebase.firestore();
}

// Yardımcı fonksiyonlar
const sanitizeData = data => {
  if (!data) return {};

  const sanitized = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      // String değerleri temizle
      if (typeof data[key] === 'string') {
        sanitized[key] = data[key];
      } else {
        sanitized[key] = data[key];
      }
    }
  });

  return sanitized;
};

// Mevcut kullanıcıyı kontrol et
const getCurrentUser = () => {
  return auth().currentUser;
};

// Kullanıcı giriş yapmış mı kontrol et
const isUserLoggedIn = () => {
  return !!getCurrentUser();
};

// Firestore'a belge ekleme yardımcı fonksiyonu
const addDocument = async (collection, data) => {
  try {
    // Veriyi temizle
    const cleanData = sanitizeData(data);

    // Kullanıcı kimlik bilgilerini ekle (varsa)
    const currentUser = getCurrentUser();
    if (currentUser && !cleanData.userId) {
      cleanData.userId = currentUser.uid;

      // Kullanıcı adını güvenli şekilde ekle
      if (!cleanData.kullanici_adi) {
        if (currentUser.displayName) {
          cleanData.kullanici_adi = currentUser.displayName;
        } else if (currentUser.email) {
          cleanData.kullanici_adi = currentUser.email.split('@')[0];
        } else {
          cleanData.kullanici_adi = `Kullanıcı_${currentUser.uid.substring(
            0,
            5,
          )}`;
        }
      }
    }

    // Zaman bilgisi ekle (yoksa)
    if (!cleanData.tarih) {
      cleanData.tarih = firestore.FieldValue.serverTimestamp();
    }

    // Belgeyi ekle
    const docRef = await firestoreDb.collection(collection).add(cleanData);
    console.log(`Belge eklendi: ${collection}/${docRef.id}`);
    return {id: docRef.id, ...cleanData};
  } catch (error) {
    console.error(`Belge eklenirken hata: ${collection}`, error);
    throw error;
  }
};

export {
  firebase,
  auth,
  firestore,
  sanitizeData,
  addDocument,
  getCurrentUser,
  isUserLoggedIn,
};
