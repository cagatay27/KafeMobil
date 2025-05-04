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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase, auth, firestore};
