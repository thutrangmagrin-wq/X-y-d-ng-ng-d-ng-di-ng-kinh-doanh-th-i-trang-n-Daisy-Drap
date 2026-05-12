import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { getCart, saveCart, getWishlist, saveWishlist, getProducts, getCollections, getUser } from '../services/storageService';
import { useAppConfig } from '../context/AppConfigContext';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function HomeScreen({ user, navigation }) {
  const { config } = useAppConfig();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const userId = user?.id || 'guest';

  const bannerImages = [
    'https://res.cloudinary.com/dhnrlnoee/image/upload/v1777692700/daisy_drape/products/fs3xtezoknggpaysby12.jpg',
    'https://res.cloudinary.com/dhnrlnoee/image/upload/v1778385315/Screenshot_2026-05-10_105158_po1frr.png',
    'https://res.cloudinary.com/dhnrlnoee/image/upload/v1778385331/ChatGPT_Image_10_49_15_10_thg_5_2026_bpbnys.png',
  ];

  console.log('🏠 HomeScreen mounted');
  console.log('📍 Navigation prop:', navigation ? 'EXISTS' : 'MISSING');
  console.log('🔗 Navigation type:', navigation?.navigate ? 'STACK' : 'UNKNOWN');
  console.log('👤 User:', user?.email);

  // Auto-rotate banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const loadData = useCallback(async () => {
    const p = await getProducts();
    const c = await getCart(userId);
    const w = await getWishlist(userId);
    const col = await getCollections();
    const userData = await getUser();
    setProducts(p);
    setCart(c);
    setWishlist(w);
    setCollections(col);
    setReviews(Array.isArray(userData?.reviews) ? userData.reviews : []);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(useCallback(() => {
    loadData();
  }, [loadData]));

  const handleAddToCart = useCallback(
    async (product) => {
      const cartKey = `${product.id}_default`;
      const existing = cart.find((i) => i.cartKey === cartKey);
      const updated = existing
        ? cart.map((i) => i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i)
        : [...cart, { ...product, cartKey, selectedSize: null, quantity: 1 }];
      setCart(updated);
      await saveCart(updated, userId);
      Alert.alert('✅ Thành công', `${product.name} đã được thêm vào giỏ hàng`);
    },
    [cart, userId]
  );

  const handleToggleWishlist = useCallback(
    async (product) => {
      const isIn = wishlist.some((i) => i.id === product.id);
      const updated = isIn
        ? wishlist.filter((i) => i.id !== product.id)
        : [...wishlist, product];
      setWishlist(updated);
      await saveWishlist(updated, userId);
    },
    [wishlist, userId]
  );

  const handleViewProduct = (product) => {
    console.log('👆 Product tapped:', product.name);
    console.log('📍 Navigation available:', !!navigation);
    console.log('🔗 Navigation object:', navigation);
    if (navigation) {
      try {
        navigation.navigate('ProductDetail', { product });
        console.log('✅ Navigation called successfully');
      } catch (error) {
        console.error('❌ Navigation error:', error);
        Alert.alert('Lỗi', 'Không thể mở chi tiết sản phẩm: ' + error.message);
      }
    } else {
      console.error('❌ Navigation is undefined!');
      Alert.alert('Lỗi', 'Navigation không khả dụng');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderProductCard = ({ item }) => {
    const safeReviews = Array.isArray(reviews) ? reviews : [];
    const productReviews = safeReviews.filter((r) => r && r.productId === item.id);
    const avgRating = productReviews.length > 0
      ? (productReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / productReviews.length).toFixed(1)
      : 'Chưa có';

    return (
      <TouchableOpacity 
        style={[styles.productCard, { backgroundColor: '#FEFDFB', borderColor: '#D9CFC5' }]}
        onPress={() => handleViewProduct(item)}
        activeOpacity={0.7}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
          <TouchableOpacity
            style={styles.wishBtn}
            onPress={(e) => {
              e.stopPropagation();
              handleToggleWishlist(item);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.wishIcon}>{wishlist.some((w) => w.id === item.id) ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          
          {/* Rating and review count */}
          <View style={styles.ratingRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.ratingText}>{avgRating}</Text>
            <Text style={styles.reviewCount}>({productReviews.length})</Text>
          </View>

          <Text style={[styles.productPrice]}>
            {formatPrice(item.price)}
          </Text>
          <TouchableOpacity
            style={[styles.addToCartBtn]}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(item);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addToCartBtnText}>Thêm vào giỏ</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCollectionCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.collectionCard, { backgroundColor: '#FEFDFB', borderColor: '#D9CFC5' }]}
      onPress={() => handleViewProduct(item)}
      activeOpacity={0.7}
    >
      <View style={styles.collectionImageContainer}>
        <Image source={{ uri: item.image }} style={styles.collectionImage} resizeMode="cover" />
        <View style={styles.collectionOverlay}>
          <Text style={styles.collectionTitle}>{item.name}</Text>
          <TouchableOpacity style={[styles.exploreBtn]}>
            <Text style={styles.exploreBtnText}>Xem bộ sưu tập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: '#F5F1E8' }]}>
        <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{config.shopName}</Text>
            <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
              <Ionicons name="search" size={16} color="#999" />
              <TextInput
                style={[styles.searchInput]}
                placeholder="Tìm kiếm..."
                placeholderTextColor="#999"
                value={search}
                onChangeText={setSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => navigation?.navigate('Cart')}>
                <Ionicons name="cart" size={24} color={config.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation?.navigate('Profile')}>
                <Ionicons name="person" size={24} color={config.primaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Only show banner and intro when NOT searching */}
        {search.length === 0 && (
          <>
            {/* Banner */}
            <View style={styles.bannerContainer}>
              <Image 
                source={{ uri: bannerImages[currentBannerIndex] }}
                style={styles.banner}
                resizeMode="cover"
              />
              <View style={styles.bannerDots}>
                {bannerImages.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dot,
                      index === currentBannerIndex && styles.dotActive,
                    ]}
                    onPress={() => setCurrentBannerIndex(index)}
                  />
                ))}
              </View>
            </View>

            {/* Shop Introduction */}
            <View style={[styles.shopIntroSection]}>
              <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shopIntroGradient}
              >
                <Text style={styles.shopIntroTitle}>Về DaisyDrape</Text>
                <Text style={styles.shopIntroText}>
                  Khám phá bộ sưu tập thời trang độc đáo, chất lượng cao với giá cả phải chăng. Mỗi sản phẩm được chọn lọc kỹ càng để mang lại sự hài lòng tối đa cho bạn.
                </Text>
                <View style={styles.shopFeatures}>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconBox]}>
                      <Text style={styles.featureIcon}>⭐</Text>
                    </View>
                    <Text style={styles.featureText}>Chất lượng</Text>
                    <Text style={styles.featureSubText}>Tốt nhất</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconBox]}>
                      <Text style={styles.featureIcon}>🚚</Text>
                    </View>
                    <Text style={styles.featureText}>Giao hàng</Text>
                    <Text style={styles.featureSubText}>Nhanh chóng</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconBox]}>
                      <Text style={styles.featureIcon}>💬</Text>
                    </View>
                    <Text style={styles.featureText}>Hỗ trợ</Text>
                    <Text style={styles.featureSubText}>24/7</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </>
        )}

        {/* New Arrivals Section - 3 columns */}
        {search.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sản phẩm mới</Text>
            <FlatList
              key="arrivals-3"
              data={filteredProducts.slice(0, 6)}
              keyExtractor={(item) => item.id}
              renderItem={renderProductCard}
              numColumns={3}
              columnWrapperStyle={styles.row3}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent3}
            />
          </View>
        )}

        {/* Featured Collections Section - 2 columns */}
        {search.length === 0 && collections.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bộ sưu tập nổi bật</Text>
            <FlatList
              key="collections-2"
              data={collections}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const collectionProducts = products.filter((p) =>
                  item.productIds?.includes(p.id)
                );
                return (
                  <TouchableOpacity 
                    style={[styles.collectionCard, { backgroundColor: '#FEFDFB', borderColor: '#D9CFC5' }]}
                    onPress={() => {
                      // Navigate to collection detail or show products
                      Alert.alert(item.name, `${item.description}\n\n${collectionProducts.length} sản phẩm`);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.collectionImageContainer}>
                      {collectionProducts.length > 0 && (
                        <Image 
                          source={{ uri: collectionProducts[0].image }} 
                          style={styles.collectionImage} 
                          resizeMode="cover" 
                        />
                      )}
                      <View style={styles.collectionOverlay}>
                        <Text style={styles.collectionTitle}>{item.name}</Text>
                        <TouchableOpacity style={[styles.exploreBtn]}>
                          <Text style={styles.exploreBtnText}>Xem bộ sưu tập</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              numColumns={2}
              columnWrapperStyle={styles.row2}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent2}
            />
          </View>
        )}

        {/* All Products Section */}
        {search.length === 0 && filteredProducts.length > 8 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tất cả sản phẩm</Text>
            <FlatList
              key="all-2"
              data={filteredProducts.slice(8)}
              keyExtractor={(item) => item.id}
              renderItem={renderProductCard}
              numColumns={2}
              columnWrapperStyle={styles.row2}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent2}
            />
          </View>
        )}

        {/* Search Results */}
        {search.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kết quả tìm kiếm ({filteredProducts.length})</Text>
            {filteredProducts.length === 0 ? (
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
            ) : (
              <FlatList
                key="search-results"
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={renderProductCard}
                numColumns={2}
                columnWrapperStyle={styles.row2}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent2}
              />
            )}
          </View>
        )}

        {filteredProducts.length === 0 && search.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
          </View>
        )}

        {/* Footer */}
        <View style={[styles.footer]}>
          <View style={styles.footerContent}>
            <View style={styles.footerSection}>
              <Text style={[styles.footerTitle]}>🏪 DaisyDrape</Text>
              <Text style={styles.footerText}>Thời trang cho mọi người</Text>
              <Text style={styles.footerText}>Chất lượng • Giá tốt • Uy tín</Text>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerSection}>
              <Text style={[styles.footerTitle]}>📞 Liên hệ</Text>
              <Text style={styles.footerText}>☎️ 0123 456 789</Text>
              <Text style={styles.footerText}>📧 info@daisydrape.com</Text>
              <Text style={styles.footerText}>📍 123 Đường ABC, TP HCM</Text>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerSection}>
              <Text style={[styles.footerTitle]}>🔗 Theo dõi</Text>
              <Text style={styles.footerText}>Facebook • Instagram • TikTok</Text>
            </View>
          </View>
          <View style={[styles.footerBottom]}>
            <Text style={styles.footerCopyright}>© 2024 DaisyDrape. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8DCC8',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C2C2C',
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    maxWidth: 140,
    borderWidth: 1,
    borderColor: '#E8DCC8',
  },
  searchContainerFocused: {
    maxWidth: '100%',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: RADIUS.lg,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 13,
    color: '#333',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerDots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D3D3D',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent3: { gap: 12 },
  listContent2: { gap: 12 },
  row3: { gap: 12, paddingHorizontal: 0 },
  row2: { gap: 12, paddingHorizontal: 0 },
  
  // Product Card (3 columns)
  productCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8DCC8',
    backgroundColor: '#FFFBF5',
    ...SHADOW.sm,
  },
  productImageContainer: {
    position: 'relative',
    height: 140,
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceWarm,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7D72',
    lineHeight: 14,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  star: {
    fontSize: 11,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B8956A',
  },
  reviewCount: {
    fontSize: 10,
    color: '#A89080',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B8956A',
    marginBottom: 8,
  },
  addToCartBtn: {
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    backgroundColor: '#D4C4B0',
  },
  addToCartBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // Collection Card (2 columns)
  collectionCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8DCC8',
    height: 200,
    ...SHADOW.sm,
  },
  collectionImageContainer: {
    flex: 1,
    position: 'relative',
  },
  collectionImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceWarm,
  },
  collectionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
    alignItems: 'center',
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  exploreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: '#D4C4B0',
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  wishBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishIcon: { fontSize: 16 },
  
  // Shop Introduction Section
  shopIntroSection: {
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  shopIntroGradient: {
    padding: 20,
  },
  shopIntroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D4A574',
    marginBottom: 12,
    textAlign: 'center',
  },
  shopIntroText: {
    fontSize: 13,
    color: '#E8D4B8',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.95,
  },
  shopFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(212, 165, 116, 0.15)',
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 12,
    color: '#D4A574',
    fontWeight: '700',
    textAlign: 'center',
  },
  featureSubText: {
    fontSize: 11,
    color: '#D4A574',
    opacity: 0.7,
    marginTop: 2,
  },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E8E3D8',
    marginTop: 20,
    backgroundColor: '#F5F1E8',
  },
  footerContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  footerSection: {
    marginBottom: 12,
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#E8E3D8',
    marginVertical: 12,
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A89F96',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#9B9390',
    lineHeight: 18,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#E8E3D8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FEFDFB',
  },
  footerCopyright: {
    fontSize: 11,
    color: '#999',
  },
  
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
});
