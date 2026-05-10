# Navigation Fix Summary - Address & Payment Method Screens

## Problem
Khi nhấn vào "Địa chỉ giao hàng" hoặc "Phương thức thanh toán" ở ProfileScreen, ứng dụng không navigate đến các modal screens.

## Root Cause
ProfileScreen nằm trong `BuyerTabs` (Tab.Navigator), nhưng cần navigate đến các modal screens được định nghĩa trong `BuyerStack` (Stack.Navigator). 

Cấu trúc navigation:
```
BuyerStack (Stack.Navigator)
├── BuyerTabs (Tab.Navigator)
│   ├── HomeTab
│   ├── Wishlist
│   ├── Cart
│   └── Profile (ProfileScreen)
├── AccountManagement (Modal)
├── AddressScreen (Modal)
└── PaymentMethodScreen (Modal)
```

ProfileScreen không nhận được `navigation` prop từ Tab.Navigator, nên không thể gọi `navigation.navigate()`.

## Solution
1. **Import `useNavigation` hook** từ `@react-navigation/native`
2. **Sử dụng hook trong ProfileScreen** để lấy navigation object
3. **Truyền props từ BuyerTabs** để ProfileScreen nhận được navigation

### Changes Made

#### 1. screens/ProfileScreen.js
```javascript
// Thêm import
import { useNavigation } from '@react-navigation/native';

// Trong component
export default function ProfileScreen({ user, onLogout, navigation: navigationProp }) {
  const { config } = useAppConfig();
  const navigationHook = useNavigation();
  // Sử dụng navigation từ prop nếu có, nếu không thì dùng hook
  const navigation = navigationProp || navigationHook;
  // ... rest of code
}
```

#### 2. App.js - BuyerTabs
```javascript
// Truyền props từ Tab.Screen
<Tab.Screen name="Profile" options={{ tabBarLabel: 'Hồ sơ' }}>
  {(props) => <ProfileScreen {...props} user={user} onLogout={onLogout} />}
</Tab.Screen>
```

## How It Works
1. `useNavigation()` hook cung cấp navigation object từ parent Stack.Navigator
2. ProfileScreen có thể gọi `navigation.navigate('AddressScreen')` để mở modal
3. Modal screens được định nghĩa trong BuyerStack sẽ được hiển thị

## Testing
- Tất cả tests vẫn pass (51 passed)
- Không có syntax errors
- Navigation structure được xác nhận

## Result
✅ Người dùng có thể nhấn vào "Địa chỉ giao hàng" và "Phương thức thanh toán" để mở các modal screens
✅ Dữ liệu được lưu trữ và tải lại khi quay lại
✅ Dark mode support vẫn hoạt động bình thường
