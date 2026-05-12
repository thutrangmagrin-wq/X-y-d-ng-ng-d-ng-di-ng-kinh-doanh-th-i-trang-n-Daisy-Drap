import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import WishlistScreen from './screens/WishlistScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AddressesScreen from './screens/AddressesScreen';
import OrdersHistoryScreen from './screens/OrdersHistoryScreen';
import PaymentMethodsScreen from './screens/PaymentMethodsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import RatingScreen from './screens/RatingScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';

import { getUser } from './services/storageService';
import { COLORS } from './constants/theme';
import { AppConfigProvider, useAppConfig } from './context/AppConfigContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CartStack = ({ user, navigation }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartMain" options={{ headerShown: false }}>
      {(props) => <CartScreen user={user} navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="Checkout" options={{ headerShown: false }}>
      {(props) => <CheckoutScreen user={user} navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="Addresses" options={{ headerShown: false }}>
      {(props) => <AddressesScreen navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="PaymentMethods" options={{ headerShown: false }}>
      {(props) => <PaymentMethodsScreen navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="OrdersHistory" options={{ headerShown: false }}>
      {(props) => <OrdersHistoryScreen navigation={props.navigation} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const HomeStack = ({ user }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" options={{ headerShown: false }}>
      {(props) => <HomeScreen user={user} navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="ProductDetail" options={{ headerShown: false }}>
      {(props) => <ProductDetailScreen navigation={props.navigation} user={user} route={props.route} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const ProfileStack = ({ onLogout, navigation }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" options={{ headerShown: false }}>
      {(props) => <ProfileScreen onLogout={onLogout} navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="EditProfile" options={{ headerShown: false }}>
      {(props) => <EditProfileScreen navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="Addresses" options={{ headerShown: false }}>
      {(props) => <AddressesScreen navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="PaymentMethods" options={{ headerShown: false }}>
      {(props) => <PaymentMethodsScreen navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="OrdersHistory" options={{ headerShown: false }}>
      {(props) => <OrdersHistoryScreen navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="Rating" options={{ headerShown: false }}>
      {(props) => <RatingScreen navigation={props.navigation} route={props.route} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const BuyerTabs = ({ user, onLogout }) => {
  const { config } = useAppConfig();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          display: 'none', // Ẩn tab bar
        },
      })}
    >
      <Tab.Screen name="HomeStack" options={{ tabBarLabel: 'Trang chủ' }}>
        {(props) => <HomeStack user={user} navigation={props.navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Wishlist" options={{ tabBarLabel: 'Yêu thích' }}>
        {(props) => <WishlistScreen user={user} navigation={props.navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Cart" options={{ tabBarLabel: 'Giỏ hàng' }}>
        {(props) => <CartStack user={user} navigation={props.navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ tabBarLabel: 'Hồ sơ' }}>
        {(props) => <ProfileStack onLogout={onLogout} navigation={props.navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AuthStack = ({ onLoginSuccess }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" options={{ headerShown: false }}>
      {(props) => <LoginScreen onLoginSuccess={onLoginSuccess} navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="Register" options={{ headerShown: false }}>
      {(props) => <RegisterScreen onLoginSuccess={onLoginSuccess} navigation={props.navigation} />}
    </Stack.Screen>
    <Stack.Screen name="ForgotPassword" options={{ headerShown: false }}>
      {(props) => <ForgotPasswordScreen navigation={props.navigation} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const RootNavigator = ({ user, onLogout, onLoginSuccess }) => (
  <NavigationContainer>
    {!user ? (
      <AuthStack onLoginSuccess={onLoginSuccess} />
    ) : user.role === 'admin' ? (
      <AdminDashboardScreen user={user} onLogout={() => onLogout()} />
    ) : (
      <BuyerTabs user={user} onLogout={onLogout} />
    )}
  </NavigationContainer>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // ⚠️ ONLY UNCOMMENT IF YOU WANT TO CLEAR ALL DATA (including products)
        // await AsyncStorage.clear();
        // console.log('✅ AsyncStorage cleared');
        
        const u = await getUser();
        setUser(u);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <AppConfigProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RootNavigator user={user} onLogout={() => setUser(null)} onLoginSuccess={(u) => setUser(u)} />
      </SafeAreaProvider>
    </AppConfigProvider>
  );
}
