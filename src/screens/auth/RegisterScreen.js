import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const {signUp} = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, {name});
      navigation.replace('App');
    } catch (error) {
      Alert.alert('Hata', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://tatmixkuruyemis.com.tr/assets/uploads/e668cd9afe7634ab990f7c1d4b8ae66b.png.webp',
      }}
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>Yeni bir hesap oluşturun</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>👤 Ad Soyad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="#8B4513"
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>📧 E-posta</Text>
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                placeholderTextColor="#8B4513"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>🔒 Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#8B4513"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}>
            <Text style={styles.registerButtonText}>
              {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#FFFFFF',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#4A2B1D',
  },
  registerButton: {
    backgroundColor: '#D4A574',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#4A2B1D',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
