# DaisyDrape Backend API

Backend API cho ứng dụng thương mại điện tử DaisyDrape, được xây dựng bằng Node.js và Express.

## Cài Đặt

### Yêu Cầu
- Node.js >= 14
- npm hoặc yarn

### Bước Cài Đặt

1. Clone dự án
```bash
git clone <repository-url>
cd DaisyDrape/backend
```

2. Cài đặt dependencies
```bash
npm install
```

3. Tạo file .env
```bash
cp .env.example .env
```

4. Cấu hình biến môi trường trong file .env

## Chạy Server

### Chế độ phát triển
```bash
npm run dev
```

### Chế độ production
```bash
npm start
```

Server sẽ chạy trên `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify` - Xác thực token

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (admin)

### Orders
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng (admin)
- `GET /api/orders/stats/summary` - Lấy thống kê đơn hàng (admin)

### Users
- `GET /api/users` - Lấy danh sách người dùng (admin)
- `GET /api/users/:id` - Lấy thông tin người dùng
- `PUT /api/users/:id` - Cập nhật thông tin người dùng
- `GET /api/users/stats/summary` - Lấy thống kê người dùng (admin)

### Reviews
- `POST /api/reviews` - Tạo đánh giá mới
- `GET /api/reviews` - Lấy danh sách tất cả đánh giá (admin)
- `GET /api/reviews/product/:productId` - Lấy đánh giá của sản phẩm
- `DELETE /api/reviews/:id` - Xóa đánh giá

## Cấu Trúc Dự Án

```
backend/
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
│   └── reviewRoutes.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Tính Năng

- Xác thực người dùng với JWT
- Quản lý sản phẩm (CRUD)
- Quản lý đơn hàng
- Hệ thống đánh giá sản phẩm
- Thống kê doanh số cho admin
- Tìm kiếm và lọc sản phẩm
- Xác thực và phân quyền

## Phát Triển Tương Lai

- Tích hợp MongoDB
- Triển khai xác thực hai yếu tố
- Thêm thanh toán trực tuyến
- Triển khai cache Redis
- Thêm logging và monitoring
- Triển khai Docker

## License

ISC
