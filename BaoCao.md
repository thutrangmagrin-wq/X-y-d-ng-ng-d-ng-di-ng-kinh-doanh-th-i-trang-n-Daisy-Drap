# BÁO CÁO CHUYÊN ĐỀ HỌC PHẦN LẬP TRÌNH TRÊN THIẾT BỊ DI ĐỘNG

## ĐỀ TÀI: APP THƯƠNG MỤC ĐIỆN TỬ DAISYDRAPE

---

### Sinh viên thực hiện: [HỌ VÀ TÊN] – [MÃ SV]

### Giảng viên hướng dẫn: [TÊN GIẢNG VIÊN]

### Ngành: CÔNG NGHỆ THÔNG TIN

### Chuyên ngành: CÔNG NGHỆ PHẦN MỀM

### Lớp: [LỚP]

### Khóa: 2019-2024

---

**Hà Nội, tháng 05 năm 2026**

---

## MỤC LỤC

1. LỜI CẢM ƠN
2. LỜI MỞ ĐẦU
3. CHƯƠNG 1. KHẢO SÁT VÀ TỔNG QUAN ĐỀ TÀI
4. CHƯƠNG 2. THIẾT KẾ CẤU TRÚC HỆ THỐNG
5. CHƯƠNG 3. THIẾT KẾ GIAO DIỆN
6. KẾT LUẬN

---

## LỜI CẢM ƠN

Trên thực tế, không có sự thành công nào mà không gắn liền với những sự hỗ trợ, sự giúp đỡ dù ít hay nhiều, dù là trực tiếp hay gián tiếp của người khác. Trong suốt thời gian từ khi bắt đầu học tập ở giảng đường Đại học đã đến nay, em đã nhận được rất nhiều sự quan tâm, giúp đỡ của thầy cô, gia đình và bạn bè.

Với lòng biết ơn sâu sắc nhất, em xin gửi đến thầy cô ở Khoa Công Nghệ Thông Tin - trường Đại Học Điện Lực đã cùng với tri thức và tâm huyết của mình để truyền đạt vốn kiến thức quý báu cho chúng em trong suốt thời gian học tập tại trường. Và đặc biệt, trong kỳ này, em được tiếp cận với môn học rất hữu ích đối với sinh viên ngành Công Nghệ Thông Tin. Đó là môn: "Lập trình trên thiết bị di động".

Em xin chân thành cảm ơn thầy cô đã tận tâm hướng dẫn chúng em qua từng buổi học trên lớp cũng như những buổi nói chuyện, thảo luận về môn học. Trong thời gian được học tập và thực hành dưới sự hướng dẫn của thầy cô, em không những thu được rất nhiều kiến thức bổ ích, mà còn được truyền sự say mê và thích thú đối với bộ môn "Lập trình trên thiết bị di động". Nếu không có những lời hướng dẫn, dạy bảo của thầy cô thì em nghĩ báo cáo này rất khó có thể hoàn thành được.

Xin gửi lời cảm ơn chân thành đến gia đình, bạn bè là nguồn động viên to lớn, giúp em vượt qua những khó khăn trong quá trình học tập và thực hiện báo cáo.

Mặc dù đã rất cố gắng hoàn thiện báo cáo với tất cả sự nỗ lực, tuy nhiên, do bước đầu đi vào thực tế, tìm hiểu và xây dựng báo cáo trong thời gian có hạn, và kiến thức còn hạn chế, nhiều bỡ ngỡ, nên báo cáo "Lập trình trên thiết bị di động" về xây dựng "App thương mục điện tử DaisyDrape" chắc chắn sẽ không thể tránh khỏi những thiếu sót. Em rất mong nhận được sự quan tâm, thông cảm và những đóng góp quý báu của các thầy cô và các bạn để báo cáo này được hoàn thiện hơn.

Một lần nữa, em xin chân thành cảm ơn và luôn mong nhận được sự đóng góp của mọi người.

**Trân trọng!**

---

## LỜI MỞ ĐẦU

Ngày nay, ứng dụng công nghệ thông tin và việc tin học hóa được xem là một trong những yếu tố mang tính quyết định trong hoạt động của các chính phủ, tổ chức, cũng như của các công ty, nó đóng vai trò hết sức quan trọng, có thể tạo ra những bước đột phá mạnh mẽ.

Cùng với sự phát triển không ngừng về kỹ thuật máy tính và mạng điện tử, công nghệ thông tin cũng được những công nghệ có đẳng cấp cao và lần lượt chinh phục hết đỉnh cao này đến đỉnh cao khác. Mạng Internet là một trong những sản phẩm có giá trị hết sức lớn lao và ngày càng trở nên một công cụ không thể thiếu, là nền tảng chính cho sự truyền tải, trao đổi thông tin trên toàn cầu.

Sự phát triển và lan tỏa mạnh mẽ của Internet đã len lỏi vào trong các hoạt động sản xuất, kinh doanh, giờ đây, người dùng có thể truy cập vào các trang thương mại điện tử để thực hiện mua bán trao đổi một cách dễ dàng, tiện lợi, hay chỉ đơn giản là để cập nhật tin tức thông qua các trang báo mạng, mua sắm thời trang sau những giờ làm việc căng thẳng.

Vậy nếu như chúng ta có mong muốn cung cấp những thông tin hữu ích, những trải nghiệm, kinh nghiệm quý báu trong cuộc sống cho người khác thông qua Internet, thì phải làm thế nào? Có vô vàn những cách khác nhau như bình luận trên mạng xã hội, gửi thư điện tử v.v… Nhưng có một cách còn thú vị hơn thế, giúp cho chúng ta thỏa sức sáng tạo nên những điều mới mẻ, đó chính là xây dựng một app trên thiết bị di động, ta có thể thoải mái chia sẻ những điều thú vị, tạo nên những nội dung độc đáo của chính bản thân chúng ta trên đó.

---

## CHƯƠNG 1. KHẢO SÁT VÀ TỔNG QUAN ĐỀ TÀI

### 1.1 Khảo sát

Xã hội ngày càng phát triển, khoa học kỹ thuật ngày càng hiện đại, công nghệ 4.0 ngày càng thay đổi cuộc sống chúng ta. Vì vậy, chiếc điện thoại di động thông minh ngày càng trở nên quan trọng hơn với chúng ta. Chiếc điện thoại di động thông minh giúp chúng ta làm việc, học tập, giải trí như là mua sắm, chơi game hay xem phim.

Sống ở thời công nghệ 4.0, việc tiếp cận với internet hiện nay không còn mấy xa lạ với con người được trở thành phương tiện truyền thông được nhiều người sử dụng nhất trên thế giới.

Ở Việt Nam cũng có rất nhiều trang web/app thương mại điện tử bán hàng online với đa dạng. Tuy nhiên không phải app nào cũng thực sự tốt và phù hợp với nhu cầu người sử dụng. Đã có hiện tượng xuất hiện tràn lan các app thương mại điện tử nhưng thực chất là những app quảng cáo rẻ tiền, kiếm tiền bằng các lượt tải của người dùng. Vì vậy, cần loại bỏ các app quảng cáo rẻ tiền và đầu tư những app thực sự phù hợp với nhu cầu mua sắm cũng như giải trí của người dùng.

### 1.2 Tổng quan đề tài

Trong cuộc sống hiện đại, mua sắm trực tuyến đã trở thành một phần không thể thiếu. Người tiêu dùng ngày càng tìm kiếm những ứng dụng thương mại điện tử tiện lợi, an toàn và có giao diện thân thiện. Tuy nhiên, cuộc sống ngày càng phát triển, những cửa hàng truyền thống dần dần bị thay thế bởi những app mua sắm trực tuyến trên điện thoại.

Với một chiếc điện thoại nhỏ gọn, chúng ta hoàn toàn có thể mua sắm, thanh toán hay đặc biệt là tìm kiếm những sản phẩm thời trang mà không cần cầm theo bất kể cái gì khác. Nắm bắt được tình hình trên, nhóm em tiến hành thiết kế app thương mại điện tử DaisyDrape để giúp cho người dùng có thể mua sắm nhanh hơn, thuận tiện hơn, với giao diện hiện đại và sang trọng.

### 1.3 Một số trang chính của App

- **Trang chủ**: Đây là nơi giới thiệu tên app, những sản phẩm nổi bật, thông tin về các bộ sưu tập, banner quảng cáo...

- **Trang chi tiết sản phẩm**: Đây là trang người dùng xem thông tin chi tiết, giá cả, hình ảnh của sản phẩm mà mình lựa chọn

- **Trang tìm kiếm**: Đây là nơi người dùng có thể tìm kiếm những sản phẩm mà mình yêu thích, muốn mua

- **Trang giỏ hàng**: Nơi quản lý các sản phẩm đã thêm vào giỏ, tính tổng giá tiền

- **Trang hồ sơ cá nhân**: Quản lý thông tin tài khoản, địa chỉ giao hàng, phương thức thanh toán, lịch sử đơn hàng

- **Trang yêu thích**: Lưu trữ những sản phẩm mà người dùng yêu thích để mua sau

---

## CHƯƠNG 2. THIẾT KẾ CẤU TRÚC HỆ THỐNG

### 2.1 Mô tả bài toán

Khi người dùng đã quyết định muốn vào App để mua sắm, thì mỗi người dùng được yêu cầu có một tài khoản dùng để định danh và đăng nhập vào App. Người dùng đăng ký tài khoản của mình bằng cách nhập thông tin chi tiết người dùng như họ tên, địa chỉ email, số điện thoại, username, password,... Để đăng nhập vào App, người dùng nhập email và password vừa đăng ký và nhấn vào "Đăng nhập" để mua sắm.

Sau khi đăng nhập, người dùng có thể:
- Duyệt các sản phẩm trên trang chủ
- Tìm kiếm sản phẩm theo tên
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng hoặc yêu thích
- Quản lý giỏ hàng
- Thanh toán và tạo đơn hàng
- Xem lịch sử đơn hàng
- Đánh giá sản phẩm

### 2.2 Yêu cầu về chức năng

Người dùng có nhu cầu mua sắm thời trang, hơn nữa là muốn tìm những sản phẩm mà mình yêu thích. Vì thế, App thương mại điện tử DaisyDrape cần phải thỏa mãn các chức năng sau:

- **Bảo mật an toàn thông tin cá nhân**: Mã hóa mật khẩu, xác thực người dùng
- **Tìm kiếm sản phẩm**: Tìm kiếm nhanh chóng theo tên sản phẩm
- **Lưu trữ danh sách yêu thích**: Lưu những sản phẩm mình yêu thích để có thể mua sau
- **Quản lý giỏ hàng**: Thêm, xóa, cập nhật số lượng sản phẩm
- **Thanh toán**: Hỗ trợ nhiều phương thức thanh toán
- **Quản lý đơn hàng**: Xem lịch sử đơn hàng, trạng thái giao hàng
- **Đánh giá sản phẩm**: Để lại đánh giá 5 sao cho sản phẩm đã mua
- **Quản lý hồ sơ**: Cập nhật thông tin cá nhân, địa chỉ giao hàng

### 2.3 Kiến trúc hệ thống

```
DaisyDrape App
├── Frontend (React Native)
│   ├── Screens
│   │   ├── HomeScreen
│   │   ├── ProductDetailScreen
│   │   ├── CartScreen
│   │   ├── WishlistScreen
│   │   ├── ProfileScreen
│   │   ├── LoginScreen
│   │   ├── CheckoutScreen
│   │   └── AdminDashboardScreen
│   ├── Components
│   ├── Navigation
│   └── Context
├── Services
│   ├── storageService (AsyncStorage)
│   └── cloudinaryService (Image Upload)
├── Constants
│   └── theme.js (Colors, Styles)
└── Data
    └── products.js (Sample Data)
```

### 2.4 Cơ chế tính toán và hiển thị Admin

#### 2.4.1 Cơ chế lưu trữ dữ liệu

Tất cả dữ liệu được lưu trữ cục bộ bằng AsyncStorage với các key chính:
- **USER**: Thông tin người dùng hiện tại
- **CART**: Giỏ hàng của người dùng
- **WISHLIST**: Danh sách yêu thích
- **ORDERS**: Lịch sử đơn hàng
- **REVIEWS**: Đánh giá sản phẩm từ người dùng
- **APP_CONFIG**: Cấu hình ứng dụng (màu sắc, theme)

#### 2.4.2 Cơ chế tính toán doanh số

**Tính tổng doanh thu:**
```
Tổng doanh thu = Σ(Đơn hàng.totalPrice) cho tất cả đơn hàng
```

**Tính doanh thu theo ngày:**
```
Doanh thu ngày X = Σ(Đơn hàng.totalPrice) 
                   cho tất cả đơn hàng có createdAt = ngày X
```

**Tính sản phẩm bán chạy nhất:**
```
Số lượng bán = Σ(Đơn hàng.items[i].quantity) 
              cho tất cả đơn hàng chứa sản phẩm đó
Sắp xếp theo số lượng bán giảm dần
```

**Tính rating trung bình sản phẩm:**
```
Rating trung bình = Σ(Review.rating) / Số lượng review
                   cho tất cả review của sản phẩm đó
```

#### 2.4.3 Cơ chế hiển thị Admin Dashboard

**Tab Thống kê:**
- **Tổng số đơn hàng**: Đếm tất cả đơn hàng trong ORDERS
- **Tổng doanh thu**: Cộng tất cả totalPrice từ ORDERS
- **Số khách hàng mới**: Đếm người dùng được tạo trong 30 ngày gần nhất
- **Sản phẩm bán chạy nhất**: Top 5 sản phẩm có số lượng bán cao nhất
- **Biểu đồ doanh số**: Hiển thị doanh thu theo từng ngày trong 7 ngày gần nhất

**Tab Đơn hàng:**
- Hiển thị danh sách tất cả đơn hàng từ ORDERS
- Sắp xếp theo ngày tạo (mới nhất trước)
- Cho phép lọc theo trạng thái: Chờ xử lý, Đang xử lý, Đã gửi, Đã giao, Đã hủy
- Hiển thị thông tin: Mã đơn, Khách hàng, Ngày đặt, Trạng thái, Tổng tiền

**Tab Sản phẩm:**
- Hiển thị danh sách tất cả sản phẩm
- Hiển thị số lượng bán cho mỗi sản phẩm (tính từ ORDERS)
- Hiển thị rating trung bình (tính từ REVIEWS)
- Cho phép tìm kiếm theo tên sản phẩm
- Cho phép sắp xếp theo: Tên, Giá, Số bán, Rating

**Tab Người dùng:**
- Hiển thị danh sách tất cả người dùng
- Hiển thị thông tin: Tên, Email, Số điện thoại, Ngày tạo tài khoản
- Hiển thị số đơn hàng của mỗi người dùng
- Hiển thị tổng tiền đã chi tiêu của mỗi người dùng
- Cho phép tìm kiếm theo tên hoặc email

#### 2.4.4 Cơ chế cập nhật dữ liệu real-time

- Khi người dùng tạo đơn hàng mới, dữ liệu được lưu vào ORDERS
- Khi người dùng gửi đánh giá, dữ liệu được lưu vào REVIEWS
- Admin Dashboard tự động tải lại dữ liệu khi vào tab
- Sử dụng `useFocusEffect` để cập nhật dữ liệu mỗi khi quay lại Admin Dashboard

#### 2.4.5 Cơ chế bảo mật Admin

- Chỉ người dùng có `role === 'admin'` mới có thể truy cập Admin Dashboard
- Kiểm tra role khi đăng nhập
- Nếu không phải admin, điều hướng về BuyerTabs (giao diện người dùng thường)
- Dữ liệu admin được lưu trữ cục bộ, không gửi lên server

---

## CHƯƠNG 3. THIẾT KẾ GIAO DIỆN VÀ CƠ CHẾ HOẠT ĐỘNG

### 3.1 Cơ chế tính toán và hiển thị Admin

#### 3.1.1 Cơ chế lưu trữ dữ liệu

Tất cả dữ liệu được lưu trữ cục bộ bằng AsyncStorage với các key chính:
- **USER**: Thông tin người dùng hiện tại
- **CART**: Giỏ hàng của người dùng
- **WISHLIST**: Danh sách yêu thích
- **ORDERS**: Lịch sử đơn hàng
- **REVIEWS**: Đánh giá sản phẩm từ người dùng
- **APP_CONFIG**: Cấu hình ứng dụng (màu sắc, theme)

#### 3.1.2 Cơ chế tính toán doanh số

**Tính tổng doanh thu:**
```
Tổng doanh thu = Σ(Đơn hàng.totalPrice) cho tất cả đơn hàng
```

**Tính doanh thu theo ngày:**
```
Doanh thu ngày X = Σ(Đơn hàng.totalPrice) 
                   cho tất cả đơn hàng có createdAt = ngày X
```

**Tính sản phẩm bán chạy nhất:**
```
Số lượng bán = Σ(Đơn hàng.items[i].quantity) 
              cho tất cả đơn hàng chứa sản phẩm đó
Sắp xếp theo số lượng bán giảm dần
```

**Tính rating trung bình sản phẩm:**
```
Rating trung bình = Σ(Review.rating) / Số lượng review
                   cho tất cả review của sản phẩm đó
```

#### 3.1.3 Cơ chế hiển thị Admin Dashboard

**Tab Thống kê:**
- **Tổng số đơn hàng**: Đếm tất cả đơn hàng trong ORDERS
- **Tổng doanh thu**: Cộng tất cả totalPrice từ ORDERS
- **Số khách hàng mới**: Đếm người dùng được tạo trong 30 ngày gần nhất
- **Sản phẩm bán chạy nhất**: Top 5 sản phẩm có số lượng bán cao nhất
- **Biểu đồ doanh số**: Hiển thị doanh thu theo từng ngày trong 7 ngày gần nhất

**Tab Đơn hàng:**
- Hiển thị danh sách tất cả đơn hàng từ ORDERS
- Sắp xếp theo ngày tạo (mới nhất trước)
- Cho phép lọc theo trạng thái: Chờ xử lý, Đang xử lý, Đã gửi, Đã giao, Đã hủy
- Hiển thị thông tin: Mã đơn, Khách hàng, Ngày đặt, Trạng thái, Tổng tiền

**Tab Sản phẩm:**
- Hiển thị danh sách tất cả sản phẩm
- Hiển thị số lượng bán cho mỗi sản phẩm (tính từ ORDERS)
- Hiển thị rating trung bình (tính từ REVIEWS)
- Cho phép tìm kiếm theo tên sản phẩm
- Cho phép sắp xếp theo: Tên, Giá, Số bán, Rating

**Tab Người dùng:**
- Hiển thị danh sách tất cả người dùng
- Hiển thị thông tin: Tên, Email, Số điện thoại, Ngày tạo tài khoản
- Hiển thị số đơn hàng của mỗi người dùng
- Hiển thị tổng tiền đã chi tiêu của mỗi người dùng
- Cho phép tìm kiếm theo tên hoặc email

#### 3.1.4 Cơ chế cập nhật dữ liệu real-time

- Khi người dùng tạo đơn hàng mới, dữ liệu được lưu vào ORDERS
- Khi người dùng gửi đánh giá, dữ liệu được lưu vào REVIEWS
- Admin Dashboard tự động tải lại dữ liệu khi vào tab
- Sử dụng `useFocusEffect` để cập nhật dữ liệu mỗi khi quay lại Admin Dashboard

#### 3.1.5 Cơ chế bảo mật Admin

- Chỉ người dùng có `role === 'admin'` mới có thể truy cập Admin Dashboard
- Kiểm tra role khi đăng nhập
- Nếu không phải admin, điều hướng về BuyerTabs (giao diện người dùng thường)
- Dữ liệu admin được lưu trữ cục bộ, không gửi lên server

---

---

### 3.2 Giao diện trang chủ

**Thành phần chính:**
- Header với tên shop, thanh tìm kiếm, icon giỏ hàng và hồ sơ
- Banner carousel tự động chuyển ảnh (3 ảnh)
- Section "Về DaisyDrape" với thiết kế Galaxy tối trầm
- Danh sách sản phẩm mới (3 cột)
- Bộ sưu tập nổi bật (2 cột)
- Tất cả sản phẩm (2 cột)

**Ảnh minh họa:**
```
┌─────────────────────────────────┐
│  DaisyDrape 🌸  🔍  🛒  👤     │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │   [Banner Carousel]       │  │
│  │   ● ○ ○                   │  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  Về DaisyDrape (Galaxy Theme)   │
│  ✨ Chất lượng cao              │
│  🚚 Giao hàng nhanh             │
│  💝 Giá tốt nhất                │
├─────────────────────────────────┤
│  Sản phẩm mới                   │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ Áo 1 │ │ Áo 2 │ │ Áo 3 │    │
│  │ 500k │ │ 600k │ │ 700k │    │
│  └──────┘ └──────┘ └──────┘    │
└─────────────────────────────────┘
```

---

### 3.3 Giao diện chi tiết sản phẩm

**Thành phần chính:**
- Ảnh sản phẩm lớn
- Tên sản phẩm
- Giá tiền
- Rating trung bình + số lượng đánh giá
- Mô tả chi tiết
- Chọn kích cỡ
- Chọn số lượng
- Nút "Thêm vào giỏ" và "Thêm vào yêu thích"
- Danh sách đánh giá từ người dùng

**Ảnh minh họa:**
```
┌─────────────────────────────────┐
│  ◄  Chi tiết sản phẩm  ❤️       │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │   [Ảnh sản phẩm]         │  │
│  └───────────────────────────┘  │
│  Áo thun nữ cao cấp              │
│  ⭐ 4.5 (12 đánh giá)            │
│  500.000 VND                     │
│                                  │
│  Mô tả: Áo thun chất lượng cao.. │
│                                  │
│  Chọn kích cỡ: XS S M L XL XXL  │
│  Số lượng: - 1 +                 │
│                                  │
│  [🛒 Thêm vào giỏ]               │
│  [❤️ Thêm vào yêu thích]         │
├─────────────────────────────────┤
│  💬 Đánh giá từ khách hàng       │
│  ⭐⭐⭐⭐⭐ Nguyễn Văn A          │
│  "Sản phẩm rất đẹp!"             │
└─────────────────────────────────┘
```

---

### 3.4 Giao diện giỏ hàng

**Thành phần chính:**
- Danh sách sản phẩm trong giỏ
- Số lượng và giá từng sản phẩm
- Nút xóa sản phẩm
- Tổng giá tiền
- Nút "Thanh toán"

**Ảnh minh họa:**
```
┌─────────────────────────────────┐
│  Giỏ hàng (3 sản phẩm)  ❤️  👤  │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ [Ảnh] Áo thun              ││
│  │ 500k  - 1 +  500k  🗑️      ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ [Ảnh] Quần jean            ││
│  │ 800k  - 2 +  1.6M  🗑️      ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ [Ảnh] Váy đầm              ││
│  │ 1.2M  - 1 +  1.2M  🗑️      ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  Tổng cộng: 3.3M VND            │
│  [💳 Thanh toán]                │
└─────────────────────────────────┘
```

---

### 3.5 Giao diện hồ sơ cá nhân

**Thành phần chính:**
- Avatar tùy chỉnh (có thể upload ảnh)
- Thông tin cá nhân (tên, email, số điện thoại)
- Tab navigation (Thông tin, Địa chỉ, Thanh toán, Đơn hàng)
- Nút đăng xuất

**Ảnh minh họa:**
```
┌─────────────────────────────────┐
│  Hồ sơ  ❤️  🛒                   │
├─────────────────────────────────┤
│        ┌─────────┐              │
│        │ [Avatar]│ 📷           │
│        └─────────┘              │
│  Nguyễn Văn A                   │
│  user@email.com                 │
│  [✏️ Chỉnh sửa hồ sơ]            │
├─────────────────────────────────┤
│ ℹ️ Địa chỉ 💳 Thanh toán 📦 Đơn │
├─────────────────────────────────┤
│  📋 Thông tin tài khoản          │
│  Tên: Nguyễn Văn A              │
│  Email: user@email.com          │
│  SĐT: 0123456789                │
│                                  │
│  📊 Thống kê                     │
│  [3 Đơn hàng] [✓ Đã mua] [0 ⭐] │
├─────────────────────────────────┤
│  [🚪 Đăng xuất]                 │
└─────────────────────────────────┘
```

---

### 3.6 Giao diện yêu thích

**Thành phần chính:**
- Danh sách sản phẩm yêu thích
- Nút xóa khỏi yêu thích
- Nút thêm vào giỏ hàng
- Header với icon giỏ hàng và hồ sơ

**Ảnh minh họa:**
```
┌─────────────────────────────────┐
│  Yêu thích (5 sản phẩm)  🛒  👤 │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ [Ảnh] Áo thun        ❤️     ││
│  │ 500k                        ││
│  │ [🛒 Thêm] [🗑️ Xóa]         ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ [Ảnh] Quần jean      ❤️     ││
│  │ 800k                        ││
│  │ [🛒 Thêm] [🗑️ Xóa]         ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

### 3.7 Giao diện đăng nhập

**Thành phần chính:**
- Logo/Tên ứng dụng
- Trường nhập email
- Trường nhập mật khẩu
- Nút "Đăng nhập"
- Link "Quên mật khẩu"
- Link "Đăng ký tài khoản mới"

**Ảnh minh họa:**
```
┌─────────────────────────────────┐
│                                  │
│      🌸 DaisyDrape 🌸           │
│                                  │
│  ┌─────────────────────────────┐│
│  │ Email                       ││
│  │ [________________]          ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Mật khẩu                    ││
│  │ [________________]          ││
│  └─────────────────────────────┘│
│                                  │
│  [🔓 Đăng nhập]                 │
│                                  │
│  Quên mật khẩu?                 │
│  Chưa có tài khoản? Đăng ký     │
│                                  │
└─────────────────────────────────┘
```

---

### 3.8 Giao diện thanh toán

**Thành phần chính:**
- Tóm tắt đơn hàng
- Chọn địa chỉ giao hàng
- Chọn phương thức thanh toán
- Tính phí vận chuyển
- Tổng tiền cuối cùng
- Nút "Xác nhận thanh toán"

**Ảnh minh họa:**
```
┌─────────────────────────────────┐
│  Thanh toán                      │
├─────────────────────────────────┤
│  📦 Tóm tắt đơn hàng             │
│  3 sản phẩm  3.3M               │
│                                  │
│  📍 Địa chỉ giao hàng            │
│  [Chọn địa chỉ ▼]               │
│  123 Đường ABC, Hà Nội          │
│                                  │
│  💳 Phương thức thanh toán       │
│  [Chọn phương thức ▼]            │
│  Visa ****4242                  │
│                                  │
│  Tổng tiền: 3.3M VND            │
│  Phí vận chuyển: 30k             │
│  ─────────────────────           │
│  Tổng cộng: 3.33M VND           │
│                                  │
│  [✓ Xác nhận thanh toán]         │
└─────────────────────────────────┘
```

---

### 3.9 Giao diện đánh giá sản phẩm

**Thành phần chính:**
- Ảnh sản phẩm
- Tên sản phẩm
- Chọn số sao (1-5)
- Trường nhập bình luận
- Nút "Gửi đánh giá"
- Danh sách đánh giá từ người dùng khác

**Ảnh minh họa:**
```
┌─────────────────────────────────┐
│  ◄ Đánh giá sản phẩm             │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ [Ảnh] Áo thun nữ          │  │
│  │ 500.000 VND               │  │
│  └───────────────────────────┘  │
│                                  │
│  Đánh giá của bạn                │
│  ⭐ ⭐ ⭐ ⭐ ⭐                    │
│  😍 Tuyệt vời                    │
│                                  │
│  Nhận xét (tùy chọn)             │
│  ┌─────────────────────────────┐│
│  │ Sản phẩm rất đẹp, chất lượng││
│  │ tốt, giao hàng nhanh!      ││
│  │ 45/500                     ││
│  └─────────────────────────────┘│
│                                  │
│  [📤 Gửi đánh giá]               │
│                                  │
│  💬 Đánh giá khác                │
│  ⭐⭐⭐⭐⭐ Nguyễn A              │
│  "Rất hài lòng!"                 │
└─────────────────────────────────┘
```

---

### 3.10 Giao diện Admin Dashboard

**Tab Thống kê:**
```
┌─────────────────────────────────┐
│  Admin Dashboard - Thống kê      │
├─────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐      │
│  │ 45 Đơn   │ │ 50.5M    │      │
│  │ hàng     │ │ Doanh thu│      │
│  └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐      │
│  │ 12 KH    │ │ Áo thun  │      │
│  │ mới      │ │ (120 bán)│      │
│  └──────────┘ └──────────┘      │
│                                  │
│  Biểu đồ doanh số 7 ngày        │
│  ▁▂▃▄▅▆▇█                       │
│  T2 T3 T4 T5 T6 T7 CN           │
└─────────────────────────────────┘
```

**Tab Sản phẩm:**
```
┌─────────────────────────────────┐
│  Admin Dashboard - Sản phẩm      │
├─────────────────────────────────┤
│  [Tìm kiếm...]  [Sắp xếp ▼]     │
├─────────────────────────────────┤
│  Áo thun nữ    500k  ⭐4.5 120   │
│  [✏️] [🗑️]                       │
│  Quần jean     800k  ⭐4.2 85    │
│  [✏️] [🗑️]                       │
│  Váy đầm       1.2M  ⭐4.8 45    │
│  [✏️] [🗑️]                       │
│                                  │
│  [➕ Thêm sản phẩm]              │
└─────────────────────────────────┘
```

**Tab Đơn hàng:**
```
┌─────────────────────────────────┐
│  Admin Dashboard - Đơn hàng      │
├─────────────────────────────────┤
│  [Lọc: Tất cả ▼]                │
├─────────────────────────────────┤
│  #001 Nguyễn A  05/05  Đã giao  │
│  3.3M  [👁️ Chi tiết]             │
│  #002 Trần B    04/05  Đang gửi │
│  2.1M  [👁️ Chi tiết]             │
│  #003 Lê C      03/05  Chờ xử lý│
│  1.8M  [👁️ Chi tiết]             │
└─────────────────────────────────┘
```

**Tab Người dùng:**
```
┌─────────────────────────────────┐
│  Admin Dashboard - Người dùng    │
├─────────────────────────────────┤
│  [Tìm kiếm...]                  │
├─────────────────────────────────┤
│  Nguyễn Văn A  user@email.com   │
│  0123456789  05/05/2026  3 đơn  │
│  [👁️ Chi tiết]                  │
│  Trần Thị B    tran@email.com   │
│  0987654321  04/05/2026  2 đơn  │
│  [👁️ Chi tiết]                  │
└─────────────────────────────────┘
```

---
  - Tổng tiền
  - Nút xem chi tiết
  - Nút cập nhật trạng thái
- Bộ lọc theo trạng thái

**Tab Người dùng:**
- Danh sách người dùng:
  - Tên người dùng
  - Email
  - Số điện thoại
  - Ngày tạo tài khoản
  - Nút xem chi tiết
  - Nút khóa/mở khóa tài khoản
- Bộ tìm kiếm

**Tab Thống kê:**
- Biểu đồ doanh số
- Tổng số đơn hàng
- Tổng doanh thu
- Số khách hàng mới
- Sản phẩm bán chạy nhất

**Màu sắc:**
- Nền: #F5F1E8 (Kem)
- Header: #B8956A (Nâu)
- Tab active: #D4C4B0 (Beige)
- Nút: #B8956A (Nâu)

---

## KẾT LUẬN

Trên đây là toàn bộ nội dung báo cáo thực hiện những vấn đề nêu lên ở phần đầu. Đó là minh chứng rõ rệt cho sự cố gắng, quyết tâm cũng như đánh giá khả năng hiểu biết, kiến thức của nhóm chúng em trong việc tìm hiểu hệ thống hiện tại và xây dựng hệ thống mới nhằm đáp ứng nhu cầu thực tiễn.

Đồng thời, qua bài báo cáo trên cũng đã giúp cho chúng em học hỏi được thêm nhiều kiến thức mới mẻ, nâng cao tính tự giác, tinh thần đoàn kết và nâng cao khả năng làm việc nhóm. Giúp nhóm có thêm kinh nghiệm đi khảo sát thực tế và được trau dồi khả năng phân tích, đánh giá về nhiều khía cạnh, tiếp cận với người dùng. Thêm vào đó, là giúp cho chúng em hiểu rõ hơn về ngôn ngữ lập trình React Native, công cụ Expo mà mình đang sử dụng, cũng như lý thuyết, phương pháp tìm hiểu về tính đặc trù của lập trình mobile.

Trong quá trình tìm hiểu và làm bài, nhóm đã cố gắng hoàn thiện bài làm và hoàn thiện mình hơn về mặt kiến thức. Nhưng cũng không thể tránh khỏi những sai sót, mong thầy cô và các bạn góp ý để bài của nhóm hoàn thiện hơn.

**Em xin chân thành cảm ơn!**

---

## PHỤ LỤC: CÔNG NGHỆ SỬ DỤNG

- **React Native**: Framework phát triển ứng dụng di động
- **Expo**: Nền tảng phát triển React Native
- **React Navigation**: Điều hướng giữa các màn hình
- **Expo Linear Gradient**: Tạo gradient đẹp
- **Expo Image Picker**: Chọn ảnh từ thư viện
- **Cloudinary**: Lưu trữ và quản lý ảnh
- **AsyncStorage**: Lưu trữ dữ liệu cục bộ
- **Ionicons**: Thư viện icon

---

**Ngày hoàn thành: Tháng 05, 2026**
