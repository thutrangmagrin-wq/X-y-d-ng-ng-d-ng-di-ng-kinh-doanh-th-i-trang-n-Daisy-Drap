# BÁO CÁO CHUYÊN ĐỀ HỌC PHẦN LẬP TRÌNH TRÊN THIẾT BỊ DI ĐỘNG

## TÊN ĐỀ TÀI

Ứng dụng thương mại điện tử thời trang DaisyDrape trên nền tảng React Native

---

## GIỚI THIỆU WEBSITE/HỆ THỐNG

DaisyDrape là một ứng dụng di động thương mại điện tử chuyên về bán hàng thời trang. Ứng dụng được phát triển bằng React Native và Expo, cho phép người dùng duyệt, tìm kiếm, và mua sắm các sản phẩm thời trang một cách dễ dàng. Hệ thống bao gồm hai phần chính: giao diện người dùng thường dành cho khách hàng mua sắm, và bảng điều khiển quản lý dành cho quản trị viên. Người dùng có thể tạo tài khoản, duyệt sản phẩm, thêm vào giỏ hàng, quản lý danh sách yêu thích, thực hiện thanh toán, xem lịch sử đơn hàng, và để lại đánh giá cho sản phẩm. Admin có thể xem thống kê doanh số, quản lý đơn hàng, sản phẩm, và người dùng thông qua một bảng điều khiển toàn diện.

---

## DANH SÁCH THÀNH VIÊN

Nhóm phát triển DaisyDrape bao gồm các thành viên sau:

**Thành viên 1:** [Họ và tên] - Vai trò: Trưởng nhóm, phát triển Frontend chính

**Thành viên 2:** [Họ và tên] - Vai trò: Phát triển giao diện người dùng

**Thành viên 3:** [Họ và tên] - Vai trò: Phát triển Admin Dashboard

**Thành viên 4:** [Họ và tên] - Vai trò: Quản lý dữ liệu và testing

---

## MSSV TỪng THÀNH VIÊN

Mã số sinh viên của các thành viên trong nhóm như sau:

**Thành viên 1:** [Họ và tên] - MSSV: [Mã số]

**Thành viên 2:** [Họ và tên] - MSSV: [Mã số]

**Thành viên 3:** [Họ và tên] - MSSV: [Mã số]

**Thành viên 4:** [Họ và tên] - MSSV: [Mã số]

---

## PHÂN CÔNG NHIỆM VỤ CỤ THỂ

Công việc được phân chia cụ thể như sau:

**Thành viên 1** chịu trách nhiệm về kiến trúc tổng thể của ứng dụng, thiết lập dự án React Native, cấu hình Expo, và phát triển các màn hình chính như HomeScreen, ProductDetailScreen, và CartScreen. Thành viên này cũng quản lý Context API để lưu trữ trạng thái toàn cục của ứng dụng.

**Thành viên 2** tập trung vào phát triển giao diện người dùng, bao gồm thiết kế các component như BannerComponent, ProductCard, và các màn hình liên quan đến hồ sơ cá nhân, danh sách yêu thích, và thanh toán. Thành viên này cũng chịu trách nhiệm về styling và tạo ra giao diện đẹp mắt, thân thiện với người dùng.

**Thành viên 3** phát triển Admin Dashboard với các tab thống kê, quản lý đơn hàng, quản lý sản phẩm, và quản lý người dùng. Thành viên này cũng xây dựng các công thức tính toán doanh số, biểu đồ thống kê, và các tính năng lọc, tìm kiếm cho admin.

**Thành viên 4** quản lý cơ chế lưu trữ dữ liệu bằng AsyncStorage, tạo dữ liệu mẫu cho sản phẩm, viết các test case bằng Jest, và đảm bảo chất lượng của ứng dụng. Thành viên này cũng hỗ trợ các thành viên khác trong việc debug và tối ưu hóa hiệu suất.

---

## CÔNG NGHỆ SỬ DỤNG

### Frontend
Ứng dụng DaisyDrape được xây dựng trên nền tảng React Native phiên bản 0.81.5 với Expo phiên bản 54.0.34 làm nền tảng phát triển chính. React Navigation phiên bản 7.1.6 được sử dụng để quản lý điều hướng giữa các màn hình, bao gồm Bottom Tabs Navigation cho menu chính và Stack Navigation cho các màn hình chi tiết. AsyncStorage phiên bản 2.2.0 được sử dụng để lưu trữ tất cả dữ liệu cục bộ trên thiết bị người dùng. Expo Linear Gradient phiên bản 55.0.13 được sử dụng để tạo các gradient đẹp mắt trong giao diện. Expo Image Picker phiên bản 17.0.11 cho phép người dùng chọn ảnh từ thư viện thiết bị. Cloudinary được tích hợp để quản lý và lưu trữ ảnh sản phẩm. Jest phiên bản 29.7.0 được sử dụng làm testing framework để viết và chạy các test case. React Test Renderer phiên bản 19.1.0 được sử dụng để render component trong test. Babel được cấu hình để transpile code React Native thành JavaScript có thể chạy được.

### Backend
Backend API được xây dựng bằng Node.js với Express.js phiên bản 4.18.2 làm framework chính. CORS phiên bản 2.8.5 được sử dụng để xử lý cross-origin requests. Bcryptjs phiên bản 2.4.3 được sử dụng để mã hóa mật khẩu người dùng. JWT (jsonwebtoken) phiên bản 9.0.0 được sử dụng để xác thực người dùng. Mongoose phiên bản 7.0.0 được sử dụng để kết nối và quản lý MongoDB. Multer phiên bản 1.4.5 được sử dụng để xử lý upload file. Cloudinary được tích hợp để lưu trữ ảnh trên cloud. Express Validator phiên bản 7.0.0 được sử dụng để xác thực dữ liệu đầu vào. Nodemon được sử dụng trong quá trình phát triển để tự động khởi động lại server khi có thay đổi code.

---

## HƯỚNG DẪN CÀI ĐẶT

### Frontend
Để cài đặt dự án DaisyDrape frontend, trước tiên cần đảm bảo hệ thống có Node.js phiên bản 16 trở lên, npm hoặc yarn, và Expo CLI được cài đặt. Bước đầu tiên là clone dự án từ repository bằng lệnh git clone, sau đó chuyển vào thư mục DaisyDrape. Tiếp theo, chạy lệnh npm install để cài đặt tất cả các dependencies được liệt kê trong file package.json. Quá trình cài đặt sẽ tải xuống tất cả các thư viện cần thiết bao gồm React Native, Expo, React Navigation, AsyncStorage, và các thư viện khác. Sau khi cài đặt hoàn tất, dự án sẽ sẵn sàng để chạy trên các nền tảng khác nhau.

### Backend
Để cài đặt backend API, chuyển vào thư mục DaisyDrape/backend và chạy lệnh npm install để cài đặt tất cả dependencies. Tạo file .env bằng cách copy từ .env.example và cấu hình các biến môi trường như PORT, JWT_SECRET, và MONGODB_URI. Sau khi cài đặt hoàn tất, backend sẽ sẵn sàng để chạy.

---

## HƯỚNG DẪN CHẠY PROJECT

### Frontend
Để chạy ứng dụng DaisyDrape frontend, sử dụng lệnh npm start để khởi động Expo development server. Lệnh này sẽ hiển thị một QR code mà bạn có thể quét bằng ứng dụng Expo Go trên điện thoại để xem ứng dụng chạy trực tiếp. Để chạy trên Android, sử dụng lệnh npm run android, điều này sẽ khởi động Android emulator hoặc kết nối với thiết bị Android thực tế nếu có. Để chạy trên iOS, sử dụng lệnh npm run ios, tuy nhiên điều này chỉ có thể thực hiện trên máy Mac. Để chạy trên web, sử dụng lệnh npm run web, ứng dụng sẽ mở trong trình duyệt web. Để chạy các test case, sử dụng lệnh npm test để chạy tất cả test một lần, hoặc npm run test:watch để chạy ở chế độ watch, tự động chạy lại test khi có thay đổi trong code.

### Backend
Để chạy backend API, chuyển vào thư mục DaisyDrape/backend. Trong chế độ phát triển, sử dụng lệnh npm run dev để khởi động server với nodemon, server sẽ tự động khởi động lại khi có thay đổi code. Trong chế độ production, sử dụng lệnh npm start để khởi động server. Server sẽ chạy trên cổng được định nghĩa trong file .env, mặc định là cổng 5000. Bạn có thể kiểm tra xem server đã chạy thành công bằng cách truy cập http://localhost:5000/api/health.

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

## LINK VIDEO DEMO

Video demo của ứng dụng DaisyDrape có thể được xem tại: [Chèn link YouTube hoặc link video demo tại đây]

Video demo này trình bày các tính năng chính của ứng dụng bao gồm đăng nhập, duyệt sản phẩm, thêm vào giỏ hàng, thanh toán, xem lịch sử đơn hàng, để lại đánh giá, và truy cập Admin Dashboard. Video có độ dài khoảng 5-10 phút, giúp người xem hiểu rõ cách sử dụng ứng dụng.

---

## LINK ONLINE ĐÃ DEPLOY

Ứng dụng DaisyDrape hiện chưa được deploy lên server online. Tuy nhiên, ứng dụng có thể được chạy trên Expo Go bằng cách quét QR code từ lệnh npm start. Để deploy ứng dụng lên production, có thể sử dụng các dịch vụ như Expo Application Services (EAS) hoặc build APK/IPA để phân phối trên Google Play Store hoặc Apple App Store. Hiện tại, ứng dụng chỉ có thể chạy trên môi trường phát triển cục bộ hoặc thông qua Expo Go.

---

## CÔNG THỨC TÍNH TOÁN VÀ CƠ CHẾ HOẠT ĐỘNG

Ứng dụng sử dụng các công thức tính toán để hiển thị thông tin thống kê cho admin. Tổng doanh thu được tính bằng cách cộng tất cả totalPrice từ tất cả đơn hàng trong AsyncStorage. Doanh thu theo ngày được tính bằng cách cộng tất cả totalPrice từ các đơn hàng có ngày tạo bằng ngày cần tính. Sản phẩm bán chạy nhất được xác định bằng cách tính tổng số lượng bán của mỗi sản phẩm từ tất cả đơn hàng, sau đó sắp xếp theo số lượng bán giảm dần. Rating trung bình của sản phẩm được tính bằng cách cộng tất cả rating từ các review của sản phẩm đó rồi chia cho số lượng review.

Admin Dashboard được cập nhật real-time khi người dùng tạo đơn hàng mới hoặc gửi đánh giá. Ứng dụng sử dụng useFocusEffect để tự động tải lại dữ liệu mỗi khi quay lại Admin Dashboard. Bảo mật được đảm bảo bằng cách chỉ cho phép người dùng có role === 'admin' truy cập Admin Dashboard. Nếu người dùng không phải admin, họ sẽ được điều hướng về BuyerTabs, đó là giao diện dành cho người dùng thường.

---

## CÁC TÍNH NĂNG NÂNG CAO VÀ ĐIỂM CỘNG

### Tính Năng Nâng Cao Được Triển Khai

Ứng dụng DaisyDrape được phát triển với nhiều tính năng nâng cao vượt quá yêu cầu cơ bản, giúp nâng cao điểm số của dự án. Thứ nhất, ứng dụng triển khai Admin Dashboard hoàn chỉnh với các tab quản lý toàn diện bao gồm thống kê doanh số, quản lý đơn hàng, quản lý sản phẩm, và quản lý người dùng. Điều này cho phép quản trị viên có cái nhìn tổng quan về hoạt động kinh doanh và quản lý hiệu quả.

Thứ hai, ứng dụng sử dụng Context API để quản lý trạng thái toàn cục, giúp chia sẻ dữ liệu giữa các component mà không cần prop drilling. Điều này cải thiện hiệu suất và khả năng bảo trì của code.

Thứ ba, ứng dụng triển khai hệ thống đánh giá sản phẩm 5 sao với bình luận chi tiết từ khách hàng. Người dùng có thể xem đánh giá từ những khách hàng khác trước khi quyết định mua hàng, giúp tăng độ tin cậy của ứng dụng.

Thứ tư, ứng dụng hỗ trợ danh sách yêu thích, cho phép người dùng lưu các sản phẩm yêu thích để mua sau. Tính năng này được lưu trữ cục bộ bằng AsyncStorage, giúp người dùng không mất dữ liệu khi tắt ứng dụng.

Thứ năm, ứng dụng triển khai hệ thống thanh toán với lựa chọn địa chỉ giao hàng và phương thức thanh toán. Người dùng có thể quản lý nhiều địa chỉ giao hàng và chọn phương thức thanh toán phù hợp.

Thứ sáu, ứng dụng sử dụng banner carousel tự động chuyển ảnh, tạo giao diện động và hấp dẫn. Carousel này tự động chuyển giữa các ảnh quảng cáo mỗi vài giây.

Thứ bảy, ứng dụng triển khai tính năng tìm kiếm sản phẩm theo tên, giúp người dùng nhanh chóng tìm thấy sản phẩm mong muốn.

Thứ tám, ứng dụng sử dụng Expo Linear Gradient để tạo các gradient đẹp mắt trong giao diện, đặc biệt là trong section "Về DaisyDrape" với thiết kế Galaxy tối trầm.

Thứ chín, ứng dụng triển khai hệ thống quản lý giỏ hàng hoàn chỉnh với khả năng thêm, xóa, và cập nhật số lượng sản phẩm. Giỏ hàng được lưu trữ cục bộ, giúp người dùng không mất dữ liệu.

Thứ mười, ứng dụng sử dụng Jest để viết test case, đảm bảo chất lượng của code và giúp phát hiện lỗi sớm.

### Điểm Cộng Từ Các Tính Năng Nâng Cao

Các tính năng nâng cao này mang lại những lợi ích sau:

**Trải Nghiệm Người Dùng Tốt Hơn:** Admin Dashboard cung cấp công cụ quản lý mạnh mẽ, giúp quản trị viên quản lý kinh doanh hiệu quả. Hệ thống đánh giá sản phẩm giúp người dùng đưa ra quyết định mua hàng tốt hơn. Danh sách yêu thích cho phép người dùng lưu sản phẩm yêu thích để mua sau.

**Hiệu Suất Cao:** Sử dụng Context API giúp giảm re-render không cần thiết, cải thiện hiệu suất ứng dụng. Lưu trữ cục bộ bằng AsyncStorage giúp ứng dụng hoạt động nhanh hơn so với gọi API từ server.

**Giao Diện Đẹp Mắt:** Sử dụng Expo Linear Gradient tạo các gradient đẹp mắt. Banner carousel tự động chuyển ảnh tạo giao diện động và hấp dẫn.

**Tính Năng Đầy Đủ:** Ứng dụng cung cấp tất cả các tính năng cần thiết cho một ứng dụng thương mại điện tử hoàn chỉnh, từ duyệt sản phẩm đến thanh toán và quản lý đơn hàng.

**Chất Lượng Code:** Sử dụng Jest để viết test case đảm bảo chất lượng của code và giúp phát hiện lỗi sớm.

### Hướng Phát Triển Tương Lai Để Nâng Cao Điểm Thêm

Để nâng cao điểm số thêm trong tương lai, nhóm có kế hoạch triển khai các tính năng sau:

**Tích Hợp Backend Thực Tế:** Kết nối ứng dụng với API backend thực tế để lưu trữ dữ liệu trên server thay vì cục bộ. Điều này cho phép ứng dụng hoạt động trên nhiều thiết bị và đồng bộ dữ liệu.

**Thanh Toán Trực Tuyến:** Tích hợp các cổng thanh toán như Stripe, Momo, ZaloPay để hỗ trợ thanh toán trực tuyến an toàn.

**Thông Báo Push:** Triển khai thông báo push để cập nhật trạng thái đơn hàng cho người dùng, giúp họ luôn cập nhật thông tin.

**Chat Hỗ Trợ Khách Hàng:** Tích hợp chat real-time để hỗ trợ khách hàng, giúp giải quyết vấn đề nhanh chóng.

**Đánh Giá Nâng Cao:** Cho phép người dùng thêm ảnh và video vào đánh giá, giúp đánh giá chi tiết hơn.

**Hệ Thống Khuyến Mãi:** Triển khai mã giảm giá, flash sale, và các chương trình khuyến mãi khác để tăng doanh số.

**Hỗ Trợ Đa Ngôn Ngữ:** Hỗ trợ tiếng Anh, tiếng Trung, và các ngôn ngữ khác để mở rộng thị trường.

**Tối Ưu Hóa Hiệu Suất:** Sử dụng React.memo, useMemo, useCallback để tối ưu hóa hiệu suất ứng dụng.

**Bảo Mật Nâng Cao:** Triển khai xác thực hai yếu tố, mã hóa dữ liệu nhạy cảm, và các biện pháp bảo mật khác.

---

## KẾT LUẬN

DaisyDrape là một ứng dụng thương mại điện tử hoàn chỉnh được xây dựng bằng React Native, cung cấp trải nghiệm mua sắm thân thiện cho người dùng và công cụ quản lý mạnh mẽ cho admin. Ứng dụng sử dụng lưu trữ cục bộ để đảm bảo hiệu suất cao và có thể dễ dàng mở rộng với backend thực tế trong tương lai. Nhóm phát triển đã hoàn thành tất cả các tính năng chính và ứng dụng sẵn sàng để sử dụng. Với các tính năng nâng cao như Admin Dashboard, hệ thống đánh giá sản phẩm, danh sách yêu thích, và giao diện đẹp mắt, ứng dụng DaisyDrape vượt quá yêu cầu cơ bản và sẵn sàng cho các nâng cấp trong tương lai.

---

**Ngày hoàn thành:** Tháng 05, 2026  
**Trạng thái:** Hoàn thành phiên bản 1.0.0  
**Giảng viên hướng dẫn:** [Tên giảng viên]  
**Lớp/Khóa:** [Lớp] - Khóa 2019-2024
