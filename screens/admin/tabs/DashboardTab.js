import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../../../constants/theme';
import { useAppConfig } from '../../../context/AppConfigContext';

const { width } = Dimensions.get('window');

const formatPrice = (price) => {
  console.log('💰 formatPrice called with:', price, typeof price);
  if (!price && price !== 0) return '0 ₫';
  try {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  } catch (e) {
    console.error('❌ formatPrice error:', e, 'price:', price);
    return '0 ₫';
  }
};

const StatCard = ({ label, value, icon, color }) => (
  <View style={[styles.statCard, { backgroundColor: COLORS.surface }, SHADOW.sm]}>
    <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  </View>
);

const RevenueChart = ({ orders, primaryColor }) => {
  const chartData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' }));
    }

    const dailyRevenue = last7Days.map((day) => {
      const dayOrders = orders.filter((o) => {
        try {
          const orderDate = new Date(o.createdAt || o.date).toLocaleDateString('vi-VN', {
            month: '2-digit',
            day: '2-digit',
          });
          return orderDate === day;
        } catch (e) {
          return false;
        }
      });
      return dayOrders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0);
    });

    return { labels: last7Days, data: dailyRevenue };
  }, [orders]);

  const maxRevenue = chartData.data.length > 0 ? Math.max(...chartData.data, 1) : 1;
  const chartHeight = 200;

  return (
    <View style={[styles.chartContainer, { backgroundColor: COLORS.surface }, SHADOW.sm]}>
      <Text style={styles.chartTitle}>Doanh thu 7 ngày gần đây</Text>

      <View style={styles.chart}>
        <View style={styles.chartBars}>
          {chartData.data.map((value, index) => {
            const height = (value / maxRevenue) * chartHeight;
            return (
              <View key={index} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(height, 5),
                      backgroundColor: primaryColor,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{chartData.labels[index]}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.chartLegend}>
        <Text style={styles.chartLegendText}>
          Tổng: {formatPrice(chartData.data.reduce((a, b) => a + b, 0))}
        </Text>
      </View>
    </View>
  );
};

const RecentOrdersTable = ({ orders }) => {
  const recentOrders = orders.slice(-5).reverse();

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

  return (
    <View style={[styles.tableContainer, { backgroundColor: COLORS.surface }, SHADOW.sm]}>
      <Text style={styles.tableTitle}>Đơn hàng gần đây</Text>

      {recentOrders.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có đơn hàng</Text>
      ) : (
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 1 }]}>ID</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Khách</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Tổng</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Trạng thái</Text>
          </View>

          {/* Rows */}
          {recentOrders.map((order, index) => (
            <View key={order.id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
              <Text style={[styles.tableCell, { flex: 1 }, styles.cellId]}>
                {order.id?.substring(0, 8) || 'N/A'}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>
                {order.customerName || 'Guest'}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {formatPrice(order.totalPrice || order.total || 0)}
              </Text>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(order.status)}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {getStatusLabel(order.status || 'pending')}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const AllOrdersTable = ({ orders }) => {
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

  const formatDate = (dateStr) => {
    try {
      if (!dateStr) return 'N/A';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return 'N/A';
    }
  };

  const sortedOrders = [...orders].reverse();

  return (
    <View style={[styles.allOrdersContainer, { backgroundColor: COLORS.surface }, SHADOW.sm]}>
      <Text style={styles.tableTitle}>Tất cả đơn hàng ({orders.length})</Text>

      {sortedOrders.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có đơn hàng</Text>
      ) : (
        <View style={styles.ordersList}>
          {sortedOrders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { borderLeftColor: getStatusColor(order.status || 'pending') }]}>
              <View style={styles.orderCardHeader}>
                <View style={styles.orderCardLeft}>
                  <Text style={styles.orderId}>#{order.id?.substring(0, 8) || 'N/A'}</Text>
                  <Text style={styles.orderCustomer}>{order.customerName || 'Guest'}</Text>
                </View>
                <View style={styles.orderCardRight}>
                  <Text style={[styles.orderTotal, { color: getStatusColor(order.status || 'pending') }]}>
                    {formatPrice(order.totalPrice || order.total || 0)}
                  </Text>
                  <View style={[styles.statusBadgeSmall, { backgroundColor: `${getStatusColor(order.status || 'pending')}20` }]}>
                    <Text style={[styles.statusTextSmall, { color: getStatusColor(order.status || 'pending') }]}>
                      {getStatusLabel(order.status || 'pending')}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.orderCardFooter}>
                <Text style={styles.orderDate}>📅 {formatDate(order.createdAt || order.date)}</Text>
                <Text style={styles.orderItems}>📦 {order.items?.length || 0} sản phẩm</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default function DashboardTab({ products, customers, orders, onRefresh, refreshing }) {
  const { config } = useAppConfig();

  const statistics = useMemo(() => {
    try {
      const totalRevenue = orders.reduce((sum, order) => {
        const price = order.totalPrice || order.total || 0;
        return sum + (typeof price === 'number' ? price : 0);
      }, 0);
      return {
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalRevenue,
      };
    } catch (e) {
      console.error('Statistics calculation error:', e);
      return {
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalRevenue: 0,
      };
    }
  }, [orders, customers, products]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Statistics Cards */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Tổng đơn hàng"
          value={statistics.totalOrders.toString()}
          icon="📦"
          color="#2196F3"
        />
        <StatCard
          label="Tổng khách"
          value={statistics.totalCustomers.toString()}
          icon="👥"
          color="#4CAF50"
        />
        <StatCard
          label="Tổng sản phẩm"
          value={statistics.totalProducts.toString()}
          icon="🛍️"
          color="#FF9800"
        />
        <StatCard
          label="Doanh thu"
          value={formatPrice(statistics.totalRevenue)}
          icon="💰"
          color={config.primaryColor}
        />
      </View>

      {/* Revenue Chart */}
      <RevenueChart orders={orders} primaryColor={config.primaryColor} />

      {/* Recent Orders */}
      <RecentOrdersTable orders={orders} />

      {/* All Orders Table */}
      <AllOrdersTable orders={orders} />

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 24,
  },
  statsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: RADIUS.lg,
    gap: 12,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartContainer: {
    padding: 16,
    borderRadius: RADIUS.lg,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  chart: {
    marginBottom: 12,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 200,
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  bar: {
    width: '100%',
    borderRadius: RADIUS.sm,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  chartLegend: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  chartLegendText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  tableContainer: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    padding: 16,
    paddingBottom: 12,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRowAlt: {
    backgroundColor: COLORS.background,
  },
  tableHeader: {
    backgroundColor: COLORS.background,
    fontWeight: '700',
  },
  tableCell: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  cellId: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
  },
  spacer: {
    height: 20,
  },
  allOrdersContainer: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 16,
  },
  ordersList: {
    padding: 12,
    gap: 12,
  },
  orderCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    padding: 12,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderCardLeft: {
    flex: 1,
  },
  orderCardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '800',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusTextSmall: {
    fontSize: 10,
    fontWeight: '600',
  },
  orderCardFooter: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  orderItems: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
