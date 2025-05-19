import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {COLORS} from '../styles/theme';
import CustomText from '../components/atoms/Text/CustomText';
import {firestore} from '../config/firebase';
import {useAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faRightFromBracket,
  faCircleExclamation,
  faRobot,
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

  // Yapay zeka analizi için state'ler
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

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

  // Yapay zeka analizi yap
  const handleAiAnalysis = async () => {
    try {
      setAiLoading(true);
      setShowAiModal(true);

      // TEST VERISI - Gerçek API yanıt vermeye geçilince kaldırabilirsiniz
      const useTestData = true; // Test modunu aktif etmek için true yapın

      if (useTestData) {
        // Yapay test verisi
        setTimeout(() => {
          const testResponse = {
            enAzSatilanUrunler: ['Chai Latte', 'Soğuk Kahve', 'Vegan Sandviç'],
            dusuSatisDoganlari: [
              'Chai Latte: Salı, Perşembe',
              'Soğuk Kahve: Pazartesi, Çarşamba',
              'Vegan Sandviç: Cuma, Pazar',
            ],
            kampanyaOnerileri: [
              'Salı-Perşembe: Chai Latte alana Cheesecake %50 indirimli',
              'Pazartesi: Soğuk Kahve & Kurabiye combo paketi %20 indirimli',
            ],
            kampanyaGunleri: [
              'Salı ve Perşembe: En düşük satış günlerinde Chai Latte kampanyası',
              'Pazartesi: Soğuk kahve satışlarını artırmak için ideal gün',
              'Cuma: Hafta sonu öncesi Vegan ürünlere özel indirim',
            ],
          };
          setAiResponse(testResponse);
          setAiLoading(false);
        }, 1500);
        return;
      }

      // Gemini API'ye gönderilecek veriyi hazırla - sadece gerekli verileri gönder ve veriyi basitleştir
      const simplifiedSatislar = satislar.map(satis => ({
        urun_adi: satis.urun_adi,
        adet: satis.adet,
        fiyat: satis.fiyat,
        tarih: satis.tarih
          ? new Date(satis.tarih.seconds * 1000).toISOString().split('T')[0]
          : null,
      }));

      const simplifiedBirlikte = birlikteSatilanlar.map(item => ({
        pair: item.pair,
        count: item.count,
      }));

      // Daha küçük bir veri seti oluştur
      const analysisData = {
        satislar: simplifiedSatislar.slice(0, 20), // Veri büyüklüğünü sınırla
        birlikte_satilanlar: simplifiedBirlikte,
      };

      console.log(
        'API isteği gönderiliyor:',
        JSON.stringify(analysisData).substring(0, 100) + '...',
      );

      try {
        // API'ye gönderilecek prompt daha net ve basit olsun
        const prompt = `
          Bu satış verilerini analiz et:
          ${JSON.stringify(analysisData)}
          
          Aşağıdaki soruları yanıtla ve SADECE JSON formatında yanıt ver:
          1. En az satın alınan 3 ürünü belirle
          2. Bu az satılan ürünlerin hangi günlerde en az satın alındığını belirle
          3. Bu ürünlerin satışını artırmak için kampanya önerileri sun (max 2 öneri)
          4. Kampanyaların hangi günlerde yapılırsa daha iyi verim elde edileceğini yorumla
          
          Yanıtını ŞU FORMATTA ver:
          {
            "enAzSatilanUrunler": ["Ürün A", "Ürün B", "Ürün C"],
            "dusuSatisDoganlari": ["Ürün A: Gün X, Gün Y", "Ürün B: Gün Z, Gün W"],
            "kampanyaOnerileri": ["Öneri 1", "Öneri 2"],
            "kampanyaGunleri": ["Gün X: Açıklama", "Gün Y: Açıklama", "Gün Z: Açıklama"]
          }
          
          SADECE BU JSON FORMATINDA YANIT VER, BAŞKA METİN EKLEME.
        `;

        // Gemini API isteği - daha sade bir istek gönder
        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyADTEiSuDJoWWShF8BnMMjivQhg-Gsp-RQ',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{text: prompt}],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                topP: 0.8,
                maxOutputTokens: 1024,
              },
            }),
          },
        );

        // API yanıtını log'la ve parse et
        const responseText = await response.text();
        console.log('API yanıtı:', responseText.substring(0, 100) + '...');

        // Response'u parse etmeye çalış
        const data = JSON.parse(responseText);

        if (
          data.candidates &&
          data.candidates[0]?.content?.parts &&
          data.candidates[0].content.parts.length > 0
        ) {
          try {
            const text = data.candidates[0].content.parts[0].text;
            console.log('İşlenecek metin:', text.substring(0, 100) + '...');

            // JSON bloğunu metinden çıkar - regex'i daha esnek yap
            let jsonStr = text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              jsonStr = jsonMatch[0];
            }

            console.log('JSON string:', jsonStr.substring(0, 100) + '...');

            // Eğer veri yoksa basit bir yanıt oluştur
            if (!jsonStr || jsonStr.trim() === '') {
              setAiResponse({
                enAzSatilanUrunler: ['Veri yetersiz'],
                dusuSatisDoganlari: ['Veri yetersiz'],
                kampanyaOnerileri: ['Veri yetersiz'],
                kampanyaGunleri: ['Veri yetersiz'],
              });
              return;
            }

            // JSON olarak parse et
            const parsedResponse = JSON.parse(jsonStr);
            setAiResponse(parsedResponse);
          } catch (parseError) {
            console.error('JSON parse hatası:', parseError);
            // Hata durumunda varsayılan bir yanıt oluştur
            setAiResponse({
              error: 'Yanıt doğru biçimde alınamadı: ' + parseError.message,
              rawResponse: data.candidates[0]?.content?.parts[0]?.text,
            });
          }
        } else if (data.error) {
          console.error('API hatası:', data.error);
          setAiResponse({
            error: `API hatası: ${
              data.error.message || JSON.stringify(data.error)
            }`,
          });
        } else {
          console.error('Beklenmeyen API yanıtı:', data);
          setAiResponse({
            error: 'API geçerli bir yanıt döndürmedi',
            rawResponse: JSON.stringify(data),
          });
        }
      } catch (apiError) {
        console.error('API isteği hatası:', apiError);
        setAiResponse({
          error: `API isteği hatası: ${apiError.message || 'Bilinmeyen hata'}`,
          // Veri bulunamadığında örnek verilerle kullanıcıya yardımcı olun
          enAzSatilanUrunler: [
            'API yanıt vermedi, güncel verileri göremiyoruz',
          ],
          kampanyaOnerileri: [
            'Mevcut verilere göre kampanya önerisi yapılamıyor',
          ],
          dusuSatisDoganlari: [
            'Verilere erişilemediği için analiz yapılamıyor',
          ],
          kampanyaGunleri: ['API hatası nedeniyle veri gösterilemiyor'],
        });
      }
    } catch (error) {
      console.error('Analiz işlemi hatası:', error);
      setAiResponse({
        error: `Analiz işlemi hatası: ${error.message || 'Bilinmeyen hata'}`,
        enAzSatilanUrunler: ['İşlem sırasında hata oluştu'],
        kampanyaOnerileri: ['İşlem sırasında hata oluştu'],
        dusuSatisDoganlari: ['İşlem sırasında hata oluştu'],
        kampanyaGunleri: ['İşlem sırasında hata oluştu'],
      });
    } finally {
      if (!useTestData) {
        setAiLoading(false);
      }
    }
  };

  // Yapay zeka modalını kapat
  const closeAiModal = () => {
    setShowAiModal(false);
  };

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
            icon={faRightFromBracket}
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

        <TouchableOpacity style={styles.aiButton} onPress={handleAiAnalysis}>
          <FontAwesomeIcon
            icon={faRobot}
            size={20}
            color="#FFF"
            style={styles.aiButtonIcon}
          />
          <CustomText style={styles.aiButtonText}>Analiz Yap</CustomText>
        </TouchableOpacity>

        <UrunDagilimi data={urunDagilimi} />

        <BirlikteSatilanlarListesi items={birlikteSatilanlar} />

        <SatisTablosu satislar={satislar} />
      </ScrollView>

      {/* Yapay Zeka Analiz Modalı */}
      <Modal
        visible={showAiModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeAiModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CustomText type="title">Yapay Zeka Analizi</CustomText>
              <TouchableOpacity
                onPress={closeAiModal}
                style={styles.closeButton}>
                <CustomText style={styles.closeButtonText}>X</CustomText>
              </TouchableOpacity>
            </View>

            {aiLoading ? (
              <View style={styles.aiLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <CustomText style={styles.aiLoadingText}>
                  Analiz yapılıyor...
                </CustomText>
              </View>
            ) : aiResponse ? (
              <ScrollView style={styles.aiResponseContainer}>
                {/* En Az Satın Alınanlar */}
                <View style={styles.aiResponseSection}>
                  <CustomText type="subtitle">
                    En Az Satın Alınan Ürünler
                  </CustomText>
                  {aiResponse.enAzSatilanUrunler ? (
                    Array.isArray(aiResponse.enAzSatilanUrunler) ? (
                      aiResponse.enAzSatilanUrunler.map((item, index) => (
                        <CustomText key={index} style={styles.aiResponseItem}>
                          •{' '}
                          {typeof item === 'string'
                            ? item
                            : JSON.stringify(item)}
                        </CustomText>
                      ))
                    ) : (
                      <CustomText style={styles.aiResponseItem}>
                        {JSON.stringify(aiResponse.enAzSatilanUrunler)}
                      </CustomText>
                    )
                  ) : (
                    <CustomText style={styles.aiResponseError}>
                      Veri bulunamadı
                    </CustomText>
                  )}
                </View>

                {/* Düşük Satış Günleri */}
                <View style={styles.aiResponseSection}>
                  <CustomText type="subtitle">Düşük Satış Günleri</CustomText>
                  {aiResponse.dusuSatisDoganlari ? (
                    Array.isArray(aiResponse.dusuSatisDoganlari) ? (
                      aiResponse.dusuSatisDoganlari.map((item, index) => (
                        <CustomText key={index} style={styles.aiResponseItem}>
                          •{' '}
                          {typeof item === 'string'
                            ? item
                            : JSON.stringify(item)}
                        </CustomText>
                      ))
                    ) : (
                      <CustomText style={styles.aiResponseItem}>
                        {JSON.stringify(aiResponse.dusuSatisDoganlari)}
                      </CustomText>
                    )
                  ) : (
                    <CustomText style={styles.aiResponseError}>
                      Veri bulunamadı
                    </CustomText>
                  )}
                </View>

                {/* Kampanya Önerileri */}
                <View style={styles.aiResponseSection}>
                  <CustomText type="subtitle">Kampanya Önerileri</CustomText>
                  {aiResponse.kampanyaOnerileri ? (
                    Array.isArray(aiResponse.kampanyaOnerileri) ? (
                      aiResponse.kampanyaOnerileri.map((item, index) => (
                        <CustomText key={index} style={styles.aiResponseItem}>
                          •{' '}
                          {typeof item === 'string'
                            ? item
                            : JSON.stringify(item)}
                        </CustomText>
                      ))
                    ) : (
                      <CustomText style={styles.aiResponseItem}>
                        {JSON.stringify(aiResponse.kampanyaOnerileri)}
                      </CustomText>
                    )
                  ) : (
                    <CustomText style={styles.aiResponseError}>
                      Veri bulunamadı
                    </CustomText>
                  )}
                </View>

                {/* Kampanya Günleri */}
                <View style={styles.aiResponseSection}>
                  <CustomText type="subtitle">Kampanya Günleri</CustomText>
                  {aiResponse.kampanyaGunleri ? (
                    Array.isArray(aiResponse.kampanyaGunleri) ? (
                      aiResponse.kampanyaGunleri.map((item, index) => (
                        <CustomText key={index} style={styles.aiResponseItem}>
                          •{' '}
                          {typeof item === 'string'
                            ? item
                            : JSON.stringify(item)}
                        </CustomText>
                      ))
                    ) : (
                      <CustomText style={styles.aiResponseItem}>
                        {JSON.stringify(aiResponse.kampanyaGunleri)}
                      </CustomText>
                    )
                  ) : (
                    <CustomText style={styles.aiResponseError}>
                      Veri bulunamadı
                    </CustomText>
                  )}
                </View>

                {/* Hata varsa göster */}
                {aiResponse.error && (
                  <View style={styles.aiResponseSection}>
                    <CustomText type="subtitle" style={styles.errorTitle}>
                      Hata
                    </CustomText>
                    <CustomText style={styles.aiResponseError}>
                      {aiResponse.error}
                    </CustomText>

                    {/* Ham yanıt varsa göster */}
                    {aiResponse.rawResponse && (
                      <View style={styles.rawResponseContainer}>
                        <CustomText
                          type="subtitle"
                          style={styles.rawResponseTitle}>
                          Ham API Yanıtı
                        </CustomText>
                        <ScrollView style={styles.rawResponseScroll}>
                          <CustomText style={styles.rawResponseText}>
                            {typeof aiResponse.rawResponse === 'string'
                              ? aiResponse.rawResponse
                              : JSON.stringify(aiResponse.rawResponse, null, 2)}
                          </CustomText>
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
            ) : (
              <CustomText style={styles.aiResponseError}>
                Henüz analiz yapılmadı
              </CustomText>
            )}
          </View>
        </View>
      </Modal>
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
  // AI Buton Stilleri
  aiButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  aiButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  aiButtonIcon: {
    marginRight: 8,
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  aiLoadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  aiLoadingText: {
    marginTop: 10,
    color: COLORS.primary,
  },
  aiResponseContainer: {
    maxHeight: '90%',
  },
  aiResponseSection: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiResponseItem: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
  aiResponseError: {
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 10,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rawResponseContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rawResponseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rawResponseScroll: {
    maxHeight: 200,
  },
  rawResponseText: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
});

export default AdminPanel;
