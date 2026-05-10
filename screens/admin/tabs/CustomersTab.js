import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../../../constants/theme';
import { useAppConfig } from '../../../context/AppConfigContext';
import { saveCustomers } from '../../../services/storageService';

const CustomerDetailsModal = ({ visible, customer, orders, onLock, onUnlock, onClose, primaryColor }) => {
  if (!customer) return null;

  const customerOrders = orders.filter((o) => o.customerId === customer.id);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.modalContainer, { backgroundColor: COLORS.background }]}>
        {/* Modal Header */}
        <View style={[styles.modalHeader, { backgroundColor: primaryColor }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Chi tiết khách hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Content */}
        <View style={styles.modalContent}>
          {/* Customer Info */}
          <View style={[styles.infoCard, { backgroundColor: COLORS.surface }]}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên:</Text>
              <Text style={styles.infoValue}>{customer.fullName || customer.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{customer.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Điện thoại:</Text>
              <Text style={styles.infoValue}>{customer.phone || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ:</Text>
              <Text style={styles.infoValue}>{customer.address || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày tham gia:</Text>
              <Text style={styles.infoValue}>
                {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trạng thái:</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: customer.isLocked ? '#F4433620' : '#4CAF5020',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: customer.isLocked ? '#F44336' : '#4CAF50',
                    },
                  ]}
                >
                  {customer.isLocked ? 'Đã khóa' : 'Hoạt động'}
                </Text>
              </View>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={[styles.statBox, { backgroundColor: COLORS.surface }]}>
              <Text style={styles.statValue}>{customerOrders.length}</Text>
              <Text style={styles.statLabel}>Đơn hàng</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: COLORS.surface }]}>
              <Text style={styles.statValue}>
                {(customer.totalSpent || 0).toLocaleString('vi-VN')}
              </Text>
              <Text style={styles.statLabel}>Tổng chi</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {customer.isLocked ? (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
                onPress={() => onUnlock(customer.id)}
              >
                <Ionicons name="lock-open" size={20} color="#fff" />
                <Text style={styles.actionBtnText}>Mở khóa tài khoản</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#F44336' }]}
                onPress={() => onLock(customer.id)}
              >
                <Ionicons name="lock-closed" size={20} color="#fff" />
                <Text style={styles.actionBtnText}>Khóa tài khoản</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Recent Orders */}
          <View style={styles.ordersSection}>
            <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
            {customerOrders.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có đơn hàng</Text>
            ) : (
              customerOrders.slice(-5).reverse().map((order) => (
                <View key={order.id} style={[styles.orderItem, { backgroundColor: COLORS.surface }]}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>#{order.id.substring(0, 8)}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                  <Text style={styles.orderTotal}>
                    {order.totalPrice.toLocaleString('vi-VN')} ₫
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CustomerRow = ({ customer, onViewDetails, onLock, onUnlock, primaryColor }) => (
  <TouchableOpacity
    style={[styles.customerRow, { backgroundColor: COLORS.surface }]}
    onPress={() => onViewDetails(customer)}
  >
    <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
      <Text style={styles.avatarText}>
        {(customer.fullName || customer.username).charAt(0).toUpperCase()}
      </Text>
    </View>

    <View style={styles.customerInfo}>
      <Text style={styles.customerName}>{customer.fullName || customer.username}</Text>
      <Text style={styles.customerEmail} numberOfLines={1}>
        {customer.email}
      </Text>
      <Text style={styles.customerPhone}>{customer.phone || 'N/A'}</Text>
    </View>

    <View style={styles.customerStatus}>
      <View
        style={[
          styles.statusIndicator,
          {
            backgroundColor: customer.isLocked ? '#F44336' : '#4CAF50',
          },
        ]}
      />
      <Text style={styles.statusLabel}>
        {customer.isLocked ? 'Khóa' : 'Hoạt động'}
      </Text>
    </View>

    <TouchableOpacity
      style={styles.moreBtn}
      onPress={() => {
        if (customer.isLocked) {
          Alert.alert('Mở khóa', 'Bạn có chắc chắn muốn mở khóa tài khoản này?', [
            { text: 'Hủy', onPress: () => {} },
            {
              text: 'Mở khóa',
              onPress: () => onUnlock(customer.id),
              style: 'default',
            },
          ]);
        } else {
          Alert.alert('Khóa tài khoản', 'Bạn có chắc chắn muốn khóa tài khoản này?', [
            { text: 'Hủy', onPress: () => {} },
            {
              text: 'Khóa',
              onPress: () => onLock(customer.id),
              style: 'destructive',
            },
          ]);
        }
      }}
    >
      <Ionicons
        name={customer.isLocked ? 'lock-open' : 'lock-closed'}
        size={18}
        color={primaryColor}
      />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function CustomersTab({ customers, orders, onDataChange }) {
  const { config } = useAppConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) =>
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.fullName && c.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [customers, searchQuery]);

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setDetailsModalVisible(true);
  };

  const handleLockCustomer = async (customerId) => {
    const updated = customers.map((c) =>
      c.id === customerId ? { ...c, isLocked: true } : c
    );
    await saveCustomers(updated);
    onDataChange();
    setDetailsModalVisible(false);
    Alert.alert('Thành công', 'Tài khoản đã được khóa');
  };

  const handleUnlockCustomer = async (customerId) => {
    const updated = customers.map((c) =>
      c.id === customerId ? { ...c, isLocked: false } : c
    );
    await saveCustomers(updated);
    onDataChange();
    setDetailsModalVisible(false);
    Alert.alert('Thành công', 'Tài khoản đã được mở khóa');
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm khách hàng..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy khách hàng</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerRow
              customer={item}
              onViewDetails={handleViewDetails}
              onLock={handleLockCustomer}
              onUnlock={handleUnlockCustomer}
              primaryColor={config.primaryColor}
            />
          )}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {/* Details Modal */}
      <CustomerDetailsModal
        visible={detailsModalVisible}
        customer={selectedCustomer}
        orders={orders}
        onLock={handleLockCustomer}
        onUnlock={handleUnlockCustomer}
        onClose={() => setDetailsModalVisible(false)}
        primaryColor={config.primaryColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 12,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.lg,
    gap: 12,
    ...SHADOW.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  customerStatus: {
    alignItems: 'center',
    gap: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
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
    paddingTop: 16,
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    ...SHADOW.sm,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  actionContainer: {
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  ordersSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  orderTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
