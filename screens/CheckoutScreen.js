import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useAppConfig } from '../context/AppConfigContext';
import { getUser, getCart, saveCart, addOrder } from '../services/storageService';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function CheckoutScreen({ navigation, user }) {
  const { config } = useAppConfig();
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review

  const userId = user?.id || 'guest';

  const loadData = useCallback(async () => {
    const data = await getUser();
    setUserData(data);
    
    // Reset step to 1 when loading
    setStep(1);
    
    // Set default address
    if (data?.addresses && data.addresses.length > 0) {
      const defaultAddr = data.addresses.find((a) => a.isDefault) || data.addresses[0];
      setSelectedAddress(defaultAddr);
    } else {
      setSelectedAddress(null);
    }

    // Set default payment
    if (data?.paymentMethods && data.paymentMethods.length > 0) {
      const defaultPayment = data.paymentMethods.find((p) => p.isDefault) || data.paymentMethods[0];
      setSelectedPayment(defaultPayment);
    } else {
      setSelectedPayment(null);
    }

    // Load cart
    const cart = await getCart(userId);
    setCartItems(cart);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(useCallback(() => {
    loadData();
  }, [loadData]));

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Lỗi', 'Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Lỗi', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng trống');
      return;
    }

    setLoading(true);
    try {
      const order = {
        id: Date.now().toString(),
        userId,
        customerName: userData?.fullName || userData?.username,
        items: cartItems,
        totalPrice: calculateTotal(),
        shippingAddress: selectedAddress.address,
        paymentMethod: selectedPayment.cardName,
        status: 'delivered',
        date: new Date().toLocaleString('vi-VN'),
        createdAt: new Date().toISOString(),
      };

      await addOrder(order, userId);
      await saveCart([], userId);

      Alert.alert('Thành công', 'Đơn hàng đã được tạo thành công!', [
        {
          text: 'Xem đơn hàng',
          onPress: () => {
            setCartItems([]);
            navigation.navigate('Profile');
          },
        },
        {
          text: 'Tiếp tục mua',
          onPress: () => {
            setCartItems([]);
            navigation.navigate('CartMain');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={config.primaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  const total = calculateTotal();
  const shippingFee = total > 500000 ? 0 : 30000;
  const finalTotal = total + shippingFee;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: config.primaryColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.step, { backgroundColor: step >= 1 ? config.primaryColor : COLORS.border }]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={[styles.stepLine, { backgroundColor: step >= 2 ? config.primaryColor : COLORS.border }]} />
          <View style={[styles.step, { backgroundColor: step >= 2 ? config.primaryColor : COLORS.border }]}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={[styles.stepLine, { backgroundColor: step >= 3 ? config.primaryColor : COLORS.border }]} />
          <View style={[styles.step, { backgroundColor: step >= 3 ? config.primaryColor : COLORS.border }]}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
        </View>

        {/* Step 1: Address Selection */}
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>📍 Chọn địa chỉ giao hàng</Text>
            {userData.addresses && userData.addresses.length > 0 ? (
              userData.addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressOption,
                    {
                      backgroundColor: COLORS.surface,
                      borderColor: selectedAddress?.id === address.id ? config.primaryColor : COLORS.border,
                      borderWidth: selectedAddress?.id === address.id ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedAddress(address)}
                >
                  <View style={styles.addressContent}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    <Text style={styles.addressDetail}>{address.address}</Text>
                    <Text style={styles.addressPhone}>{address.phone}</Text>
                  </View>
                  {selectedAddress?.id === address.id && (
                    <Ionicons name="checkmark-circle" size={24} color={config.primaryColor} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: config.primaryColor }]}
                  onPress={() => navigation.navigate('Addresses')}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.addBtnText}>Thêm địa chỉ</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Step 2: Payment Selection */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>💳 Chọn phương thức thanh toán</Text>
            {userData.paymentMethods && userData.paymentMethods.length > 0 ? (
              userData.paymentMethods.map((payment) => (
                <TouchableOpacity
                  key={payment.id}
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: COLORS.surface,
                      borderColor: selectedPayment?.id === payment.id ? config.primaryColor : COLORS.border,
                      borderWidth: selectedPayment?.id === payment.id ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedPayment(payment)}
                >
                  <View style={styles.paymentContent}>
                    <Text style={styles.paymentIcon}>💳</Text>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentName}>{payment.cardName}</Text>
                      <Text style={styles.paymentType}>{payment.type}</Text>
                    </View>
                  </View>
                  {selectedPayment?.id === payment.id && (
                    <Ionicons name="checkmark-circle" size={24} color={config.primaryColor} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Chưa có phương thức thanh toán nào</Text>
                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: config.primaryColor }]}
                  onPress={() => navigation.navigate('PaymentMethods')}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.addBtnText}>Thêm phương thức</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Step 3: Review Order */}
        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>📦 Xác nhận đơn hàng</Text>

            {/* Address Summary */}
            <View style={[styles.summaryCard, { backgroundColor: COLORS.surface }]}>
              <Text style={styles.summaryTitle}>📍 Địa chỉ giao hàng</Text>
              <Text style={styles.summaryText}>{selectedAddress?.name}</Text>
              <Text style={styles.summaryText}>{selectedAddress?.address}</Text>
              <Text style={styles.summaryText}>{selectedAddress?.phone}</Text>
            </View>

            {/* Payment Summary */}
            <View style={[styles.summaryCard, { backgroundColor: COLORS.surface }]}>
              <Text style={styles.summaryTitle}>💳 Phương thức thanh toán</Text>
              <Text style={styles.summaryText}>{selectedPayment?.cardName}</Text>
              <Text style={styles.summaryText}>{selectedPayment?.type}</Text>
            </View>

            {/* Items Summary */}
            <View style={[styles.summaryCard, { backgroundColor: COLORS.surface }]}>
              <Text style={styles.summaryTitle}>📦 Sản phẩm ({cartItems.length})</Text>
              {cartItems.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.productName || item.name}
                  </Text>
                  <Text style={styles.itemQty}>x{item.quantity}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </View>
              ))}
            </View>

            {/* Price Summary */}
            <View style={[styles.priceCard, { backgroundColor: COLORS.surface }]}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tổng sản phẩm:</Text>
                <Text style={styles.priceValue}>{formatPrice(total)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Phí vận chuyển:</Text>
                <Text style={[styles.priceValue, { color: shippingFee === 0 ? COLORS.primary : COLORS.textPrimary }]}>
                  {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                </Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={[styles.priceLabel, { fontWeight: '700', fontSize: 14 }]}>Tổng cộng:</Text>
                <Text style={[styles.priceValue, { color: config.primaryColor, fontWeight: '700', fontSize: 16 }]}>
                  {formatPrice(finalTotal)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }]}
            onPress={() => setStep(step - 1)}
          >
            <Text style={[styles.btnText, { color: COLORS.textPrimary }]}>Quay lại</Text>
          </TouchableOpacity>
        )}
        {step < 3 && (
          <TouchableOpacity
            style={[
              styles.btn, 
              { 
                backgroundColor: config.primaryColor, 
                flex: step === 1 ? 1 : 0.5,
                opacity: (step === 1 && !selectedAddress) || (step === 2 && !selectedPayment) ? 0.5 : 1,
              }
            ]}
            onPress={() => {
              if (step === 1) {
                if (!selectedAddress) {
                  Alert.alert('Lỗi', 'Vui lòng chọn địa chỉ giao hàng');
                  return;
                }
                setStep(2);
              } else if (step === 2) {
                if (!selectedPayment) {
                  Alert.alert('Lỗi', 'Vui lòng chọn phương thức thanh toán');
                  return;
                }
                setStep(3);
              }
            }}
            disabled={(step === 1 && !selectedAddress) || (step === 2 && !selectedPayment)}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
        {step === 3 && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: config.primaryColor, flex: 0.5, opacity: loading ? 0.6 : 1 }]}
            onPress={handleConfirmOrder}
            disabled={loading}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  stepLine: {
    width: 30,
    height: 2,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  addressOption: {
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  paymentOption: {
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    fontSize: 24,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  paymentType: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  emptyBox: {
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemName: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  itemQty: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  priceCard: {
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingVertical: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
