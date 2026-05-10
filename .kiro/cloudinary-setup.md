# Hướng dẫn Cấu hình Cloudinary

## Bước 1: Tạo tài khoản Cloudinary
1. Truy cập https://cloudinary.com/
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

## Bước 2: Lấy Cloud Name
1. Đăng nhập vào Cloudinary Dashboard
2. Tìm **Cloud Name** ở phần "Account Details"
3. Copy giá trị này

## Bước 3: Tạo Upload Preset
1. Vào **Settings** → **Upload**
2. Scroll xuống tìm **Upload presets**
3. Click **Add upload preset**
4. Điền:
   - **Name**: `daisy_drape_products` (hoặc tên khác)
   - **Unsigned**: Bật (để có thể upload từ app mà không cần API key)
   - **Folder**: `daisy-drape/products` (tùy chọn)
5. Click **Save**
6. Copy tên Upload Preset

## Bước 4: Cập nhật cloudinaryService.js
Mở file `services/cloudinaryService.js` và thay đổi:

```javascript
const CLOUD_NAME = 'YOUR_CLOUD_NAME'; // Thay bằng Cloud Name của bạn
const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // Thay bằng Upload Preset của bạn
```

Ví dụ:
```javascript
const CLOUD_NAME = 'daisydrape123';
const UPLOAD_PRESET = 'daisy_drape_products';
```

## Bước 5: Test Upload
1. Reload app trong Expo Go (nhấn `r`)
2. Vào Admin → Products
3. Click "Thêm sản phẩm"
4. Click "Chọn ảnh từ thiết bị"
5. Chọn ảnh từ thiết bị
6. Ảnh sẽ được upload lên Cloudinary tự động

## Lưu ý
- Upload Preset phải là **Unsigned** để app có thể upload mà không cần API key
- Nếu gặp lỗi "Upload failed", kiểm tra:
  - Cloud Name có đúng không?
  - Upload Preset có đúng không?
  - Upload Preset có bật Unsigned không?
  - Kết nối internet có bình thường không?

## Tùy chọn nâng cao
- Bạn có thể cấu hình transformations trong Cloudinary để tự động resize/optimize ảnh
- Có thể thêm watermark cho ảnh sản phẩm
- Có thể bật auto-tagging để phân loại ảnh tự động
