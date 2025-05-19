import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {COLORS} from '../styles/theme';
import CustomText from '../components/atoms/Text/CustomText';
import Button from '../components/atoms/Button/Button';
import {useAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';

const ProfileScreen = () => {
  const {user, signOut} = useAuth();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    await signOut();
    navigation.replace('Auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText type="title">Profil</CustomText>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <FontAwesomeIcon icon={faUser} size={80} color={COLORS.primary} />
          <CustomText type="title" style={styles.userName}>
            {user?.name || 'Kullanıcı'}
          </CustomText>
          <CustomText>{user?.email || ''}</CustomText>
        </View>

        <Button
          title="Çıkış Yap"
          type="secondary"
          onPress={handleSignOut}
          icon={
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size={20}
              color={COLORS.primary}
              style={styles.buttonIcon}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
  },
  profileCard: {
    padding: 16,
    backgroundColor: COLORS.card,
    margin: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ProfileScreen;
