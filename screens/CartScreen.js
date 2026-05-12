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
import { getCart, saveCart, addOrder } from '../services/storageService';
import { useAppConfig } from '../context/AppConfigContext';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function CartScreen({ user, navigation }) {
  const { config } = useAppConfig();
  const [cart, setCart] = useState([]);
  const userId = user?.id || 'guest';

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const c = await getCart(userId);
        setCart(c);
      };
      load();
    }, [userId])
  );

  const handleIncrease = useCallback(
    async (cartKey) => {
      const updated = cart.map((i) =>
        i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i
      );
      setCart(updated);
      await saveCart(updated, userId);
    },
    [cart, userId]
  );

  const handleDecrease = useCallback(
    async (cartKey) => {
      const item = cart.find((i) => i.cartKey === cartKey);
      if (!item) return;
      const updated =
        item.quantity === 1
          ? cart.filter((i) => i.cartKey !== cartKey)
          : cart.map((i) =>
              i.cartKey === cartKey ? { ...i, quantity: i.quantity - 1 } : i
            );
      setCart(updated);
      await saveCart(updated, userId);
    },
    [cart, userId]
  );

  const handleRemove = useCallback(
    async (cartKey) => {
      Alert.alert('Xóa sản phẩm', 'Bạn có chắc muốn xóa?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const updated = cart.filter((i) => i.cartKey !== cartKey);
            setCart(updated);
            await saveCart(updated, userId);
          },
        },
      ]);
    },
    [cart, userId]
  );

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm sản phẩm trước khi thanh toán');
      return;
    }
    navigation?.navigate('Checkout');
  }, [cart.length, navigation]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation?.navigate('ProductDetail', { product: item })}
      activeOpacity={0.8}
    >
      <View style={[styles.card, { backgroundColor: COLORS.surface }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={[styles.price, { color: config.primaryColor }]}>{formatPrice(item.price)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity 
              style={styles.qtyBtn} 
              onPress={(e) => {
                e.stopPropagation();
                handleDecrease(item.cartKey);
              }}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.qtyBtn} 
              onPress={(e) => {
                e.stopPropagation();
                handleIncrease(item.cartKey);
              }}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
            <Text style={[styles.subtotal, { color: config.primaryColor }]}>
              {formatPrice(item.price * item.quantity)}
            </Text>
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                handleRemove(item.cartKey);
              }} 
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Giỏ hàng</Text>
            <Text style={styles.headerSubtitle}>{cart.length} sản phẩm</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation?.navigate('Wishlist')}>
              <Ionicons name="heart" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation?.navigate('Profile')}>
              <Ionicons name="person" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}></Text>
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
          <Text style={styles.emptySubtext}>Hãy thêm sản phẩm để bắt đầu mua sắm</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.cartKey}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <LinearGradient
            colors={[config.primaryColor + '00', config.primaryColor + '20']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.footerGradient}
          >
            <View style={[styles.footer, { backgroundColor: config.backgroundColor }]}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={[styles.totalValue, { color: config.primaryColor }]}>
                  {formatPrice(total)}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.checkoutBtn, { backgroundColor: config.primaryColor }]}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutBtnText}>💳 Thanh toán</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </>
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
    width: 110,
    height: 130,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceWarm,
  },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  price: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.primaryDark },
  qty: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' },
  subtotal: { fontSize: 13, fontWeight: '800', marginLeft: 4, flex: 1 },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 16, marginLeft: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
  emptySubtext: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  footerGradient: {
    paddingBottom: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  totalValue: { fontSize: 20, fontWeight: '800' },
  checkoutBtn: {
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.md,
  },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
