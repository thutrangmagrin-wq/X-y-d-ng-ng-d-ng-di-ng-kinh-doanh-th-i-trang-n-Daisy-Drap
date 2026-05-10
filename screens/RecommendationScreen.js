import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import BannerComponent from '../components/BannerComponent';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { getCart, saveCart, getWishlist, saveWishlist, getAllProducts } from '../services/storageService';
import { useAppConfig } from '../context/AppConfigContext';

export default function RecommendationScreen({ navigation, user }) {
  const { config: appConfig } = useAppConfig();
  const [recommendations, setRecommendations] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const userId = user?.id || 'guest';

  const loadAll = useCallback(async () => {
    const c = await getCart(userId);
    const w = await getWishlist(userId);
    const savedProducts = await getAllProducts();
    
    setCart(c);
    setWishlist(w);

    const products = (savedProducts && savedProducts.length > 0) ? savedProducts : PRODUCTS;
    const trending = products.sort((a, b) => b.sold - a.sold).slice(0, 12);
    setRecommendations(trending);
  }, [userId]);

  useEffect(() => { loadAll(); }, []);
  useFocusEffect(useCallback(() => { loadAll(); }, [loadAll]));

  const handleAddToCart = useCallback(
    async (product) => {
      const cartKey = `${product.id}_default`;
      const existing = cart.find((i) => i.cartKey === cartKey);
      const updated = existing
        ? cart.map((i) => i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i)
        : [...cart, { ...product, cartKey, selectedSize: null, quantity: 1 }];
      setCart(updated);
      await saveCart(updated, userId);
      Alert.alert('🛒 Đã thêm!', `${product.name} đã được thêm vào giỏ hàng.`);
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

  const ListHeader = () => (
    <View>
      <BannerComponent />
      <View style={styles.header}>
        <Text style={styles.title}>💡 Sản phẩm phổ biến</Text>
        <Text style={styles.subtitle}>Những sản phẩm bán chạy nhất</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: appConfig.backgroundColor }]} edges={['top']}>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.some((w) => w.id === item.id)}
            onPress={(product) => navigation.navigate('ProductDetail', { product })}
          />
        )}
        numColumns={4}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Chưa có sản phẩm</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  listContent: { paddingBottom: 24, paddingHorizontal: 8 },
  row: { paddingHorizontal: 8, justifyContent: 'space-between', gap: 8 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 15, color: COLORS.textMuted },
});
