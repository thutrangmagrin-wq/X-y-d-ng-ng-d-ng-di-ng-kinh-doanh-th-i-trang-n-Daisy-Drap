# DaisyDrape - Ứng dụng thời trang hiện đại

DaisyDrape là một ứng dụng di động thương mại điện tử được xây dựng bằng React Native và Expo, cung cấp trải nghiệm mua sắm thời trang sang trọng và tiện lợi.

## Thông tin thành viên
Thành viên 1:  Đỗ Quỳnh Thu Trang-23810310379
Thành viên 2:  Nguyễn Thị Huệ Minh-23810310177
## TÊN ĐỀ TÀI

Ứng dụng thương mại điện tử thời trang DaisyDrape trên nền tảng React Native

---

## PHÂN CÔNG NHIỆM VỤ CỤ THỂ

Công việc được phân chia cụ thể như sau:

**Thành viên 1** chịu trách nhiệm về kiến trúc tổng thể của ứng dụng, thiết lập dự án React Native, cấu hình Expo, và phát triển các màn hình chính như HomeScreen, ProductDetailScreen, và CartScreen. Thành viên này cũng quản lý Context API để lưu trữ trạng thái toàn cục của ứng dụng,hát triển giao diện người dùng, bao gồm thiết kế các component như BannerComponent, ProductCard, và các màn hình liên quan đến hồ sơ cá nhân, danh sách yêu thích, và thanh toán.tạo dữ liệu mẫu cho sản phẩm, viết các test case bằng Jest, và đảm bảo chất lượng của ứng dụng. Thành viên này cũng hỗ trợ các thành viên khác trong việc debug và tối ưu hóa hiệu suất.

---
**Thành viên 2**  tập trung vào phát triển giao diện người dùng, bao gồm thiết kế các component như BannerComponent, ProductCard, và các màn hình liên quan đến hồ sơ cá nhân, danh sách yêu thích, và thanh toán. Thành viên này cũng chịu trách nhiệm về styling và tạo ra giao diện đẹp mắt, thân thiện với người dùng.
phát triển Admin Dashboard với các tab thống kê, quản lý đơn hàng, quản lý sản phẩm, và quản lý người dùng. Thành viên này cũng xây dựng các công thức tính toán doanh số, biểu đồ thống kê, và các tính năng lọc, tìm kiếm cho admin, quản lý cơ chế lưu trữ dữ liệu bằng AsyncStorage, tạo dữ liệu mẫu cho sản phẩm, viết các test case bằng Jest, và đảm bảo chất lượng của ứng dụng. Thành viên này cũng hỗ trợ các thành viên khác trong việc debug và tối ưu hóa hiệu suất.

---
## GIỚI THIỆU WEBSITE/HỆ THỐNG

DaisyDrape là một ứng dụng di động thương mại điện tử chuyên về bán hàng thời trang. Ứng dụng được phát triển bằng React Native và Expo, cho phép người dùng duyệt, tìm kiếm, và mua sắm các sản phẩm thời trang một cách dễ dàng. Hệ thống bao gồm hai phần chính: giao diện người dùng thường dành cho khách hàng mua sắm, và bảng điều khiển quản lý dành cho quản trị viên. Người dùng có thể tạo tài khoản, duyệt sản phẩm, thêm vào giỏ hàng, quản lý danh sách yêu thích, thực hiện thanh toán, xem lịch sử đơn hàng, và để lại đánh giá cho sản phẩm. Admin có thể xem thống kê doanh số, quản lý đơn hàng, sản phẩm, và người dùng thông qua một bảng điều khiển toàn diện.

---


## CÔNG NGHỆ SỬ DỤNG

Ứng dụng DaisyDrape được xây dựng trên nền tảng React Native phiên bản 0.81.5 với Expo phiên bản 54.0.34 làm nền tảng phát triển chính. React Navigation phiên bản 7.1.6 được sử dụng để quản lý điều hướng giữa các màn hình, bao gồm Bottom Tabs Navigation cho menu chính và Stack Navigation cho các màn hình chi tiết. AsyncStorage phiên bản 2.2.0 được sử dụng để lưu trữ tất cả dữ liệu cục bộ trên thiết bị người dùng. Expo Linear Gradient phiên bản 55.0.13 được sử dụng để tạo các gradient đẹp mắt trong giao diện. Expo Image Picker phiên bản 17.0.11 cho phép người dùng chọn ảnh từ thư viện thiết bị. Cloudinary được tích hợp để quản lý và lưu trữ ảnh sản phẩm. Jest phiên bản 29.7.0 được sử dụng làm testing framework để viết và chạy các test case. React Test Renderer phiên bản 19.1.0 được sử dụng để render component trong test. Babel được cấu hình để transpile code React Native thành JavaScript có thể chạy được.

---

## HƯỚNG DẪN CÀI ĐẶT

Để cài đặt dự án DaisyDrape, trước tiên cần đảm bảo hệ thống có Node.js phiên bản 16 trở lên, npm hoặc yarn, và Expo CLI được cài đặt. Bước đầu tiên là clone dự án từ repository bằng lệnh git clone, sau đó chuyển vào thư mục DaisyDrape. Tiếp theo, chạy lệnh npm install để cài đặt tất cả các dependencies được liệt kê trong file package.json. Quá trình cài đặt sẽ tải xuống tất cả các thư viện cần thiết bao gồm React Native, Expo, React Navigation, AsyncStorage, và các thư viện khác. Sau khi cài đặt hoàn tất, dự án sẽ sẵn sàng để chạy trên các nền tảng khác nhau.

---

## HƯỚNG DẪN CHẠY PROJECT

Để chạy ứng dụng DaisyDrape, sử dụng lệnh npm start để khởi động Expo development server. Lệnh này sẽ hiển thị một QR code mà bạn có thể quét bằng ứng dụng Expo Go trên điện thoại để xem ứng dụng chạy trực tiếp. Để chạy trên Android, sử dụng lệnh npm run android, điều này sẽ khởi động Android emulator hoặc kết nối với thiết bị Android thực tế nếu có. Để chạy trên iOS, sử dụng lệnh npm run ios, tuy nhiên điều này chỉ có thể thực hiện trên máy Mac. Để chạy trên web, sử dụng lệnh npm run web, ứng dụng sẽ mở trong trình duyệt web. Để chạy các test case, sử dụng lệnh npm test để chạy tất cả test một lần, hoặc npm run test:watch để chạy ở chế độ watch, tự động chạy lại test khi có thay đổi trong code.

---

## TÀI KHOẢN DEMO

Ứng dụng cung cấp hai tài khoản demo cho mục đích kiểm tra và trải nghiệm các tính năng khác nhau. Tài khoản người dùng thường có email là user@example.com và mật khẩu là password123. Tài khoản này cho phép truy cập vào giao diện mua sắm thông thường, bao gồm duyệt sản phẩm, thêm vào giỏ hàng, quản lý danh sách yêu thích, và thực hiện thanh toán. Tài khoản admin có email là admin@example.com và mật khẩu là admin123. Tài khoản này cho phép truy cập vào Admin Dashboard với các tính năng quản lý toàn diện bao gồm xem thống kê doanh số, quản lý đơn hàng, sản phẩm, và người dùng.

---

## HÌNH ẢNH MINH HỌA HỆ THỐNG

Giao diện trang chủ của ứng dụng bao gồm header với tên shop DaisyDrape, thanh tìm kiếm, icon giỏ hàng, và icon hồ sơ cá nhân. Dưới header là banner carousel tự động chuyển giữa ba ảnh quảng cáo. Tiếp theo là section "Về DaisyDrape" với thiết kế Galaxy tối trầm, giới thiệu các ưu điểm của cửa hàng như chất lượng cao, giao hàng nhanh, và giá tốt nhất. Phía dưới là danh sách sản phẩm mới được hiển thị trong 3 cột, bộ sưu tập nổi bật trong 2 cột, và tất cả sản phẩm cũng trong 2 cột.

Trang chi tiết sản phẩm hiển thị ảnh sản phẩm lớn ở phía trên, tiếp theo là tên sản phẩm, giá tiền, rating trung bình cùng số lượng đánh giá. Dưới đó là mô tả chi tiết sản phẩm, lựa chọn kích cỡ từ XS đến XXL, và lựa chọn số lượng. Cuối cùng là hai nút chính: "Thêm vào giỏ" và "Thêm vào yêu thích", cùng với danh sách đánh giá từ các khách hàng khác.

Trang giỏ hàng hiển thị danh sách các sản phẩm đã thêm vào giỏ, mỗi sản phẩm có ảnh, tên, giá, số lượng, và nút xóa. Ở cuối trang là tổng giá tiền và nút "Thanh toán".

Trang hồ sơ cá nhân cho phép người dùng xem và chỉnh sửa avatar, thông tin cá nhân bao gồm tên, email, số điện thoại. Trang này có các tab điều hướng cho thông tin tài khoản, địa chỉ giao hàng, phương thức thanh toán, và lịch sử đơn hàng. Cuối cùng là nút đăng xuất.

Admin Dashboard bao gồm nhiều tab khác nhau. Tab thống kê hiển thị tổng số đơn hàng, tổng doanh thu, số khách hàng mới, sản phẩm bán chạy nhất, và biểu đồ doanh số. Tab đơn hàng hiển thị danh sách tất cả đơn hàng, cho phép lọc theo trạng thái, và hiển thị thông tin mã đơn, khách hàng, ngày đặt, trạng thái, và tổng tiền. Tab sản phẩm hiển thị danh sách sản phẩm, số lượng bán, rating trung bình, cho phép tìm kiếm và sắp xếp. Tab người dùng hiển thị danh sách khách hàng với thông tin tên, email, số điện thoại, ngày tạo tài khoản, số đơn hàng, và tổng tiền chi tiêu.

---
## CÁC TÍNH NĂNG NÂNG CAO VÀ ĐIỂM CỘNG

### Tính Năng Nâng Cao Được Triển Khai

Ứng dụng DaisyDrape được phát triển với nhiều tính năng nâng cao vượt quá yêu cầu cơ bản, giúp nâng cao điểm số của dự án. Thứ nhất, ứng dụng triển khai Admin Dashboard hoàn chỉnh với các tab quản lý toàn diện bao gồm thống kê doanh số, quản lý đơn hàng, quản lý sản phẩm, và quản lý người dùng. Điều này cho phép quản trị viên có cái nhìn tổng quan về hoạt động kinh doanh và quản lý hiệu quả.

Thứ hai, ứng dụng sử dụng Context API để quản lý trạng thái toàn cục, giúp chia sẻ dữ liệu giữa các component mà không cần prop drilling. Điều này cải thiện hiệu suất và khả năng bảo trì của code.
Thứ ba, Đã deploy.

## LINK VIDEO DEMO

Video demo của ứng dụng DaisyDrape có thể được xem tại: https://photos.app.goo.gl/bgUj2CcTdpJyuXH5A

Video demo này trình bày các tính năng chính của ứng dụng bao gồm đăng nhập, duyệt sản phẩm, thêm vào giỏ hàng, thanh toán, xem lịch sử đơn hàng, để lại đánh giá, và truy cập Admin Dashboard. Video có độ dài khoảng 5-10 phút, giúp người xem hiểu rõ cách sử dụng ứng dụng.

---

## LINK ONLINE ĐÃ DEPLOY
https://expo.dev/accounts/daisydrape/projects/DaisyDrape/builds/0fb812a8-cf8f-4d41-8e8c-ac4399c33e79

---

## CÔNG THỨC TÍNH TOÁN VÀ CƠ CHẾ HOẠT ĐỘNG

Ứng dụng sử dụng các công thức tính toán để hiển thị thông tin thống kê cho admin. Tổng doanh thu được tính bằng cách cộng tất cả totalPrice từ tất cả đơn hàng trong AsyncStorage. Doanh thu theo ngày được tính bằng cách cộng tất cả totalPrice từ các đơn hàng có ngày tạo bằng ngày cần tính. Sản phẩm bán chạy nhất được xác định bằng cách tính tổng số lượng bán của mỗi sản phẩm từ tất cả đơn hàng, sau đó sắp xếp theo số lượng bán giảm dần. Rating trung bình của sản phẩm được tính bằng cách cộng tất cả rating từ các review của sản phẩm đó rồi chia cho số lượng review.

Admin Dashboard được cập nhật real-time khi người dùng tạo đơn hàng mới hoặc gửi đánh giá. Ứng dụng sử dụng useFocusEffect để tự động tải lại dữ liệu mỗi khi quay lại Admin Dashboard. Bảo mật được đảm bảo bằng cách chỉ cho phép người dùng có role === 'admin' truy cập Admin Dashboard. Nếu người dùng không phải admin, họ sẽ được điều hướng về BuyerTabs, đó là giao diện dành cho người dùng thường.

---

## KẾT LUẬN

DaisyDrape là một ứng dụng thương mại điện tử hoàn chỉnh được xây dựng bằng React Native, cung cấp trải nghiệm mua sắm thân thiện cho người dùng và công cụ quản lý mạnh mẽ cho admin. Ứng dụng sử dụng lưu trữ cục bộ để đảm bảo hiệu suất cao và có thể dễ dàng mở rộng với backend thực tế trong tương lai. Nhóm phát triển đã hoàn thành tất cả các tính năng chính và ứng dụng sẵn sàng để sử dụng. Trong tương lai, dự án có kế hoạch tích hợp backend thực tế, thanh toán trực tuyến, thông báo push, chat hỗ trợ khách hàng, và hỗ trợ đa ngôn ngữ.

---
