# BÁO CÁO NGẮN - DỰ ÁN DAISYDRAPE

## GIỚI THIỆU DỰ ÁN

DaisyDrape là một ứng dụng thương mại điện tử thời trang được phát triển bằng React Native và Expo. Dự án này được xây dựng với phiên bản 1.0.0 vào tháng 05 năm 2026. Mục tiêu chính của ứng dụng là cung cấp một nền tảng mua sắm trực tuyến hiện đại, thân thiện với người dùng, cho phép khách hàng duyệt, tìm kiếm và mua sắm các sản phẩm thời trang một cách dễ dàng và tiện lợi.

## MỤC TIÊU VÀ TÍNH NĂNG

Ứng dụng DaisyDrape được thiết kế để đáp ứng nhu cầu của hai nhóm người dùng chính: khách hàng thường và quản trị viên. Đối với khách hàng thường, ứng dụng cung cấp các tính năng như duyệt sản phẩm trên trang chủ, tìm kiếm sản phẩm theo tên, xem chi tiết sản phẩm bao gồm thông tin, giá cả và đánh giá từ những khách hàng khác. Khách hàng có thể thêm sản phẩm vào giỏ hàng hoặc danh sách yêu thích, quản lý giỏ hàng bằng cách thêm, xóa hoặc cập nhật số lượng sản phẩm. Ngoài ra, ứng dụng hỗ trợ thanh toán trực tuyến với khả năng chọn địa chỉ giao hàng và phương thức thanh toán, xem lịch sử đơn hàng, và để lại đánh giá 5 sao cho các sản phẩm đã mua. Khách hàng cũng có thể quản lý hồ sơ cá nhân của mình bao gồm thông tin tài khoản, địa chỉ giao hàng và phương thức thanh toán.

Đối với quản trị viên, ứng dụng cung cấp một bảng điều khiển quản lý toàn diện. Admin Dashboard bao gồm các tab thống kê hiển thị tổng doanh thu, số đơn hàng, số khách hàng mới và biểu đồ doanh số trong 7 ngày gần nhất. Tab quản lý đơn hàng cho phép xem danh sách tất cả đơn hàng, lọc theo trạng thái và cập nhật trạng thái giao hàng. Tab quản lý sản phẩm hiển thị danh sách sản phẩm cùng với số lượng bán và rating trung bình. Tab quản lý người dùng cung cấp danh sách khách hàng với thông tin chi tiêu của họ.

## KIẾN TRÚC VÀ CÔNG NGHỆ

Ứng dụng được xây dựng trên nền tảng React Native phiên bản 0.81.5 với Expo phiên bản 54.0.34 làm nền tảng phát triển. Kiến trúc của ứng dụng bao gồm phần frontend được viết bằng React Native với các màn hình khác nhau như HomeScreen, ProductDetailScreen, CartScreen, WishlistScreen, ProfileScreen, LoginScreen, CheckoutScreen và AdminDashboardScreen. Ứng dụng sử dụng React Navigation phiên bản 7.1.6 để điều hướng giữa các màn hình, bao gồm Bottom Tabs Navigation và Stack Navigation. Các component được tổ chức trong thư mục components, bao gồm BannerComponent và ProductCard. Ứng dụng sử dụng Context API thông qua AppConfigContext để quản lý trạng thái toàn cục.

Về lưu trữ dữ liệu, ứng dụng sử dụng AsyncStorage phiên bản 2.2.0 để lưu trữ tất cả dữ liệu cục bộ. Các key chính bao gồm USER cho thông tin người dùng hiện tại, CART cho giỏ hàng, WISHLIST cho danh sách yêu thích, ORDERS cho lịch sử đơn hàng, REVIEWS cho đánh giá sản phẩm từ người dùng, và APP_CONFIG cho cấu hình ứng dụng như màu sắc và theme. Ứng dụng cũng tích hợp Cloudinary để quản lý và lưu trữ ảnh. Các công nghệ khác bao gồm Expo Linear Gradient phiên bản 55.0.13 để tạo gradient đẹp, Expo Image Picker phiên bản 17.0.11 để chọn ảnh từ thư viện, và Jest phiên bản 29.7.0 cho testing framework.

## CƠ CHẾ TÍNH TOÁN VÀ HIỂN THỊ

Ứng dụng sử dụng các công thức tính toán để hiển thị thông tin thống kê cho admin. Tổng doanh thu được tính bằng cách cộng tất cả totalPrice từ tất cả đơn hàng trong ORDERS. Doanh thu theo ngày được tính bằng cách cộng tất cả totalPrice từ các đơn hàng có ngày tạo bằng ngày cần tính. Sản phẩm bán chạy nhất được xác định bằng cách tính tổng số lượng bán của mỗi sản phẩm từ tất cả đơn hàng, sau đó sắp xếp theo số lượng bán giảm dần. Rating trung bình của sản phẩm được tính bằng cách cộng tất cả rating từ các review của sản phẩm đó rồi chia cho số lượng review.

Admin Dashboard được cập nhật real-time khi người dùng tạo đơn hàng mới hoặc gửi đánh giá. Ứng dụng sử dụng useFocusEffect để tự động tải lại dữ liệu mỗi khi quay lại Admin Dashboard. Bảo mật được đảm bảo bằng cách chỉ cho phép người dùng có role === 'admin' truy cập Admin Dashboard. Nếu người dùng không phải admin, họ sẽ được điều hướng về BuyerTabs, đó là giao diện dành cho người dùng thường.

## GIAO DIỆN NGƯỜI DÙNG

Trang chủ của ứng dụng bao gồm header với tên shop, thanh tìm kiếm, icon giỏ hàng và hồ sơ. Dưới header là banner carousel tự động chuyển giữa 3 ảnh quảng cáo. Tiếp theo là section "Về DaisyDrape" với thiết kế Galaxy tối trầm, giới thiệu các ưu điểm của cửa hàng. Phía dưới là danh sách sản phẩm mới được hiển thị trong 3 cột, bộ sưu tập nổi bật trong 2 cột, và tất cả sản phẩm cũng trong 2 cột.

Trang chi tiết sản phẩm hiển thị ảnh sản phẩm lớn, tên sản phẩm, giá tiền, rating trung bình cùng số lượng đánh giá, mô tả chi tiết, lựa chọn kích cỡ và số lượng, nút "Thêm vào giỏ" và "Thêm vào yêu thích", cũng như danh sách đánh giá từ các khách hàng khác.

Trang giỏ hàng hiển thị danh sách các sản phẩm đã thêm vào giỏ, số lượng và giá của từng sản phẩm, nút xóa sản phẩm, tổng giá tiền, và nút "Thanh toán".

Trang hồ sơ cá nhân cho phép người dùng xem và chỉnh sửa avatar, thông tin cá nhân bao gồm tên, email, số điện thoại. Trang này có các tab điều hướng cho thông tin tài khoản, địa chỉ giao hàng, phương thức thanh toán, và lịch sử đơn hàng. Cuối cùng là nút đăng xuất.

Trang yêu thích hiển thị danh sách các sản phẩm mà người dùng đã lưu, với khả năng xóa khỏi yêu thích hoặc thêm vào giỏ hàng.

Trang thanh toán bao gồm tóm tắt đơn hàng, lựa chọn địa chỉ giao hàng, lựa chọn phương thức thanh toán, tính phí vận chuyển, hiển thị tổng tiền cuối cùng, và nút "Xác nhận thanh toán".

Admin Dashboard bao gồm nhiều tab khác nhau. Tab thống kê hiển thị tổng số đơn hàng, tổng doanh thu, số khách hàng mới, sản phẩm bán chạy nhất, và biểu đồ doanh số. Tab đơn hàng hiển thị danh sách tất cả đơn hàng, cho phép lọc theo trạng thái, và hiển thị thông tin mã đơn, khách hàng, ngày đặt, trạng thái, và tổng tiền. Tab sản phẩm hiển thị danh sách sản phẩm, số lượng bán, rating trung bình, cho phép tìm kiếm và sắp xếp. Tab người dùng hiển thị danh sách khách hàng với thông tin tên, email, số điện thoại, ngày tạo tài khoản, số đơn hàng, và tổng tiền chi tiêu.

## HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY

Để cài đặt dự án, trước tiên cần đảm bảo hệ thống có Node.js phiên bản 16 trở lên, npm hoặc yarn, và Expo CLI. Sau đó, clone dự án từ repository, chuyển vào thư mục DaisyDrape, và chạy lệnh npm install để cài đặt tất cả dependencies. Để chạy ứng dụng, sử dụng lệnh npm start. Để chạy trên Android, sử dụng npm run android. Để chạy trên iOS, sử dụng npm run ios. Để chạy trên web, sử dụng npm run web. Để chạy test, sử dụng npm test, hoặc npm run test:watch để chạy ở chế độ watch.

## TÀI KHOẢN DEMO

Ứng dụng cung cấp hai tài khoản demo cho mục đích kiểm tra. Tài khoản người dùng thường có email là user@example.com và mật khẩu là password123. Tài khoản admin có email là admin@example.com và mật khẩu là admin123.

## BẢO MẬT VÀ HƯỚNG PHÁT TRIỂN

Ứng dụng đảm bảo bảo mật thông tin người dùng thông qua mã hóa mật khẩu và xác thực người dùng. Chỉ những người dùng có role admin mới có thể truy cập Admin Dashboard. Tất cả dữ liệu được lưu trữ cục bộ trên thiết bị và không được gửi lên server.

Trong tương lai, dự án có kế hoạch phát triển thêm nhiều tính năng mới. Điều đầu tiên là tích hợp backend thực tế để kết nối với API. Tiếp theo là tích hợp các phương thức thanh toán trực tuyến như Stripe, Momo, và ZaloPay. Ứng dụng cũng sẽ thêm tính năng thông báo push để cập nhật trạng thái đơn hàng cho người dùng. Chat hỗ trợ khách hàng real-time sẽ được tích hợp để cải thiện trải nghiệm khách hàng. Đánh giá sản phẩm sẽ được nâng cao với khả năng thêm ảnh và video. Hệ thống khuyến mãi bao gồm mã giảm giá và flash sale sẽ được thêm vào. Cuối cùng, ứng dụng sẽ hỗ trợ đa ngôn ngữ bao gồm tiếng Anh và tiếng Trung.

## KẾT LUẬN

DaisyDrape là một ứng dụng thương mại điện tử hoàn chỉnh được xây dựng bằng React Native, cung cấp trải nghiệm mua sắm thân thiện cho người dùng và công cụ quản lý mạnh mẽ cho admin. Ứng dụng sử dụng lưu trữ cục bộ để đảm bảo hiệu suất cao và có thể dễ dàng mở rộng với backend thực tế trong tương lai. Với các tính năng toàn diện và giao diện người dùng thân thiện, DaisyDrape sẵn sàng phục vụ nhu cầu mua sắm trực tuyến của người dùng.

---

**Ngày hoàn thành:** Tháng 05, 2026  
**Trạng thái:** Hoàn thành phiên bản 1.0.0
