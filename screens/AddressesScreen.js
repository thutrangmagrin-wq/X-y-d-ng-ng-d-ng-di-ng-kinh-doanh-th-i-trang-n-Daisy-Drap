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

export default function AddressesScreen({ navigation }) {
  const { config } = useAppConfig();
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    isDefault: false,
  });

  const loadUserData = useCallback(async () => {
    const data = await getUser();
    console.log('📍 AddressesScreen - Loaded addresses:', data?.addresses?.length || 0);
    setUserData(data);
    setAddresses(data?.addresses || []);
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
      name: '',
      phone: '',
      address: '',
      isDefault: false,
    });
    setModalVisible(true);
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData(address);
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    let updatedAddresses;
    if (editingId) {
      updatedAddresses = addresses.map((a) =>
        a.id === editingId ? { ...formData, id: editingId } : a
      );
    } else {
      updatedAddresses = [
        ...addresses,
        {
          ...formData,
          id: Date.now().toString(),
        },
      ];
    }

    const updated = { ...userData, addresses: updatedAddresses };
    console.log('💾 Saving addresses:', updatedAddresses.length);
    const saveResult = await saveUser(updated);
    console.log('✅ Address save result:', saveResult);
    setUserData(updated);
    setAddresses(updatedAddresses);
    setModalVisible(false);
    Alert.alert('Thành công', editingId ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công');
  };

  const handleDelete = (addressId) => {
    Alert.alert('Xóa địa chỉ', 'Bạn có chắc muốn xóa địa chỉ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const updatedAddresses = addresses.filter((a) => a.id !== addressId);
          const updated = { ...userData, addresses: updatedAddresses };
          await saveUser(updated);
          setUserData(updated);
          setAddresses(updatedAddresses);
          Alert.alert('Thành công', 'Xóa địa chỉ thành công');
        },
      },
    ]);
  };

  const handleSetDefault = async (addressId) => {
    const updatedAddresses = addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    const updated = { ...userData, addresses: updatedAddresses };
    await saveUser(updated);
    setUserData(updated);
    setAddresses(updatedAddresses);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: config.primaryColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>
        <TouchableOpacity onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: config.primaryColor }]}
              onPress={handleAddNew}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addBtnText}>Thêm địa chỉ</Text>
            </TouchableOpacity>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={[styles.addressCard, { backgroundColor: COLORS.surface }]}>
              <View style={styles.addressHeader}>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  {address.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: config.primaryColor }]}>
                      <Text style={styles.defaultBadgeText}>Mặc định</Text>
                    </View>
                  )}
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEdit(address)}>
                    <Ionicons name="pencil" size={20} color={config.primaryColor} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(address.id)} style={{ marginLeft: 12 }}>
                    <Ionicons name="trash" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.addressPhone}>{address.phone}</Text>
              <Text style={styles.addressDetail}>{address.address}</Text>

              {!address.isDefault && (
                <TouchableOpacity
                  style={[styles.setDefaultBtn, { borderColor: config.primaryColor }]}
                  onPress={() => handleSetDefault(address.id)}
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
              {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </Text>
            <TouchableOpacity onPress={handleSaveAddress}>
              <Ionicons name="checkmark" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên địa chỉ *</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Nhà riêng, Văn phòng"
                placeholderTextColor={COLORS.textMuted}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                placeholderTextColor={COLORS.textMuted}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Địa chỉ chi tiết *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập địa chỉ đầy đủ"
                placeholderTextColor={COLORS.textMuted}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: config.primaryColor }]}
              onPress={handleSaveAddress}
            >
              <Text style={styles.saveBtnText}>
                {editingId ? 'Cập nhật' : 'Thêm'} địa chỉ
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
  addressCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.sm,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
  },
  addressPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  addressDetail: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  setDefaultBtn: {
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    alignItems: 'center',
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
  textArea: {
    paddingVertical: 12,
    textAlignVertical: 'top',
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
