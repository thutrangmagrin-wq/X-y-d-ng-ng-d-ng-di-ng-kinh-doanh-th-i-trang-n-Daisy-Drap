/**
 * storageService.js
 * Lưu trữ dữ liệu dùng AsyncStorage.
 * Keys: CART, WISHLIST, USER, ORDERS, ALL_USERS, ALL_PRODUCTS, ALL_ORDERS
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS } from '../data/products';
import { hashPassword, verifyPassword } from './passwordService';

const KEYS = {
  CART: 'CART',
  WISHLIST: 'WISHLIST',
  USER: 'USER',
  ORDERS: 'ORDERS',
  ALL_USERS: 'ALL_USERS',
  ALL_PRODUCTS: 'ALL_PRODUCTS',
  ALL_ORDERS: 'ALL_ORDERS',
  APP_CONFIG: 'APP_CONFIG',
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const get = async (key, fallback = null) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`get(${key}) error:`, e);
    return fallback;
  }
};

const set = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`set(${key}) error:`, e);
    return false;
  }
};

const remove = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`remove(${key}) error:`, e);
  }
};

// ─── CART ─────────────────────────────────────────────────────────────────────
export const getCart = async (userId) => get(`CART_${userId}`, []);
export const saveCart = (cart, userId) => set(`CART_${userId}`, cart);
export const clearCart = (userId) => set(`CART_${userId}`, []);

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
export const getWishlist = async (userId) => get(`WISHLIST_${userId}`, []);
export const saveWishlist = (wishlist, userId) => set(`WISHLIST_${userId}`, wishlist);

// ─── CURRENT USER ─────────────────────────────────────────────────────────────
export const getUser = async () => {
  return get(KEYS.USER, null);
};
export const saveUser = async (user) => {
  console.log('💾 saveUser called with:', user?.email);
  const result = await set(KEYS.USER, user);
  console.log('✅ saveUser result:', result);
  return result;
};
export const removeUser = () => remove(KEYS.USER);

// ─── ORDERS (của từng user) ───────────────────────────────────────────────────
export const getOrders = async (userId) => get(`ORDERS_${userId}`, []);
export const saveOrders = (orders, userId) => set(`ORDERS_${userId}`, orders);
export const addOrder = async (order, userId) => {
  console.log('💾 Adding order for user:', userId);
  const existing = await getOrders(userId);
  await saveOrders([order, ...existing], userId);
  // Cũng lưu vào ALL_ORDERS_ADMIN để admin xem
  const allOrders = await getAllOrdersAdmin();
  console.log('📊 Current admin orders:', allOrders.length);
  await saveAllOrdersAdmin([order, ...allOrders]);
  console.log('✅ Order saved to admin dashboard');
};

// ─── ALL USERS (admin quản lý) ────────────────────────────────────────────────
export const getAllUsers = async () => get(KEYS.ALL_USERS, []);
export const saveAllUsers = (users) => set(KEYS.ALL_USERS, users);

export const registerUser = async (user) => {
  try {
    const users = await getAllUsers();
    const exists = users.find((u) => u.email === user.email);
    if (exists) return { success: false, message: 'Email đã được sử dụng' };
    
    const newUser = { 
      ...user, 
      id: Date.now().toString(), 
      password: hashPassword(user.password), // Hash mật khẩu
      createdAt: new Date().toLocaleString('vi-VN'), 
      status: 'active',
      role: 'customer',
      reviews: [],
      addresses: [],
      paymentMethods: [],
    };
    await saveAllUsers([...users, newUser]);
    // Lưu user hiện tại vào AsyncStorage
    await saveUser(newUser);
    // Cũng lưu vào ALL_CUSTOMERS để admin xem được
    const customers = await getCustomers();
    await saveCustomers([...customers, newUser]);
    return { success: true, user: newUser };
  } catch (error) {
    console.error('registerUser error:', error);
    return { success: false, message: 'Lỗi khi đăng ký: ' + error.message };
  }
};

export const loginUser = async (email, password) => {
  console.log('🔍 loginUser called with email:', email);
  let users = await getAllUsers();
  console.log('📊 Current users in storage:', users.length);
  
  // Chỉ tạo tài khoản mặc định nếu không có user nào
  // Nhưng KHÔNG ghi đè lên dữ liệu cũ
  if (users.length === 0) {
    console.log('⚠️ No users found, creating default demo accounts');
    const defaultUsers = [
      {
        id: '1',
        username: 'demo',
        email: 'demo@example.com',
        password: hashPassword('demo123'),
        fullName: 'Demo User',
        phone: '0123456789',
        address: '123 Đường ABC, TP HCM',
        role: 'customer',
        createdAt: new Date().toLocaleString('vi-VN'),
        status: 'active',
        reviews: [],
        addresses: [],
        paymentMethods: [],
        isLocked: false,
        joinDate: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
      },
      {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@daisydrape.com',
        password: hashPassword('admin123'),
        fullName: 'Admin User',
        phone: '0987654321',
        address: 'Admin Office',
        role: 'admin',
        createdAt: new Date().toLocaleString('vi-VN'),
        status: 'active',
        reviews: [],
        addresses: [],
        paymentMethods: [],
        isLocked: false,
        joinDate: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
      },
    ];
    await saveAllUsers(defaultUsers);
    users = defaultUsers;
    console.log('✅ Default users created:', users.map(u => u.email));
  } else {
    // Nếu đã có users, chỉ thêm admin nếu chưa tồn tại
    const adminExists = users.find((u) => u.email === 'admin@daisydrape.com');
    if (!adminExists) {
      console.log('⚠️ Admin user not found, adding admin user');
      const adminUser = {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@daisydrape.com',
        password: hashPassword('admin123'),
        fullName: 'Admin User',
        phone: '0987654321',
        address: 'Admin Office',
        role: 'admin',
        createdAt: new Date().toLocaleString('vi-VN'),
        status: 'active',
        reviews: [],
        addresses: [],
        paymentMethods: [],
        isLocked: false,
        joinDate: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
      };
      users = [...users, adminUser];
      await saveAllUsers(users);
      console.log('✅ Admin user added');
    }
  }
  
  console.log('🔎 Searching for user with email:', email);
  console.log('📋 Available users:', users.map(u => ({ email: u.email, role: u.role })));
  
  // Tìm user theo email
  const user = users.find((u) => u.email === email);
  
  if (!user) {
    console.log('❌ User not found');
    return { success: false, message: 'Email hoặc mật khẩu không đúng' };
  }
  
  // Kiểm tra mật khẩu bằng verifyPassword
  if (!verifyPassword(password, user.password)) {
    console.log('❌ Password incorrect');
    return { success: false, message: 'Email hoặc mật khẩu không đúng' };
  }
  
  if (user.status === 'blocked' || user.isLocked) {
    console.log('🚫 User account is blocked');
    return { success: false, message: 'Tài khoản đã bị khóa' };
  }
  
  // Lưu user vào AsyncStorage
  console.log('💾 Saving user to AsyncStorage:', user.email);
  await saveUser(user);
  console.log('✅ User saved successfully');
  
  return { success: true, user };
};

export const updateUserStatus = async (userId, status) => {
  const users = await getAllUsers();
  const updated = users.map((u) => u.id === userId ? { ...u, status } : u);
  await saveAllUsers(updated);
};

// ─── ALL PRODUCTS (seller + admin quản lý) ────────────────────────────────────
export const getProducts = async () => {
  const saved = await get(KEYS.ALL_PRODUCTS, null);
  return saved || PRODUCTS;
};

export const saveProducts = (products) => set(KEYS.ALL_PRODUCTS, products);

export const addProduct = async (product) => {
  const existing = await getProducts();
  const newProduct = { 
    ...product, 
    id: Date.now().toString(), 
    sold: 0, 
    rating: 5.0, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveProducts([newProduct, ...existing]);
  return newProduct;
};

export const updateProduct = async (productId, updates) => {
  const existing = await getProducts();
  const updated = existing.map((p) => 
    p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
  );
  await saveProducts(updated);
};

export const deleteProduct = async (productId) => {
  const existing = await getProducts();
  await saveProducts(existing.filter((p) => p.id !== productId));
};

// ─── CUSTOMERS (admin quản lý) ────────────────────────────────────────────────
const CUSTOMERS_KEY = 'ALL_CUSTOMERS';

export const getCustomers = async () => {
  const saved = await get(CUSTOMERS_KEY, []);
  return saved;
};

export const saveCustomers = (customers) => set(CUSTOMERS_KEY, customers);

export const addCustomer = async (customer) => {
  const existing = await getCustomers();
  const newCustomer = {
    ...customer,
    id: Date.now().toString(),
    isLocked: false,
    joinDate: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0,
  };
  await saveCustomers([newCustomer, ...existing]);
  return newCustomer;
};

export const updateCustomer = async (customerId, updates) => {
  const existing = await getCustomers();
  const updated = existing.map((c) =>
    c.id === customerId ? { ...c, ...updates } : c
  );
  await saveCustomers(updated);
};

// ─── ALL ORDERS (admin xem) ───────────────────────────────────────────────────
const ALL_ORDERS_KEY = 'ALL_ORDERS_ADMIN';

export const getAllOrdersAdmin = async () => {
  const saved = await get(ALL_ORDERS_KEY, []);
  return saved;
};

export const saveAllOrdersAdmin = async (orders) => {
  await set(ALL_ORDERS_KEY, orders);
};

export const getAllOrders = () => get(KEYS.ALL_ORDERS, []);

// ─── APP CONFIG (admin tùy chỉnh giao diện) ──────────────────────────────────

export const DEFAULT_CONFIG = {
  shopName: 'DaisyDrape',
  primaryColor: '#B8956A',
  secondaryColor: '#D4C4B0',
  backgroundColor: '#F5F1E8',
  bannerImage: 'https://res.cloudinary.com/dhnrlnoee/image/upload/v1777692700/daisy_drape/products/fs3xtezoknggpaysby12.jpg',
  bannerTitle: 'DaisyDrape',
};

export const getAppConfig = async () => {
  const saved = await get(KEYS.APP_CONFIG, null);
  return saved ? { ...DEFAULT_CONFIG, ...saved } : DEFAULT_CONFIG;
};

export const saveAppConfig = (config) => set(KEYS.APP_CONFIG, config);

// ─── VIEWED PRODUCTS (for recommendations) ────────────────────────────────────
export const getViewedProducts = async (userId) => {
  try {
    const viewed = await AsyncStorage.getItem(`VIEWED_${userId}`);
    return viewed ? JSON.parse(viewed) : [];
  } catch (e) {
    return [];
  }
};

export const saveViewedProduct = async (productId, userId) => {
  try {
    const viewed = await getViewedProducts(userId);
    const updated = [productId, ...viewed.filter((id) => id !== productId)].slice(0, 50); // Keep last 50 viewed products
    await AsyncStorage.setItem(`VIEWED_${userId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('saveViewedProduct error:', e);
  }
};

// ─── COLLECTIONS (admin quản lý bộ sưu tập) ────────────────────────────────────
const COLLECTIONS_KEY = 'ALL_COLLECTIONS';

export const getCollections = async () => {
  const saved = await get(COLLECTIONS_KEY, []);
  return saved;
};

export const saveCollections = (collections) => set(COLLECTIONS_KEY, collections);

export const addCollection = async (collection) => {
  const existing = await getCollections();
  const newCollection = {
    ...collection,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  await saveCollections([newCollection, ...existing]);
  return newCollection;
};

export const updateCollection = async (collectionId, updates) => {
  const existing = await getCollections();
  const updated = existing.map((c) =>
    c.id === collectionId ? { ...c, ...updates } : c
  );
  await saveCollections(updated);
};

export const deleteCollection = async (collectionId) => {
  const existing = await getCollections();
  await saveCollections(existing.filter((c) => c.id !== collectionId));
};

// ─── ADMIN PASSWORD RESET ─────────────────────────────────────────────────────
export const resetAdminPassword = async (newPassword) => {
  try {
    const users = await getAllUsers();
    const updated = users.map((u) =>
      u.email === 'admin@daisydrape.com'
        ? { ...u, password: hashPassword(newPassword) }
        : u
    );
    await saveAllUsers(updated);
    return { success: true, message: 'Mật khẩu đã được đặt lại' };
  } catch (error) {
    console.error('resetAdminPassword error:', error);
    return { success: false, message: 'Lỗi khi đặt lại mật khẩu' };
  }
};
