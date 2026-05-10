import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { getWishlist, saveWishlist, getCart, saveCart } from '../services/storageService';
import { useAppConfig } from '../context/AppConfigContext';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function WishlistScreen({ user, navigation }) {
  const { config } = useAppConfig();
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const userId = user?.id || 'guest';

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const w = await getWishlist(userId);
        const c = await getCart(userId);
        setWishlist(w);
        setCart(c);
      };
      load();
    }, [userId])
  );

  const handleRemove = useCallback(
    async (id) => {
      const updated = wishlist.filter((i) => i.id !== id);
      setWishlist(updated);
      await saveWishlist(updated, userId);
    },
    [wishlist, userId]
  );

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

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: COLORS.surface }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={[styles.badge, { backgroundColor: config.primaryColor }]}>
          <Text style={styles.badgeText}>❤️</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.category}>{item.category || 'Sản phẩm'}</Text>
        <Text style={[styles.price, { color: config.primaryColor }]}>
          {formatPrice(item.price)}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.cartBtn, { backgroundColor: config.primaryColor }]}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.cartBtnText}>🛒 Thêm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemove(item.id)}
          >
            <Text style={styles.removeBtnText}>🗑️ Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]} edges={['top']}>
      <LinearGradient
        colors={[config.primaryColor, config.secondaryColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Yêu thích</Text>
            <Text style={styles.headerSubtitle}>{wishlist.length} sản phẩm</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation?.navigate('Cart')}>
              <Ionicons name="cart" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation?.navigate('Profile')}>
              <Ionicons name="person" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {wishlist.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyText}>Chưa có sản phẩm yêu thích</Text>
          <Text style={styles.emptySubtext}>Hãy thêm những sản phẩm bạn yêu thích</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  listContent: { padding: 16, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    marginBottom: 12,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceWarm,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  badgeText: {
    fontSize: 16,
  },
  info: { flex: 1, padding: 14, justifyContent: 'space-between' },
  name: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  category: { fontSize: 11, color: COLORS.textMuted, marginBottom: 6 },
  price: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 8 },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOW.sm,
  },
  cartBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  removeBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surfaceWarm,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  removeBtnText: { color: COLORS.primaryDark, fontSize: 12, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
  emptySubtext: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
});
