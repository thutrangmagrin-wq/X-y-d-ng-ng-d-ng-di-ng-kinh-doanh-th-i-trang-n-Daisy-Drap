# Hình 1.5. Sơ đồ các chức năng chính của ứng dụng DaisyDrape

## Sơ đồ tổng quát

```
                    ┌─────────────────────────────────────┐
                    │   ỨNG DỤNG DAISYDRAPE              │
                    │   (Thương mại điện tử thời trang)   │
                    └────────────────┬────────────────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
        ┌──────────────┐      ┌──────────────┐    ┌──────────────┐
        │  QUẢN LÝ     │      │  MUA SẮM     │    │  QUẢN LÝ     │
        │  TÀI KHOẢN   │      │  SẢN PHẨM    │    │  ĐƠN HÀNG    │
        └──────┬───────┘      └──────┬───────┘    └──────┬───────┘
               │                     │                    │
        ┌──────┴──────┐       ┌──────┴──────┐     ┌──────┴──────┐
        │              │       │              │     │              │
        ▼              ▼       ▼              ▼     ▼              ▼
    ┌────────┐   ┌────────┐ ┌────────┐  ┌────────┐┌────────┐  ┌────────┐
    │ Đăng   │   │ Hồ sơ  │ │ Tìm    │  │ Xem    ││ Giỏ    │  │ Lịch   │
    │ ký/    │   │ cá     │ │ kiếm   │  │ chi    ││ hàng   │  │ sử     │
    │ Đăng   │   │ nhân   │ │ sản    │  │ tiết   ││        │  │ đơn    │
    │ nhập   │   │        │ │ phẩm   │  │ sản    ││        │  │ hàng   │
    └────────┘   └────────┘ │        │  │ phẩm   │└────────┘  └────────┘
                            └────────┘  └────────┘
                                 │
                            ┌────┴────┐
                            │          │
                            ▼          ▼
                        ┌────────┐  ┌────────┐
                        │ Yêu    │  │ Thêm   │
                        │ thích  │  │ vào    │
                        │        │  │ giỏ    │
                        └────────┘  └────┬───┘
                                         │
                                         ▼
                                    ┌────────────┐
                                    │ Thanh toán │
                                    │ (Checkout) │
                                    └────────────┘
```

## Chi tiết các chức năng

### 1. QUẢN LÝ TÀI KHOẢN

```
┌─────────────────────────────────────┐
│      QUẢN LÝ TÀI KHOẢN              │
├─────────────────────────────────────┤
│                                     │
│  ├─ Đăng ký tài khoản              │
│  │  └─ Nhập thông tin cá nhân      │
│  │  └─ Xác thực email              │
│  │                                  │
│  ├─ Đăng nhập                       │
│  │  └─ Nhập email/password         │
│  │  └─ Xác thực thông tin          │
│  │                                  │
│  ├─ Hồ sơ cá nhân                   │
│  │  ├─ Xem/chỉnh sửa thông tin     │
│  │  ├─ Upload avatar               │
│  │  ├─ Quản lý địa chỉ giao hàng   │
│  │  └─ Quản lý phương thức thanh   │
│  │     toán                         │
│  │                                  │
│  └─ Đăng xuất                       │
│                                     │
└─────────────────────────────────────┘
```

### 2. MUA SẮM SẢN PHẨM

```
┌─────────────────────────────────────┐
│      MUA SẮM SẢN PHẨM               │
├─────────────────────────────────────┤
│                                     │
│  ├─ Trang chủ                       │
│  │  ├─ Banner carousel              │
│  │  ├─ Bộ sưu tập nổi bật          │
│  │  └─ Sản phẩm mới                 │
│  │                                  │
│  ├─ Tìm kiếm sản phẩm               │
│  │  ├─ Tìm theo tên                 │
│  │  ├─ Lọc kết quả                  │
│  │  └─ Hiển thị kết quả             │
│  │                                  │
│  ├─ Xem chi tiết sản phẩm           │
│  │  ├─ Ảnh sản phẩm                 │
│  │  ├─ Thông tin chi tiết           │
│  │  ├─ Giá tiền                     │
│  │  ├─ Đánh giá từ người dùng       │
│  │  └─ Nút thêm vào giỏ/yêu thích   │
│  │                                  │
│  ├─ Yêu thích sản phẩm              │
│  │  ├─ Lưu sản phẩm yêu thích       │
│  │  ├─ Xem danh sách yêu thích      │
│  │  └─ Xóa khỏi yêu thích           │
│  │                                  │
│  └─ Thêm vào giỏ hàng               │
│     ├─ Chọn số lượng                │
│     └─ Lưu vào giỏ                  │
│                                     │
└─────────────────────────────────────┘
```

### 3. QUẢN LÝ ĐƠN HÀNG

```
┌─────────────────────────────────────┐
│      QUẢN LÝ ĐƠN HÀNG               │
├─────────────────────────────────────┤
│                                     │
│  ├─ Giỏ hàng                        │
│  │  ├─ Xem danh sách sản phẩm       │
│  │  ├─ Cập nhật số lượng            │
│  │  ├─ Xóa sản phẩm                 │
│  │  └─ Tính tổng giá tiền           │
│  │                                  │
│  ├─ Thanh toán                      │
│  │  ├─ Chọn địa chỉ giao hàng       │
│  │  ├─ Chọn phương thức thanh toán  │
│  │  ├─ Xem tóm tắt đơn hàng         │
│  │  └─ Xác nhận thanh toán          │
│  │                                  │
│  ├─ Lịch sử đơn hàng                │
│  │  ├─ Xem danh sách đơn hàng       │
│  │  ├─ Xem chi tiết đơn hàng        │
│  │  ├─ Theo dõi trạng thái          │
│  │  └─ Đánh giá sản phẩm            │
│  │                                  │
│  └─ Trạng thái đơn hàng             │
│     ├─ Chờ xử lý                    │
│     ├─ Đang xử lý                   │
│     ├─ Đã gửi                       │
│     ├─ Đã giao                      │
│     └─ Hoàn thành                   │
│                                     │
└─────────────────────────────────────┘
```

## Sơ đồ luồng dữ liệu

```
                    ┌──────────────────┐
                    │   Người dùng     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  React Native    │
                    │  Application     │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌────────┐          ┌────────┐          ┌────────┐
    │Screens │          │Context │          │Services│
    │        │          │        │          │        │
    │ Home   │◄────────►│AppConfig           │Storage │
    │ Cart   │          │        │          │Service │
    │Profile │          └────────┘          └────┬───┘
    │ etc.   │                                   │
    └────────┘                                   ▼
                                          ┌────────────┐
                                          │AsyncStorage│
                                          │  (Local DB)│
                                          └────────────┘
```

## Bảng tóm tắt chức năng

| Chức năng | Mô tả | Dữ liệu |
|-----------|-------|---------|
| **Đăng ký/Đăng nhập** | Xác thực người dùng | Email, Password |
| **Hồ sơ cá nhân** | Quản lý thông tin | Tên, Email, Số ĐT, Avatar |
| **Tìm kiếm** | Tìm sản phẩm theo tên | Tên sản phẩm |
| **Chi tiết sản phẩm** | Xem thông tin chi tiết | Ảnh, Giá, Mô tả, Đánh giá |
| **Yêu thích** | Lưu sản phẩm yêu thích | ID sản phẩm |
| **Giỏ hàng** | Quản lý sản phẩm mua | Sản phẩm, Số lượng, Giá |
| **Thanh toán** | Tạo đơn hàng | Địa chỉ, Phương thức TT |
| **Lịch sử đơn hàng** | Xem đơn hàng đã mua | Đơn hàng, Trạng thái |
| **Đánh giá** | Đánh giá sản phẩm | Sao, Bình luận |

---

**Kết luận**: Ứng dụng DaisyDrape cung cấp các chức năng hoàn chỉnh cho trải nghiệm mua sắm trực tuyến, từ tìm kiếm sản phẩm, quản lý giỏ hàng, thanh toán đến quản lý đơn hàng.
