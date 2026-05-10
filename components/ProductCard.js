import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useAppConfig } from '../context/AppConfigContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 4; // 4 columns with padding

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const discountPercent = (original, current) =>
  Math.round(((original - current) / original) * 100);

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onPress, // navigate to detail
}) {
  const { config } = useAppConfig();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const images = product.images || [product.image];

  const handleImageScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CARD_WIDTH);
    setCurrentImageIndex(Math.min(index, images.length - 1));
  };

  return (
    <View style={[styles.card, { backgroundColor: config.backgroundColor }]}>
      {/* Discount badge */}
      {hasDiscount && (
        <View style={[styles.discountBadge, { backgroundColor: config.primaryColor }]}>
          <Text style={styles.discountText}>
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </Text>
        </View>
      )}

      {/* Wishlist button */}
      <TouchableOpacity
        style={styles.wishlistBtn}
        onPress={() => onToggleWishlist(product)}
        activeOpacity={0.7}
      >
        <Text style={styles.wishlistIcon}>{isWishlisted ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>

      {/* Image carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleImageScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {images.map((img, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => onPress && onPress(product)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: img }}
              style={[styles.image, { width: CARD_WIDTH }]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Image indicators */}
      {images.length > 1 && (
        <View style={styles.indicators}>
          {images.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.indicator,
                idx === currentImageIndex && { backgroundColor: config.primaryColor },
              ]}
            />
          ))}
        </View>
      )}

      {/* Info — bấm vào tên cũng vào detail */}
      <TouchableOpacity style={styles.info} onPress={() => onPress && onPress(product)} activeOpacity={0.8}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.soldText}> · {product.sold}</Text>
        </View>

        {/* Price */}
        <Text style={[styles.price, { color: config.primaryColor }]}>
          {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </Text>
        {hasDiscount && (
          <Text style={styles.originalPrice}>
            {product.originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Text>
        )}
      </TouchableOpacity>

      {/* Add to cart */}
      <TouchableOpacity
        style={[styles.cartBtn, { backgroundColor: config.primaryColor }]}
        onPress={() => onAddToCart(product)}
        activeOpacity={0.85}
      >
        <Text style={styles.cartBtnText}>+ Thêm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#f5f1ed',
    ...SHADOW.sm,
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    zIndex: 10,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  discountText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  wishlistBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  wishlistIcon: { fontSize: 14 },
  imageScroll: {
    width: '100%',
    height: 120,
  },
  image: {
    height: 120,
    backgroundColor: COLORS.surfaceWarm,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
  },
  info: { padding: 8 },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 14,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  star: { fontSize: 10 },
  ratingText: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary, marginLeft: 2 },
  soldText: { fontSize: 10, color: COLORS.textMuted },
  price: { fontSize: 12, fontWeight: '800', marginBottom: 2 },
  originalPrice: {
    fontSize: 9,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginBottom: 6,
  },
  cartBtn: {
    marginHorizontal: 8,
    marginBottom: 8,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  cartBtnText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
