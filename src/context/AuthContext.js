import React, {createContext, useState, useContext, useEffect} from 'react';
import {auth} from '../config/firebase';
import {firestore} from '../config/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        // Admin kontrolü
        const isAdmin = user.email === 'admin@gmail.com';

        setUser({
          ...user,
          ...userDoc.data(),
          isAdmin: isAdmin,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          ...userData,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      // Admin kontrolü
      if (email === 'admin@gmail.com' && password === '123456') {
        return {...userCredential, isAdmin: true};
      }
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
