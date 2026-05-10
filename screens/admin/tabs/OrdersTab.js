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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../../../constants/theme';
import { useAppConfig } from '../../../context/AppConfigContext';
import { saveAllOrdersAdmin } from '../../../services/storageService';

const ORDER_STATUSES = [
  { id: 'pending', label: 'Chờ', color: '#FFA500' },
  { id: 'processing', label: 'Đang', color: '#2196F3' },
  { id: 'shipped', label: 'Gửi', color: '#9C27B0' },
  { id: 'delivered', label: 'Giao', color: '#4CAF50' },
  { id: 'cancelled', label: 'Hủy', color: '#F44336' },
];

const formatPrice = (price) => {
  if (!price && price !== 0) return '0 ₫';
  try {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  } catch (e) {
    console.error('❌ formatPrice error in OrdersTab:', e, 'price:', price);
    return '0 ₫';
  }
};

const getStatusColor = (status) => {
  const found = ORDER_STATUSES.find((s) => s.id === status);
  return found?.color || COLORS.textMuted;
};

const getStatusLabel = (status) => {
  const found = ORDER_STATUSES.find((s) => s.id === status);
  return found?.label || status;
};

const OrderDetailsModal = ({ visible, order, onStatusChange, onClose, primaryColor }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'pending');

  if (!order) return null;

  const handleSaveStatus = () => {
    if (selectedStatus !== order.status) {
      onStatusChange(order.id, selectedStatus);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.modalContainer, { backgroundColor: COLORS.background }]}>
        {/* Modal Header */}
        <View style={[styles.modalHeader, { backgroundColor: primaryColor }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>
          <TouchableOpacity onPress={handleSaveStatus}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalContentInner}>
          {/* Order Info */}
          <View style={[styles.infoCard, { backgroundColor: COLORS.surface }]}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã đơn:</Text>
              <Text style={styles.infoValue}>{order.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Khách hàng:</Text>
              <Text style={styles.infoValue}>{order.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày tạo:</Text>
              <Text style={styles.infoValue}>
                {order.date ? order.date.split(' ')[0] : (order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ giao:</Text>
              <Text style={[styles.infoValue, { flex: 1 }]}>
                {order.shippingAddress || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <View key={index} style={[styles.itemCard, { backgroundColor: COLORS.surface }]}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.productName || item.name || 'Sản phẩm'}
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
              ))
            ) : (
              <Text style={styles.emptyText}>Không có sản phẩm</Text>
            )}
          </View>

          {/* Total */}
          <View style={[styles.totalCard, { backgroundColor: COLORS.surface }]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={[styles.totalValue, { color: primaryColor }]}>
              {formatPrice(order.totalPrice || order.total || 0)}
            </Text>
          </View>

          {/* Status Update */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cập nhật trạng thái</Text>
            <View style={styles.statusGrid}>
              {ORDER_STATUSES.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor:
                        selectedStatus === status.id ? `${status.color}20` : COLORS.surface,
                      borderColor: selectedStatus === status.id ? status.color : COLORS.border,
                      borderWidth: selectedStatus === status.id ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedStatus(status.id)}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: status.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      {
                        color: selectedStatus === status.id ? status.color : COLORS.textPrimary,
                        fontWeight: selectedStatus === status.id ? '700' : '500',
                      },
                    ]}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const OrderRow = ({ order, onViewDetails, primaryColor }) => (
  <TouchableOpacity
    style={[styles.orderRow, { backgroundColor: COLORS.surface }]}
    onPress={() => onViewDetails(order)}
  >
    <View style={styles.orderMain}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{order.id?.substring(0, 8) || 'N/A'}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(order.status || 'pending')}20` },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: getStatusColor(order.status || 'pending') },
            ]}
          >
            {getStatusLabel(order.status || 'pending')}
          </Text>
        </View>
      </View>
      <Text style={styles.customerName}>{order.customerName || 'Guest'}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderDate}>
          {order.date ? order.date.split(' ')[0] : (order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A')}
        </Text>
        <Text style={[styles.orderTotal, { color: primaryColor }]}>
          {formatPrice(order.totalPrice || order.total || 0)}
        </Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
  </TouchableOpacity>
);

export default function OrdersTab({ orders, customers, onDataChange }) {
  const { config } = useAppConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, searchQuery, statusFilter]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    // Lưu vào ALL_ORDERS_ADMIN thay vì ORDERS_${userId}
    await saveAllOrdersAdmin(updated);
    onDataChange();
    setDetailsModalVisible(false);
    Alert.alert('Thành công', 'Trạng thái đơn hàng đã được cập nhật');
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm đơn hàng..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterBtn,
            statusFilter === 'all' && { backgroundColor: config.primaryColor },
          ]}
          onPress={() => setStatusFilter('all')}
        >
          <Text
            style={[
              styles.filterBtnText,
              statusFilter === 'all' && { color: '#fff' },
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        {ORDER_STATUSES.map((status) => (
          <TouchableOpacity
            key={status.id}
            style={[
              styles.filterBtn,
              statusFilter === status.id && { backgroundColor: status.color },
            ]}
            onPress={() => setStatusFilter(status.id)}
          >
            <Text
              style={[
                styles.filterBtnText,
                statusFilter === status.id && { color: '#fff' },
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy đơn hàng</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderRow
              order={item}
              onViewDetails={handleViewDetails}
              primaryColor={config.primaryColor}
            />
          )}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {/* Details Modal */}
      <OrderDetailsModal
        visible={detailsModalVisible}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
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
  filterContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  filterContent: {
    gap: 6,
  },
  filterBtn: {
    flex: 3,
    minWidth: 70,
    height: 40,
    paddingHorizontal: 1,
    paddingVertical: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 2,
    gap: 12,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: RADIUS.lg,
    gap: 12,
    ...SHADOW.sm,
  },
  orderMain: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  orderTotal: {
    fontSize: 12,
    fontWeight: '700',
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
  },
  modalContentInner: {
    padding: 16,
    paddingBottom: 24,
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
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
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
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    minWidth: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusOptionText: {
    fontSize: 11,
    color: COLORS.textPrimary,
  },
});
