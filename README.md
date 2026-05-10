# 🌼 DaisyDrape - Ứng dụng thời trang hiện đại

DaisyDrape là một ứng dụng di động thương mại điện tử được xây dựng bằng React Native và Expo, cung cấp trải nghiệm mua sắm thời trang sang trọng và tiện lợi.

## ✨ Tính năng chính

### 👥 Quản lý tài khoản
- **Đăng ký & Đăng nhập**: Xác thực người dùng an toàn
- **Hồ sơ cá nhân**: Quản lý thông tin tài khoản
- **Avatar tùy chỉnh**: Upload ảnh đại diện từ thư viện
- **Quản lý địa chỉ**: Thêm và quản lý nhiều địa chỉ giao hàng
- **Phương thức thanh toán**: Lưu và quản lý thẻ thanh toán

### 🛍️ Mua sắm
- **Tìm kiếm sản phẩm**: Tìm kiếm nhanh chóng với kết quả tức thì
- **Danh mục sản phẩm**: Duyệt theo bộ sưu tập
- **Chi tiết sản phẩm**: Xem thông tin chi tiết, giá cả, và đánh giá
- **Giỏ hàng**: Thêm/xóa sản phẩm, quản lý số lượng
- **Yêu thích**: Lưu sản phẩm yêu thích để mua sau

### 💳 Thanh toán & Đơn hàng
- **Checkout**: Quy trình thanh toán đơn giản
- **Lịch sử đơn hàng**: Xem tất cả đơn hàng đã mua
- **Trạng thái đơn hàng**: Theo dõi trạng thái giao hàng
- **Đánh giá sản phẩm**: Để lại đánh giá 5 sao cho sản phẩm

### 🎨 Giao diện
- **Banner Carousel**: Quảng cáo sản phẩm với ảnh tự động chuyển
- **Galaxy Theme**: Thiết kế hiện đại với gradient tối trầm
- **Responsive Design**: Tối ưu cho tất cả kích thước màn hình
- **Dark Mode Support**: Hỗ trợ chế độ tối

### 👨‍💼 Quản lý Admin
- **Dashboard Admin**: Quản lý sản phẩm, đơn hàng, người dùng
- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm
- **Quản lý đơn hàng**: Xem và cập nhật trạng thái đơn hàng
- **Thống kê**: Xem doanh số bán hàng

## 🛠️ Công nghệ sử dụng

- **React Native**: Framework phát triển ứng dụng di động
- **Expo**: Nền tảng phát triển React Native
- **React Navigation**: Điều hướng giữa các màn hình
- **Expo Linear Gradient**: Tạo gradient đẹp
- **Expo Image Picker**: Chọn ảnh từ thư viện
- **Cloudinary**: Lưu trữ và quản lý ảnh trên cloud
- **AsyncStorage**: Lưu trữ dữ liệu cục bộ

## 📁 Cấu trúc dự án

```
daisy-drape-app/
├── screens/              # Các màn hình ứng dụng
│   ├── HomeScreen.js
│   ├── ProfileScreen.js
│   ├── CartScreen.js
│   ├── WishlistScreen.js
│   ├── ProductDetailScreen.js
│   ├── CheckoutScreen.js
│   ├── LoginScreen.js
│   └── admin/           # Màn hình admin
├── components/          # Các component tái sử dụng
├── services/            # Các dịch vụ (API, storage)
├── context/             # React Context
├── constants/           # Hằng số (theme, colors)
├── data/                # Dữ liệu mẫu
├── App.js              # Component chính
└── package.json        # Dependencies
```

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js (v14 hoặc cao hơn)
- npm hoặc yarn
- Expo CLI

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd daisy-drape-app
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Chạy ứng dụng
```bash
npm start
# hoặc
expo start
```

### Bước 4: Mở trên thiết bị
- **iOS**: Nhấn `i` để mở trên iOS Simulator
- **Android**: Nhấn `a` để mở trên Android Emulator
- **Mobile**: Quét QR code bằng Expo Go app

## 🎨 Giao diện & Thiết kế

### Màu sắc chính
- **Primary**: `#B8956A` (Nâu)
- **Secondary**: `#D4C4B0` (Beige)
- **Background**: `#F5F1E8` (Kem)
- **Dark**: `#1a1a2e` (Tối trầm)

### Font & Typography
- **Tiêu đề**: Bold, 18-28px
- **Nội dung**: Regular, 12-16px
- **Nhấn mạnh**: Semi-bold, 13-14px

## 📱 Các màn hình chính

### 1. Home Screen
- Banner carousel với 3 ảnh
- Section "Về DaisyDrape" (Galaxy theme)
- Sản phẩm mới
- Bộ sưu tập nổi bật
- Tất cả sản phẩm
- <img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/032481a4-a10d-41c9-958a-3e557e17f885" />

- <img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/3c43fe13-51ad-4d4c-bb13-4d167c40dc5c" />

<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/4bba0ddb-f2b1-4706-a02e-295a7c7da13c" />

### 2. Product Detail Screen
- Ảnh sản phẩm
- Thông tin chi tiết
- Giá cả
- Nút thêm vào giỏ/yêu thích

### 3. Cart Screen
- Danh sách sản phẩm trong giỏ
- Tính tổng giá
- Nút thanh toán
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/8f598585-9c75-419f-ad0f-1e4802127bc4" />

### 4. Profile Screen
- Thông tin tài khoản
- Avatar tùy chỉnh
- Tab: Thông tin, Địa chỉ, Thanh toán, Đơn hàng
- Lịch sử đơn hàng
- Đánh giá sản phẩm
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/f86ddafc-0e1d-4e4a-aa5f-434b63028e5b" />
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/391de8f6-9dbb-433e-9293-2539c2c0b2d9" />
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/c30591d6-a5c5-4dee-a85d-f62128ef3ccf" />
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/8812424d-dca7-47d3-87c5-0aba2e87bf27" />

### 5. Wishlist Screen
- Danh sách sản phẩm yêu thích
- Xóa khỏi yêu thích
- Thêm vào giỏ hàng

## 🔐 Bảo mật
- Mật khẩu được mã hóa
- Xác thực người dùng
- Dữ liệu cục bộ được lưu an toàn

