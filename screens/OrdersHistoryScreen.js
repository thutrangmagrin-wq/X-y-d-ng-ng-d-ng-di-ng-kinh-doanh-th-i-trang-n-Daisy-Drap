import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useAppConfig } from '../context/AppConfigContext';
import { getUser, getOrders } from '../services/storageService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const getStatusColor = (status) => {
  const colors = {
    pending: '#FFA500',
    processing: '#2196F3',
    shipped: '#9C27B0',
    delivered: '#4CAF50',
    cancelled: '#F44336',
  };
  return colors[status] || COLORS.textMuted;
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đã gửi',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };
  return labels[status] || status;
};

export default function OrdersHistoryScreen({ navigation }) {
  const { config } = useAppConfig();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [reviewImages, setReviewImages] = useState({});
  const [uploading, setUploading] = useState({});

  const loadOrders = useCallback(async () => {
    const user = await getUser();
    if (user?.id) {
      const userOrders = await getOrders(user.id);
      setOrders(userOrders);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useFocusEffect(useCallback(() => {
    loadOrders();
  }, [loadOrders]));

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsVisible(true);
  };

  const handleRating = (productId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: rating,
    }));
  };

  const handlePickImage = async (productId) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setUploading((prev) => ({ ...prev, [productId]: true }));
        
        try {
          const imageUrl = await uploadImageToCloudinary(imageUri);
          setReviewImages((prev) => ({
            ...prev,
            [productId]: imageUrl,
          }));
          Alert.alert('Thành công', 'Hình ảnh đã được tải lên');
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể tải lên hình ảnh: ' + error.message);
        } finally {
          setUploading((prev) => ({ ...prev, [productId]: false }));
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn hình ảnh');
    }
  };

  const handleSubmitReview = (product) => {
    const rating = ratings[product.id];
    if (!rating) {
      alert('Vui lòng chọn số sao');
      return;
    }
    const reviewText = reviews[product.id] || '';
    const imageUrl = reviewImages[product.id];
    alert(`Cảm ơn bạn đã đánh giá ${product.productName || product.name}\n\nĐánh giá: ${rating} sao\n${reviewText ? `Bình luận: ${reviewText}` : ''}\n${imageUrl ? 'Hình ảnh: Đã tải lên' : ''}`);
    setRatings((prev) => ({
      ...prev,
      [product.id]: 0,
    }));
    setReviews((prev) => ({
      ...prev,
      [product.id]: '',
    }));
    setReviewImages((prev) => ({
      ...prev,
      [product.id]: null,
    }));
  };

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: COLORS.surface }]}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.orderCardHeader}>
        <View>
          <Text style={styles.orderId}>Đơn #{item.id?.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>{item.date || item.createdAt}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        <Text style={styles.itemsLabel}>
          {item.items?.length || 0} sản phẩm
        </Text>
        {item.items?.slice(0, 2).map((product, idx) => (
          <Text key={idx} style={styles.itemName}>
            • {product.productName || product.name}
          </Text>
        ))}
        {item.items?.length > 2 && (
          <Text style={styles.moreItems}>+ {item.items.length - 2} sản phẩm khác</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={[styles.orderTotal, { color: config.primaryColor }]}>
          {formatPrice(item.totalPrice || item.total || 0)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: config.primaryColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {/* Order Details Modal */}
      <Modal visible={detailsVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: config.backgroundColor }]}>
          <View style={[styles.modalHeader, { backgroundColor: config.primaryColor }]}>
            <TouchableOpacity onPress={() => setDetailsVisible(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedOrder && (
              <>
                {/* Order Info */}
                <View style={[styles.infoCard, { backgroundColor: COLORS.surface }]}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Mã đơn:</Text>
                    <Text style={styles.infoValue}>{selectedOrder.id}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ngày tạo:</Text>
                    <Text style={styles.infoValue}>
                      {selectedOrder.date || selectedOrder.createdAt}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Trạng thái:</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(selectedOrder.status)}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(selectedOrder.status) },
                        ]}
                      >
                        {getStatusLabel(selectedOrder.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Items */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Sản phẩm</Text>
                  {selectedOrder.items?.map((item, idx) => (
                    <View key={idx} style={[styles.itemCard, { backgroundColor: COLORS.surface }]}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={2}>
                          {item.productName || item.name}
                        </Text>
                        <Text style={styles.itemDetails}>
                          {item.quantity} x {formatPrice(item.price)}
                        </Text>
                        {item.selectedSize && (
                          <Text style={styles.itemSize}>Size: {item.selectedSize}</Text>
                        )}
                      </View>
                      <Text style={styles.itemTotal}>
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Total */}
                <View style={[styles.totalCard, { backgroundColor: COLORS.surface }]}>
                  <Text style={styles.totalLabel}>Tổng cộng:</Text>
                  <Text style={[styles.totalValue, { color: config.primaryColor }]}>
                    {formatPrice(selectedOrder.totalPrice || selectedOrder.total || 0)}
                  </Text>
                </View>

                {/* Reviews */}
                {selectedOrder.status === 'delivered' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
                    {selectedOrder.items?.map((item, idx) => (
                      <View key={idx} style={[styles.reviewCard, { backgroundColor: COLORS.surface }]}>
                        <Text style={styles.reviewItemName} numberOfLines={1}>
                          {item.productName || item.name}
                        </Text>
                        <View style={styles.starsContainer}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                              key={star}
                              onPress={() => handleRating(item.id, star)}
                            >
                              <Text style={styles.star}>
                                {ratings[item.id] >= star ? '⭐' : '☆'}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <TextInput
                          style={[styles.reviewInput, { borderColor: COLORS.border }]}
                          placeholder="Viết bình luận của bạn..."
                          placeholderTextColor={COLORS.textMuted}
                          multiline
                          numberOfLines={3}
                          value={reviews[item.id] || ''}
                          onChangeText={(text) =>
                            setReviews((prev) => ({
                              ...prev,
                              [item.id]: text,
                            }))
                          }
                        />
                        {reviewImages[item.id] && (
                          <View style={styles.imagePreviewContainer}>
                            <Image
                              source={{ uri: reviewImages[item.id] }}
                              style={styles.imagePreview}
                            />
                            <TouchableOpacity
                              style={styles.removeImageBtn}
                              onPress={() =>
                                setReviewImages((prev) => ({
                                  ...prev,
                                  [item.id]: null,
                                }))
                              }
                            >
                              <Ionicons name="close" size={16} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        )}
                        <TouchableOpacity
                          style={[styles.imagePickerBtn, { borderColor: config.primaryColor }]}
                          onPress={() => handlePickImage(item.id)}
                          disabled={uploading[item.id]}
                        >
                          {uploading[item.id] ? (
                            <ActivityIndicator size="small" color={config.primaryColor} />
                          ) : (
                            <>
                              <Ionicons name="image" size={16} color={config.primaryColor} />
                              <Text style={[styles.imagePickerText, { color: config.primaryColor }]}>
                                {reviewImages[item.id] ? 'Đổi hình ảnh' : 'Thêm hình ảnh'}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.reviewBtn, { backgroundColor: config.primaryColor }]}
                          onPress={() => handleSubmitReview(item)}
                        >
                          <Text style={styles.reviewBtnText}>Gửi đánh giá</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  orderCard: {
    borderRadius: RADIUS.lg,
    padding: 12,
    ...SHADOW.sm,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 13,
    fontWeight: '700',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    ...SHADOW.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemDetails: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  itemSize: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: RADIUS.lg,
    marginBottom: 16,
    ...SHADOW.sm,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  reviewCard: {
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  reviewItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  star: {
    fontSize: 20,
  },
  reviewBtn: {
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  reviewBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 10,
    fontSize: 12,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    minHeight: 80,
    backgroundColor: COLORS.background,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 10,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: RADIUS.md,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 6,
  },
  imagePickerText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
