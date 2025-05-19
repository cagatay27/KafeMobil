import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  I18nManager,
} from 'react-native';
import {COLORS} from '../styles/theme';
import CustomText from '../components/atoms/Text/CustomText';
import {
  firestore,
  sanitizeData,
  addDocument,
  getCurrentUser,
  isUserLoggedIn,
} from '../config/firebase';
import {useAuth} from '../context/AuthContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faPaperPlane,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

// Bölgesel ayarları kontrol et (Türkçe karakter desteği için)
if (Platform.OS === 'android') {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}

const CommentsScreen = ({navigation, route}) => {
  const {user} = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Route params güvenli bir şekilde al
  const params = route?.params || {};
  const productId = params.productId ? String(params.productId) : null;
  const productName = params.productName || 'Ürün';

  // Debug için params bilgilerini yazdır
  useEffect(() => {
    console.log('CommentsScreen params:', JSON.stringify(params));
    console.log('productId:', productId);
    console.log('productName:', productName);
  }, []);

  // Debug için kullanıcı bilgilerini yazdır
  useEffect(() => {
    if (user) {
      console.log(
        'Giriş yapan kullanıcı bilgileri:',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          metadata: user._user?.metadata,
        }),
      );
    } else {
      console.log('Giriş yapmış kullanıcı yok');
    }
  }, [user]);

  // Firestore'daki yorum koleksiyonunu dinleme durumu
  const [listeningToComments, setListeningToComments] = useState(false);

  // Yorumları Firestore'dan çek
  useEffect(() => {
    if (listeningToComments) return; // Zaten dinleme modundaysa tekrar başlatma

    let commentsRef = firestore().collection('yorumlar');

    try {
      // Eğer belirli bir ürün için yorum gösterilecekse filtreleme yap
      if (productId) {
        console.log(`Ürün filtreleniyor: ${productId}`);
        commentsRef = commentsRef.where('productId', '==', productId);
      }

      const unsubscribe = commentsRef.orderBy('tarih', 'desc').onSnapshot(
        querySnapshot => {
          if (!querySnapshot) {
            setComments([]);
            setLoading(false);
            return;
          }

          const commentsData = querySnapshot.docs
            .map(doc => {
              try {
                const data = doc.data();
                return {
                  id: doc.id,
                  ...data,
                  // Veri bütünlüğü için boş değerleri varsayılan değerlerle doldur
                  kullanici_adi: data.kullanici_adi || 'Kullanıcı',
                  yorum: data.yorum || '',
                  tarih: data.tarih || new Date(),
                };
              } catch (docError) {
                console.error('Belge işleme hatası:', docError);
                return null;
              }
            })
            .filter(item => item !== null); // Hatalı belgeleri filtrele

          console.log(`${commentsData.length} yorum yüklendi`);
          setComments(commentsData);
          setLoading(false);
          // Dinleme modunu aktif et
          setListeningToComments(true);
        },
        error => {
          console.error('Yorumlar çekilirken hata oluştu:', error);
          Alert.alert('Hata', 'Yorumlar yüklenirken bir sorun oluştu.');
          setLoading(false);
          setListeningToComments(false);
        },
      );

      return () => {
        try {
          if (unsubscribe) {
            unsubscribe();
            setListeningToComments(false);
          }
        } catch (err) {
          console.error('Abonelik iptali hatası:', err);
        }
      };
    } catch (setupError) {
      console.error('Firestore bağlantı hatası:', setupError);
      setLoading(false);
      setListeningToComments(false);
      Alert.alert(
        'Bağlantı Hatası',
        'Veri tabanına bağlanırken bir sorun oluştu.',
      );
      return () => {};
    }
  }, [productId, listeningToComments]);

  // Yeni yorum gönder
  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir yorum yazın.');
      return;
    }

    // Firebase Auth ve Context API üzerinden çift kontrol
    const firebaseUser = getCurrentUser();
    if (!user || !firebaseUser) {
      Alert.alert('Uyarı', 'Yorum yapabilmek için giriş yapmalısınız.');
      return;
    }

    try {
      setSending(true);

      // Kullanıcı adını doğru şekilde belirle
      let username;

      // Önce displayName kontrolü yap
      if (user.displayName) {
        username = user.displayName;
      }
      // Sonra email kontrolü yap
      else if (user.email) {
        username = user.email.split('@')[0];
      }
      // Hiçbiri yoksa kullanıcı ID'sinin ilk 5 karakterini kullan
      else if (user.uid) {
        username = `Kullanıcı_${user.uid.substring(0, 5)}`;
      }
      // Son çare olarak "Kullanıcı" kullan
      else {
        username = 'Kullanıcı';
      }

      // Debug için konsola yazdır
      console.log('Belirlenmiş kullanıcı adı:', username);
      console.log('Firebase kullanıcısı:', firebaseUser.uid);

      // Temel yorum verilerini tanımla
      let newComment = {
        kullanici_adi: username,
        userId: user.uid,
        email: user.email, // Email bilgisini de ekleyelim (sadece backend kullanımı için)
        yorum: comment.trim(),
        tarih: firestore.FieldValue.serverTimestamp(),
      };

      // Eğer ürüne özel yorum ise ve productId tanımlıysa ürün bilgilerini ekle
      if (productId) {
        newComment.productId = productId;
        newComment.productName = productName;
      }

      console.log('Gönderilecek yorum verisi:', JSON.stringify(newComment));

      // Yeni yardımcı fonksiyonu kullanarak yorum ekle
      const result = await addDocument('yorumlar', newComment);
      console.log('Eklenen yorum ID:', result.id);

      // İşlem başarılı olduğunda
      setComment('');
      setSending(false);
      // Yorumların canlı güncellenmesi için dinleme modunu sıfırla
      setListeningToComments(false);
      Alert.alert('Başarılı', 'Yorumunuz başarıyla gönderildi.');
    } catch (error) {
      console.error('Yorum gönderilirken hata oluştu:', error);

      // Hata mesajını daha ayrıntılı göster
      let errorMessage = 'Yorumunuz gönderilemedi. ';

      if (error.code === 'permission-denied') {
        errorMessage +=
          'Yetki hatası: Firebase güvenlik kurallarınızı kontrol edin.';
      } else if (error.code) {
        errorMessage += `Hata kodu: ${error.code}`;
      } else {
        errorMessage += error.message || 'Bilinmeyen hata';
      }

      Alert.alert('Hata', errorMessage);
      setSending(false);
    }
  };

  // Tarih formatla - Hata kontrolü ekleniyor
  const formatDate = date => {
    if (!date) return '';

    try {
      // Firestore timestamp'i tarih nesnesine dönüştür
      const dateObj = date.toDate ? date.toDate() : new Date(date);

      return (
        dateObj.toLocaleDateString('tr-TR') +
        ' ' +
        dateObj.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch (error) {
      console.log('Tarih formatı hatası:', error);
      return 'Geçersiz tarih';
    }
  };

  // Yorum öğesini render et
  const renderCommentItem = ({item}) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.userInfo}>
          <FontAwesomeIcon icon={faUser} size={16} color={COLORS.primary} />
          <CustomText style={styles.username}>{item.kullanici_adi}</CustomText>
        </View>
        <CustomText style={styles.date}>{formatDate(item.tarih)}</CustomText>
      </View>
      {item.productName && item.productId !== productId && (
        <CustomText style={styles.productName}>
          "{item.productName}" hakkında
        </CustomText>
      )}
      <CustomText style={styles.commentText}>{item.yorum}</CustomText>
    </View>
  );

  // Ekran başlığını belirle
  const screenTitle = productId ? `${productName} Yorumları` : 'Tüm Yorumlar';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <CustomText type="title">{screenTitle}</CustomText>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <CustomText style={styles.loadingText}>
            Yorumlar yükleniyor...
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.commentsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>
                Henüz yorum yapılmamış. İlk yorumu siz yapın!
              </CustomText>
            </View>
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yorumunuzu yazın..."
          placeholderTextColor={COLORS.secondary}
          value={comment}
          onChangeText={text => {
            // Her türlü karakteri kabul et
            setComment(text);
          }}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          textContentType="none"
          maxLength={500}
        />
        <TouchableOpacity
          onPress={handleSubmitComment}
          style={styles.sendButton}
          disabled={sending}>
          {sending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} size={18} color="#FFF" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: COLORS.primary,
  },
  commentsList: {
    padding: 16,
    paddingBottom: 100,
  },
  commentItem: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: COLORS.primary,
  },
  date: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  productName: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  commentText: {
    lineHeight: 20,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 100,
    color: COLORS.text,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    opacity: 0.6,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.secondary,
  },
});

export default CommentsScreen;
