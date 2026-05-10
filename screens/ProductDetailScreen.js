import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useAppConfig } from '../context/AppConfigContext';
import { getCart, saveCart, getWishlist, saveWishlist } from '../services/storageService';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function ProductDetailScreen({ route, navigation, user }) {
  const { config } = useAppConfig();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([
    {
      id: '1',
      userName: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Sản phẩm rất đẹp, chất lượng tốt, giao hàng nhanh!',
      date: '2 ngày trước',
    },
    {
      id: '2',
      userName: 'Trần Thị B',
      rating: 4,
      comment: 'Đẹp lắm, nhưng hơi hẹp một chút',
      date: '1 tuần trước',
    },
    {
      id: '3',
      userName: 'Lê Văn C',
      rating: 5,
      comment: 'Tuyệt vời! Sẽ mua lại',
      date: '2 tuần trước',
    },
  ]);
  const userId = user?.id || 'guest';

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const loadWishlist = useCallback(async () => {
    const w = await getWishlist(userId);
    setWishlist(w);
  }, [userId]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = wishlist.some((w) => w.id === product.id);

  const handleToggleWishlist = async () => {
    const updated = isInWishlist
      ? wishlist.filter((w) => w.id !== product.id)
      : [...wishlist, product];
    setWishlist(updated);
    await saveWishlist(updated, userId);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert('Lỗi', 'Vui lòng chọn kích cỡ');
      return;
    }

    const cart = await getCart(userId);
    const cartKey = `${product.id}_${selectedSize}`;
    const existing = cart.find((i) => i.cartKey === cartKey);

    const updated = existing
      ? cart.map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [
          ...cart,
          {
            ...product,
            cartKey,
            selectedSize,
            quantity,
          },
        ];

    await saveCart(updated, userId);
    Alert.alert('✅ Thành công', `${product.name} đã được thêm vào giỏ hàng`);
    setQuantity(1);
    setSelectedSize(null);
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 99) {
      setQuantity(newQty);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <TouchableOpacity onPress={handleToggleWishlist}>
          <Text style={styles.wishIcon}>{isInWishlist ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.imageSection, { backgroundColor: COLORS.surface }]}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={[styles.content, { backgroundColor: COLORS.surface }]}>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.sold}> · {product.sold} bán</Text>
          </View>

          <Text style={[styles.price, { color: config.primaryColor }]}>
            {formatPrice(product.price)}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Chọn kích cỡ</Text>
          <View style={styles.sizesContainer}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeBtn,
                  selectedSize === size && {
                    backgroundColor: config.primaryColor,
                    borderColor: config.primaryColor,
                  },
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && { color: '#fff' },
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityBtn, { borderColor: config.primaryColor }]}
              onPress={() => handleQuantityChange(-1)}
            >
              <Text style={[styles.quantityBtnText, { color: config.primaryColor }]}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityBtn, { borderColor: config.primaryColor }]}
              onPress={() => handleQuantityChange(1)}
            >
              <Text style={[styles.quantityBtnText, { color: config.primaryColor }]}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>💬 Đánh giá từ khách hàng</Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>Chưa có đánh giá nào</Text>
          ) : (
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.reviewCard, { backgroundColor: COLORS.background }]}>
                  <View style={styles.reviewHeader}>
                    <View>
                      <Text style={styles.reviewName}>{item.userName}</Text>
                      <Text style={styles.reviewDate}>{item.date}</Text>
                    </View>
                    <View style={styles.reviewStars}>
                      {[...Array(5)].map((_, i) => (
                        <Text key={i} style={styles.reviewStar}>
                          {i < item.rating ? '⭐' : '☆'}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{item.comment}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: COLORS.surface, borderTopColor: COLORS.borderLight }]}>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: config.primaryColor }]}
          onPress={handleAddToCart}
        >
          <Ionicons name="bag-add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  wishIcon: { fontSize: 24 },
  imageSection: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  star: { fontSize: 14 },
  rating: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginLeft: 4 },
  sold: { fontSize: 13, color: COLORS.textMuted },
  price: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  reviewCard: {
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewStar: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  noReviews: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
});
