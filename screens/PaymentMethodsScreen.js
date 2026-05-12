import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useAppConfig } from '../context/AppConfigContext';
import { getUser, saveUser } from '../services/storageService';

const PAYMENT_TYPES = [
  { id: 'credit_card', label: 'Thẻ tín dụng', icon: '💳' },
  { id: 'debit_card', label: 'Thẻ ghi nợ', icon: '🏦' },
  { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏧' },
  { id: 'e_wallet', label: 'Ví điện tử', icon: '📱' },
];

export default function PaymentMethodsScreen({ navigation }) {
  const { config } = useAppConfig();
  const [userData, setUserData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'credit_card',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    isDefault: false,
  });

  const loadUserData = useCallback(async () => {
    const data = await getUser();
    console.log('💳 PaymentMethodsScreen - Loaded payment methods:', data?.paymentMethods?.length || 0);
    setUserData(data);
    setPaymentMethods(data?.paymentMethods || []);
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useFocusEffect(useCallback(() => {
    loadUserData();
  }, [loadUserData]));

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      type: 'credit_card',
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      isDefault: false,
    });
    setModalVisible(true);
  };

  const handleEdit = (method) => {
    setEditingId(method.id);
    setFormData(method);
    setModalVisible(true);
  };

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  };

  const validateExpiryDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(date);
  };

  const formatCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleSavePayment = async () => {
    if (!formData.cardName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thẻ');
      return;
    }

    if (formData.type === 'credit_card' || formData.type === 'debit_card') {
      if (!formData.cardNumber.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập số thẻ');
        return;
      }
      if (!validateCardNumber(formData.cardNumber)) {
        Alert.alert('Lỗi', 'Số thẻ không hợp lệ (13-19 chữ số)');
        return;
      }
      if (!formData.expiryDate.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập ngày hết hạn (MM/YY)');
        return;
      }
      if (!validateExpiryDate(formData.expiryDate)) {
        Alert.alert('Lỗi', 'Ngày hết hạn không hợp lệ (MM/YY)');
        return;
      }
    }

    let updatedMethods;
    if (editingId) {
      updatedMethods = paymentMethods.map((m) =>
        m.id === editingId ? { ...formData, id: editingId } : m
      );
    } else {
      updatedMethods = [
        ...paymentMethods,
        {
          ...formData,
          id: Date.now().toString(),
        },
      ];
    }

    const updated = { ...userData, paymentMethods: updatedMethods };
    console.log('💾 Saving payment methods:', updatedMethods.length);
    const saveResult = await saveUser(updated);
    console.log('✅ Payment method save result:', saveResult);
    setUserData(updated);
    setPaymentMethods(updatedMethods);
    setModalVisible(false);
    Alert.alert('Thành công', editingId ? 'Cập nhật phương thức thanh toán thành công' : 'Thêm phương thức thanh toán thành công');
  };

  const handleDelete = (methodId) => {
    Alert.alert('Xóa phương thức thanh toán', 'Bạn có chắc muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const updatedMethods = paymentMethods.filter((m) => m.id !== methodId);
          const updated = { ...userData, paymentMethods: updatedMethods };
          await saveUser(updated);
          setUserData(updated);
          setPaymentMethods(updatedMethods);
          Alert.alert('Thành công', 'Xóa phương thức thanh toán thành công');
        },
      },
    ]);
  };

  const handleSetDefault = async (methodId) => {
    const updatedMethods = paymentMethods.map((m) => ({
      ...m,
      isDefault: m.id === methodId,
    }));
    const updated = { ...userData, paymentMethods: updatedMethods };
    await saveUser(updated);
    setUserData(updated);
    setPaymentMethods(updatedMethods);
  };

  const getPaymentTypeLabel = (type) => {
    return PAYMENT_TYPES.find((t) => t.id === type)?.label || type;
  };

  const getPaymentTypeIcon = (type) => {
    return PAYMENT_TYPES.find((t) => t.id === type)?.icon || '💳';
  };

  const maskCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    const last4 = cleaned.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: config.primaryColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <TouchableOpacity onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {paymentMethods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={styles.emptyText}>Chưa có phương thức thanh toán nào</Text>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: config.primaryColor }]}
              onPress={handleAddNew}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addBtnText}>Thêm phương thức</Text>
            </TouchableOpacity>
          </View>
        ) : (
          paymentMethods.map((method) => (
            <View key={method.id} style={[styles.methodCard, { backgroundColor: COLORS.surface }]}>
              <View style={styles.methodHeader}>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodIcon}>{getPaymentTypeIcon(method.type)}</Text>
                  <View style={styles.methodDetails}>
                    <Text style={styles.methodName}>{method.cardName}</Text>
                    <Text style={styles.methodType}>{getPaymentTypeLabel(method.type)}</Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEdit(method)}>
                    <Ionicons name="pencil" size={20} color={config.primaryColor} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(method.id)} style={{ marginLeft: 12 }}>
                    <Ionicons name="trash" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {(method.type === 'credit_card' || method.type === 'debit_card') && (
                <>
                  <Text style={styles.cardNumber}>{maskCardNumber(method.cardNumber)}</Text>
                  <Text style={styles.expiryDate}>Hết hạn: {method.expiryDate}</Text>
                </>
              )}

              {method.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: config.primaryColor }]}>
                  <Ionicons name="checkmark-circle" size={14} color="#fff" />
                  <Text style={styles.defaultBadgeText}>Mặc định</Text>
                </View>
              )}

              {!method.isDefault && (
                <TouchableOpacity
                  style={[styles.setDefaultBtn, { borderColor: config.primaryColor }]}
                  onPress={() => handleSetDefault(method.id)}
                >
                  <Text style={[styles.setDefaultBtnText, { color: config.primaryColor }]}>
                    Đặt làm mặc định
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: config.backgroundColor }]}>
          <View style={[styles.modalHeader, { backgroundColor: config.primaryColor }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingId ? 'Chỉnh sửa phương thức' : 'Thêm phương thức mới'}
            </Text>
            <TouchableOpacity onPress={handleSavePayment}>
              <Ionicons name="checkmark" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Loại phương thức *</Text>
              <View style={styles.typeGrid}>
                {PAYMENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeOption,
                      {
                        backgroundColor: formData.type === type.id ? `${config.primaryColor}20` : COLORS.surface,
                        borderColor: formData.type === type.id ? config.primaryColor : COLORS.border,
                        borderWidth: formData.type === type.id ? 2 : 1,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, type: type.id })}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={styles.typeLabel}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên phương thức *</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Thẻ Visa cá nhân"
                placeholderTextColor={COLORS.textMuted}
                value={formData.cardName}
                onChangeText={(text) => setFormData({ ...formData, cardName: text })}
              />
            </View>

            {(formData.type === 'credit_card' || formData.type === 'debit_card') && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Số thẻ *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={COLORS.textMuted}
                    value={formData.cardNumber}
                    onChangeText={(text) => setFormData({ ...formData, cardNumber: formatCardNumber(text) })}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                  <Text style={styles.hint}>13-19 chữ số</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Ngày hết hạn *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={COLORS.textMuted}
                    value={formData.expiryDate}
                    onChangeText={(text) => {
                      let formatted = text.replace(/\D/g, '');
                      if (formatted.length >= 2) {
                        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
                      }
                      setFormData({ ...formData, expiryDate: formatted });
                    }}
                    maxLength={5}
                    keyboardType="numeric"
                  />
                  <Text style={styles.hint}>Định dạng: MM/YY</Text>
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: config.primaryColor }]}
              onPress={handleSavePayment}
            >
              <Text style={styles.saveBtnText}>
                {editingId ? 'Cập nhật' : 'Thêm'} phương thức
              </Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  methodCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.sm,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    fontSize: 32,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  methodType: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: 'row',
  },
  cardNumber: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginBottom: 4,
    fontWeight: '600',
  },
  expiryDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
    alignSelf: 'flex-start',
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  setDefaultBtn: {
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  setDefaultBtnText: {
    fontSize: 12,
    fontWeight: '600',
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    minWidth: '48%',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    gap: 6,
  },
  typeIcon: {
    fontSize: 24,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  saveBtn: {
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
