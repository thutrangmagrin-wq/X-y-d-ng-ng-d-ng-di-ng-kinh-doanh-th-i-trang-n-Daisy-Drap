# MÔ HÌNH HOẠT ĐỘNG CỦA ỨNG DỤNG DAISYDRAPE

## 1. Luồng hoạt động chính

```
┌─────────────────────────────────────────────────────────────┐
│                    NGƯỜI DÙNG MỚI                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Đăng ký / Đăng│
            │     nhập       │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │   Trang chủ    │
            │  (HomeScreen)  │
            └────────┬───────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    ┌────────┐  ┌────────┐  ┌──────────┐
    │ Tìm    │  │ Xem    │  │ Yêu      │
    │ kiếm   │  │ chi    │  │ thích    │
    │        │  │ tiết   │  │          │
    └────┬───┘  └───┬────┘  └────┬─────┘
         │          │            │
         └──────────┼────────────┘
                    │
                    ▼
            ┌────────────────┐
            │  Thêm vào      │
            │  giỏ hàng      │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │  Giỏ hàng      │
            │ (CartScreen)   │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │  Thanh toán    │
            │(CheckoutScreen)│
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │  Tạo đơn hàng  │
            │  (Order)       │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │  Hồ sơ cá nhân │
            │(ProfileScreen) │
            │ Xem đơn hàng   │
            └────────────────┘
```

## 2. Quy trình mua sắm

### Bước 1: Đăng nhập
- Người dùng nhập email/password
- Hệ thống xác thực thông tin
- Lưu session người dùng

### Bước 2: Duyệt sản phẩm
- Xem trang chủ (banner, bộ sưu tập, sản phẩm)
- Tìm kiếm sản phẩm theo tên
- Xem chi tiết sản phẩm

### Bước 3: Thêm vào giỏ
- Chọn sản phẩm
- Chọn số lượng
- Thêm vào giỏ hàng
- Lưu vào AsyncStorage

### Bước 4: Thanh toán
- Xem giỏ hàng
- Chọn địa chỉ giao hàng
- Chọn phương thức thanh toán
- Xác nhận đơn hàng

### Bước 5: Quản lý đơn hàng
- Xem lịch sử đơn hàng
- Theo dõi trạng thái
- Đánh giá sản phẩm

## 3. Kiến trúc dữ liệu

```
┌──────────────────────────────────────┐
│         AsyncStorage (Local)         │
├──────────────────────────────────────┤
│ • User (email, password, profile)    │
│ • Cart (products, quantities)        │
│ • Wishlist (favorite products)       │
│ • Orders (order history)             │
│ • Addresses (delivery addresses)     │
│ • Payments (payment methods)         │
└──────────────────────────────────────┘
```

## 4. Luồng dữ liệu

```
┌─────────────────────────────────────────────────────────┐
│                   React Native App                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐         ┌──────────────┐            │
│  │   Screens    │◄───────►│   Context    │            │
│  │              │         │  (AppConfig) │            │
│  └──────┬───────┘         └──────────────┘            │
│         │                                              │
│         ▼                                              │
│  ┌──────────────┐         ┌──────────────┐            │
│  │ Components   │◄───────►│   Services   │            │
│  │              │         │ (Storage)    │            │
│  └──────────────┘         └──────┬───────┘            │
│                                  │                     │
│                                  ▼                     │
│                          ┌──────────────┐             │
│                          │ AsyncStorage │             │
│                          │   (Local DB) │             │
│                          └──────────────┘             │
│                                                       │
└─────────────────────────────────────────────────────────┘
```

## 5. Các chức năng chính

| Chức năng | Màn hình | Hành động |
|-----------|----------|----------|
| Đăng nhập | LoginScreen | Xác thực email/password |
| Duyệt sản phẩm | HomeScreen | Xem banner, bộ sưu tập, sản phẩm |
| Tìm kiếm | HomeScreen | Lọc sản phẩm theo tên |
| Chi tiết sản phẩm | ProductDetailScreen | Xem thông tin, giá, hình ảnh |
| Giỏ hàng | CartScreen | Quản lý sản phẩm, tính tổng |
| Thanh toán | CheckoutScreen | Chọn địa chỉ, phương thức thanh toán |
| Hồ sơ | ProfileScreen | Quản lý thông tin, đơn hàng, địa chỉ |
| Yêu thích | WishlistScreen | Lưu sản phẩm yêu thích |

## 6. Trạng thái đơn hàng

```
Pending (Chờ xử lý)
    ▼
Processing (Đang xử lý)
    ▼
Shipped (Đã gửi)
    ▼
Delivered (Đã giao)
    ▼
Completed (Hoàn thành)
```

## 7. Bảo mật

- Mật khẩu được mã hóa
- Xác thực người dùng qua email/password
- Dữ liệu lưu cục bộ an toàn
- Không lưu thông tin thanh toán nhạy cảm

---

**Tóm tắt**: Ứng dụng hoạt động theo mô hình client-side, lưu trữ dữ liệu cục bộ, cho phép người dùng duyệt, tìm kiếm, mua sắm và quản lý đơn hàng một cách tiện lợi.
