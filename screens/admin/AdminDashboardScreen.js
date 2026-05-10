import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../../constants/theme';
import { useAppConfig } from '../../context/AppConfigContext';
import { getProducts, getCustomers, getAllOrdersAdmin } from '../../services/storageService';

import DashboardTab from './tabs/DashboardTab';
import ProductsTab from './tabs/ProductsTab';
import CustomersTab from './tabs/CustomersTab';
import OrdersTab from './tabs/OrdersTab';
import CollectionsTab from './tabs/CollectionsTab';

const TABS = [
  { id: 'dashboard', label: 'Thống kê', icon: 'stats-chart' },
  { id: 'products', label: 'Sản phẩm', icon: 'cube' },
  { id: 'collections', label: 'Bộ sưu tập', icon: 'albums' },
  { id: 'customers', label: 'Khách hàng', icon: 'people' },
  { id: 'orders', label: 'Đơn hàng', icon: 'receipt' },
];

// Căn chiều cao tab bar - thay đổi số này để điều chỉnh
const TAB_BAR_HEIGHT = 48;

export default function AdminDashboardScreen({ user, onLogout }) {
  const { config } = useAppConfig();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [productsData, customersData, ordersData] = await Promise.all([
        getProducts(),
        getCustomers(),
        getAllOrdersAdmin(),
      ]);
      console.log('📊 Admin loaded - Orders:', ordersData?.length || 0, 'Customers:', customersData?.length || 0);
      setProducts(productsData || []);
      setCustomers(customersData || []);
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
  }, [loadData]);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', onPress: () => {} },
      {
        text: 'Đăng xuất',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ]);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={config.primaryColor} />
        </View>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            products={products}
            customers={customers}
            orders={orders}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        );
      case 'products':
        return (
          <ProductsTab
            products={products}
            onDataChange={loadData}
          />
        );
      case 'collections':
        return (
          <CollectionsTab
            onDataChange={loadData}
          />
        );
      case 'customers':
        return (
          <CustomersTab
            customers={customers}
            orders={orders}
            onDataChange={loadData}
          />
        );
      case 'orders':
        return (
          <OrdersTab
            orders={orders}
            customers={customers}
            onDataChange={loadData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: config.primaryColor }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Xin chào, {user?.username || 'Admin'}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View 
        style={[styles.tabBar, { backgroundColor: COLORS.surface }]}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && [
                  styles.tabButtonActive,
                  { borderBottomColor: config.primaryColor },
                ],
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? config.primaryColor : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === tab.id ? config.primaryColor : COLORS.textMuted,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    height: TAB_BAR_HEIGHT,
  },
  tabBarContent: {
    paddingHorizontal: 4,
    gap: 4,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    minWidth: 90,
  },
  tabButtonActive: {
    borderBottomWidth: 3,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
