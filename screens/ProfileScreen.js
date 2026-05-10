import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useAppConfig } from '../context/AppConfigContext';
import { getUser, getOrders } from '../services/storageService';

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

export default function ProfileScreen({ onLogout, navigation }) {
  const { config } = useAppConfig();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [ratings, setRatings] = useState({});
  const [activeTab, setActiveTab] = useState('info'); // info, addresses, payments, orders
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'credit_card', name: 'Visa', last4: '4242', isDefault: true },
    { id: 2, type: 'debit_card', name: 'Mastercard', last4: '5555', isDefault: false },
  ]);
  const [avatarUri, setAvatarUri] = useState(null);

  const loadUserData = useCallback(async () => {
    const data = await getUser();
    setUserData(data);
    if (data?.id) {
      const userOrders = await getOrders(data.id);
      setOrders(userOrders);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useFocusEffect(useCallback(() => {
    loadUserData();
  }, [loadUserData]));

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: onLogout,
      },
    ]);
  };

  const toggleItemExpand = (productId) => {
    setExpandedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleRating = (productId, rating) => {
    setRatings(prev => ({
      ...prev,
      [productId]: rating
    }));
  };

  const handleSubmitReview = (product) => {
    const rating = ratings[product.id];
    if (!rating) {
      Alert.alert('Lỗi', 'Vui lòng chọn số sao');
      return;
    }
    Alert.alert('Thành công', `Cảm ơn bạn đã đánh giá ${product.name}`);
    setRatings(prev => ({
      ...prev,
      [product.id]: 0
    }));
  };

  const handlePickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const renderOrder = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: COLORS.surface }]}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Đơn #{item.id?.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>{item.date || item.createdAt}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      <View style={styles.orderItems}>
        {item.items?.map((product, idx) => (
          <View key={idx}>
            <TouchableOpacity 
              style={styles.orderItemRow}
              onPress={() => toggleItemExpand(product.id)}
            >
              <Text style={styles.orderItem}>
                • {product.productName || product.name} x{product.quantity}
              </Text>
              <Ionicons 
                name={expandedItems[product.id] ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={COLORS.textMuted} 
              />
            </TouchableOpacity>
            
            {expandedItems[product.id] && (
              <View style={[styles.reviewSection, { backgroundColor: COLORS.background, borderLeftColor: config.primaryColor }]}>
                <Text style={styles.reviewLabel}>Đánh giá sản phẩm:</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRating(product.id, star)}
                    >
                      <Text style={styles.star}>
                        {ratings[product.id] >= star ? '⭐' : '☆'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.reviewBtn, { backgroundColor: config.primaryColor }]}
                  onPress={() => handleSubmitReview(product)}
                >
                  <Text style={styles.reviewBtnText}>Gửi đánh giá</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
      <View style={styles.orderFooter}>
        <Text style={[styles.orderTotal, { color: config.primaryColor }]}>
          {formatPrice(item.totalPrice || item.total || 0)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[config.primaryColor, config.secondaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Hồ sơ</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => navigation?.navigate('Wishlist')}>
                <Ionicons name="heart" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation?.navigate('Cart')}>
                <Ionicons name="cart" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {userData && (
          <View style={styles.content}>
            {/* Profile Card */}
            <View style={[styles.card, { backgroundColor: COLORS.surface }]}>
              <LinearGradient
                colors={[config.primaryColor + '20', config.secondaryColor + '20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <TouchableOpacity 
                  style={styles.avatarContainer}
                  onPress={handlePickAvatar}
                >
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={48} color={config.primaryColor} />
                  )}
                  <View style={[styles.cameraIcon, { backgroundColor: config.secondaryColor }]}>
                    <Ionicons name="camera" size={14} color="#fff" />
                  </View>
                </TouchableOpacity>
              </LinearGradient>
              <Text style={styles.name}>{userData.fullName || userData.username}</Text>
              <Text style={styles.email}>{userData.email}</Text>
              <TouchableOpacity
                style={[styles.editProfileBtn, { backgroundColor: config.primaryColor }]}
                onPress={() => navigation?.navigate('EditProfile')}
              >
                <Ionicons name="pencil" size={16} color="#fff" />
                <Text style={styles.editProfileBtnText}>Chỉnh sửa hồ sơ</Text>
              </TouchableOpacity>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'info' && { borderBottomColor: config.primaryColor, borderBottomWidth: 3 }]}
                onPress={() => setActiveTab('info')}
              >
                <Ionicons name="information-circle" size={18} color={activeTab === 'info' ? config.primaryColor : COLORS.textMuted} />
                <Text style={[styles.tabText, { color: activeTab === 'info' ? config.primaryColor : COLORS.textMuted }]}>
                  Thông tin
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'addresses' && { borderBottomColor: config.primaryColor, borderBottomWidth: 3 }]}
                onPress={() => setActiveTab('addresses')}
              >
                <Ionicons name="location" size={18} color={activeTab === 'addresses' ? config.primaryColor : COLORS.textMuted} />
                <Text style={[styles.tabText, { color: activeTab === 'addresses' ? config.primaryColor : COLORS.textMuted }]}>
                  Địa chỉ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'payments' && { borderBottomColor: config.primaryColor, borderBottomWidth: 3 }]}
                onPress={() => setActiveTab('payments')}
              >
                <Ionicons name="card" size={18} color={activeTab === 'payments' ? config.primaryColor : COLORS.textMuted} />
                <Text style={[styles.tabText, { color: activeTab === 'payments' ? config.primaryColor : COLORS.textMuted }]}>
                  Thanh toán
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'orders' && { borderBottomColor: config.primaryColor, borderBottomWidth: 3 }]}
                onPress={() => setActiveTab('orders')}
              >
                <Ionicons name="bag" size={18} color={activeTab === 'orders' ? config.primaryColor : COLORS.textMuted} />
                <Text style={[styles.tabText, { color: activeTab === 'orders' ? config.primaryColor : COLORS.textMuted }]}>
                  Đơn hàng
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'info' && (
              <>
                <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
                  <Text style={styles.sectionTitle}>📋 Thông tin tài khoản</Text>
                  <InfoRow label="Tên đăng nhập" value={userData.username} icon="person" />
                  <InfoRow label="Email" value={userData.email} icon="mail" />
                  <InfoRow label="Họ và tên" value={userData.fullName || 'Chưa cập nhật'} icon="id-card" />
                  <InfoRow label="Số điện thoại" value={userData.phone || 'Chưa cập nhật'} icon="call" />
                </View>

                <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
                  <Text style={styles.sectionTitle}>📊 Thống kê</Text>
                  <View style={styles.statsRow}>
                    <View style={[styles.statItem, { backgroundColor: config.primaryColor + '15' }]}>
                      <Text style={[styles.statValue, { color: config.primaryColor }]}>{orders.length}</Text>
                      <Text style={styles.statLabel}>Đơn hàng</Text>
                    </View>
                    <View style={[styles.statItem, { backgroundColor: config.secondaryColor + '15' }]}>
                      <Text style={[styles.statValue, { color: config.secondaryColor }]}>
                        {orders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0) > 0 ? '✓' : '0'}
                      </Text>
                      <Text style={styles.statLabel}>Đã mua</Text>
                    </View>
                    <View style={[styles.statItem, { backgroundColor: '#FF6B6B15' }]}>
                      <Text style={[styles.statValue, { color: '#FF6B6B' }]}>0</Text>
                      <Text style={styles.statLabel}>Đánh giá</Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            {activeTab === 'wishlist' && (
              <View style={styles.wishlistSection}>
                <Text style={styles.sectionTitle}>❤️ Sản phẩm yêu thích</Text>
                {wishlist.length === 0 ? (
                  <Text style={styles.emptyText}>Chưa có sản phẩm yêu thích</Text>
                ) : (
                  wishlist.map((item) => (
                    <View key={item.id} style={[styles.wishlistCard, { backgroundColor: COLORS.surface }]}>
                      <Image source={{ uri: item.image }} style={styles.wishlistImage} />
                      <View style={styles.wishlistInfo}>
                        <Text style={styles.wishlistName} numberOfLines={2}>{item.name}</Text>
                        <Text style={[styles.wishlistPrice, { color: config.primaryColor }]}>
                          {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {activeTab === 'addresses' && (
              <View style={styles.addressesSection}>
                <View style={styles.addressesHeader}>
                  <Text style={styles.sectionTitle}>📍 Địa chỉ giao hàng</Text>
                  <TouchableOpacity
                    style={[styles.viewAllBtn, { backgroundColor: config.primaryColor }]}
                    onPress={() => navigation?.navigate('Addresses')}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text style={styles.viewAllBtnText}>Thêm</Text>
                  </TouchableOpacity>
                </View>
                {(userData?.addresses || []).length === 0 ? (
                  <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
                ) : (
                  (userData?.addresses || []).slice(0, 3).map((addr) => (
                    <View key={addr.id} style={[styles.addressCard, { backgroundColor: COLORS.surface }]}>
                      <View style={styles.addressIcon}>
                        <Ionicons name="location" size={20} color={config.primaryColor} />
                      </View>
                      <View style={styles.addressContent}>
                        <Text style={styles.addressName}>{addr.name}</Text>
                        <Text style={styles.addressDetail}>{addr.address}</Text>
                        <Text style={styles.addressPhone}>{addr.phone}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {activeTab === 'payments' && (
              <View style={styles.paymentsSection}>
                <View style={styles.paymentsHeader}>
                  <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>
                  <TouchableOpacity
                    style={[styles.viewAllBtn, { backgroundColor: config.primaryColor }]}
                    onPress={() => navigation?.navigate('AddPayment')}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text style={styles.viewAllBtnText}>Thêm</Text>
                  </TouchableOpacity>
                </View>
                {paymentMethods.length === 0 ? (
                  <Text style={styles.emptyText}>Chưa có phương thức thanh toán nào</Text>
                ) : (
                  paymentMethods.map((method) => (
                    <View key={method.id} style={[styles.paymentCard, { backgroundColor: COLORS.surface }]}>
                      <View style={styles.paymentIcon}>
                        <Ionicons 
                          name={method.type === 'credit_card' ? 'wallet' : 'wallet'} 
                          size={24} 
                          color={config.primaryColor} 
                        />
                      </View>
                      <View style={styles.paymentContent}>
                        <Text style={styles.paymentName}>{method.name}</Text>
                        <Text style={styles.paymentNumber}>•••• •••• •••• {method.last4}</Text>
                        {method.isDefault && (
                          <View style={[styles.defaultBadge, { backgroundColor: config.primaryColor + '20' }]}>
                            <Text style={[styles.defaultBadgeText, { color: config.primaryColor }]}>Mặc định</Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity style={styles.paymentAction}>
                        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            )}

            {activeTab === 'orders' && (
              <View style={styles.ordersSection}>
                <View style={styles.ordersHeader}>
                  <Text style={styles.sectionTitle}>📦 Lịch sử đơn hàng</Text>
                  {orders.length > 0 && (
                    <TouchableOpacity
                      style={[styles.viewAllBtn, { backgroundColor: config.primaryColor }]}
                      onPress={() => navigation?.navigate('OrdersHistory')}
                    >
                      <Text style={styles.viewAllBtnText}>Xem tất cả</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {orders.length === 0 ? (
                  <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
                ) : (
                  <FlatList
                    data={orders.slice(0, 3)}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrder}
                    scrollEnabled={false}
                  />
                )}
              </View>
            )}

            <TouchableOpacity
              style={[styles.logoutBtn, { borderColor: config.primaryColor }]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={18} color={config.primaryColor} />
              <Text style={[styles.logoutBtnText, { color: config.primaryColor }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        {icon && <Ionicons name={icon} size={16} color={COLORS.textMuted} />}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerContent: {
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
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOW.md,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F5E6D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { fontSize: 48, color: '#B8956A' },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  email: { fontSize: 13, color: COLORS.textMuted, marginBottom: 18 },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOW.sm,
  },
  editProfileBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 6,
    flexDirection: 'row',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    ...SHADOW.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 14,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  infoValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: RADIUS.md,
  },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  addressesSection: {
    marginBottom: 16,
  },
  addressesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  viewAllBtn: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    gap: 4,
    ...SHADOW.sm,
  },
  viewAllBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  addressCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: RADIUS.md,
    marginBottom: 10,
    ...SHADOW.sm,
    alignItems: 'flex-start',
    gap: 12,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  ordersSection: {
    marginBottom: 16,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  orderCard: {
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 12,
    ...SHADOW.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  orderDate: { fontSize: 11, color: COLORS.textMuted },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderItems: { marginBottom: 10 },
  orderItem: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewSection: {
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
  },
  reviewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  star: {
    fontSize: 24,
  },
  reviewBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  reviewBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  orderFooter: { alignItems: 'flex-end' },
  orderTotal: { fontSize: 14, fontWeight: '800' },
  logoutBtn: {
    borderWidth: 2,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  logoutBtnText: { fontSize: 15, fontWeight: '800' },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  paymentsSection: {
    marginBottom: 16,
  },
  paymentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  paymentCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: RADIUS.lg,
    marginBottom: 12,
    ...SHADOW.sm,
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentContent: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  paymentNumber: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 6,
    letterSpacing: 1,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  paymentAction: {
    padding: 8,
  },
});
