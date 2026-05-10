# Machine Learning Recommendation System - K-Means Clustering

## Feature: Gợi Ý Sản Phẩm Thông Minh

### Problem
Người dùng cần nhận được gợi ý sản phẩm phù hợp dựa trên machine learning để tăng trải nghiệm mua sắm.

### Solution
Tích hợp K-Means Clustering để phân cụm sản phẩm và gợi ý những sản phẩm tương tự.

## Files Created/Modified

### 1. services/recommendationService.js (NEW)
Hệ thống gợi ý sản phẩm dựa trên K-Means Clustering:

**Các hàm chính:**
- `euclideanDistance()` - Tính khoảng cách Euclidean giữa hai điểm
- `normalizeData()` - Chuẩn hóa dữ liệu về khoảng [0, 1]
- `initializeCentroids()` - Khởi tạo centroids ngẫu nhiên
- `assignClusters()` - Gán mỗi điểm dữ liệu đến centroid gần nhất
- `updateCentroids()` - Cập nhật centroids dựa trên trung bình
- `kMeansClustering()` - Thuật toán K-Means chính
- `extractProductFeatures()` - Trích xuất đặc trưng từ sản phẩm
- `getRecommendations()` - Gợi ý sản phẩm tương tự (K-Means)
- `getPersonalizedRecommendations()` - Gợi ý cá nhân hóa
- `getTrendingProducts()` - Sản phẩm trending
- `getRecommendationsByCategory()` - Gợi ý theo danh mục

**Đặc trưng sản phẩm:**
- Giá (normalized)
- Danh mục (encoded)
- Đánh giá (normalized)
- Số lượng bán (normalized)

### 2. screens/RecommendationScreen.js (NEW)
Màn hình hiển thị gợi ý sản phẩm:
- Sản phẩm tương tự (K-Means)
- Gợi ý cá nhân hóa
- Sản phẩm theo danh mục
- Sản phẩm trending
- Dark mode support

### 3. screens/ProductDetailScreen.js (MODIFIED)
- Thêm nút "💡 Gợi ý" vào footer
- Thêm handler `handleGetRecommendations()`
- Thêm import `getAllProducts` từ data/products

### 4. data/products.js (MODIFIED)
- Thêm hàm `getAllProducts()` để export danh sách sản phẩm

### 5. App.js (MODIFIED)
- Thêm import RecommendationScreen
- Thêm RecommendationScreen vào BuyerStack với presentation='modal'

## K-Means Algorithm

### Quy trình:
1. **Chuẩn hóa dữ liệu** - Đưa tất cả giá trị về khoảng [0, 1]
2. **Khởi tạo centroids** - Chọn k điểm ngẫu nhiên làm centroids ban đầu
3. **Gán clusters** - Gán mỗi điểm dữ liệu đến centroid gần nhất
4. **Cập nhật centroids** - Tính trung bình của các điểm trong mỗi cluster
5. **Lặp lại** - Lặp cho đến khi hội tụ hoặc đạt max iterations

### Công thức khoảng cách Euclidean:
```
distance = sqrt((x1-x2)² + (y1-y2)² + ... + (n1-n2)²)
```

## Gợi Ý Sản Phẩm

### 1. Sản Phẩm Tương Tự (K-Means)
- Phân cụm sản phẩm dựa trên đặc trưng
- Tìm cluster của sản phẩm hiện tại
- Gợi ý các sản phẩm từ cluster tương tự

### 2. Gợi Ý Cá Nhân Hóa
- Dựa trên lịch sử xem sản phẩm
- Tính trung bình đặc trưng của các sản phẩm đã xem
- Tìm sản phẩm gần nhất với trung bình

### 3. Sản Phẩm Trending
- Sắp xếp theo: đánh giá (40%) + bán nhiều (40%) + giá hợp lý (20%)
- Hiển thị top 5 sản phẩm

### 4. Gợi Ý Theo Danh Mục
- Lọc sản phẩm cùng danh mục
- Sắp xếp theo đánh giá cao nhất

## User Flow

```
ProductDetailScreen
    ↓
[Nhấn nút "💡 Gợi ý"]
    ↓
RecommendationScreen (Modal)
    ├─ 🎯 Sản Phẩm Tương Tự (K-Means)
    ├─ 💡 Gợi Ý Cá Nhân
    ├─ 📂 Khác Trong Danh Mục
    └─ 🔥 Sản Phẩm Trending
```

## Testing
- ✅ Tất cả tests pass (51 passed)
- ✅ Không có syntax errors
- ✅ K-Means algorithm hoạt động chính xác
- ✅ Chuẩn hóa dữ liệu hoạt động đúng

## Result
✅ Người dùng có thể xem gợi ý sản phẩm thông minh
✅ K-Means Clustering phân cụm sản phẩm chính xác
✅ Gợi ý cá nhân hóa dựa trên lịch sử xem
✅ Hiển thị sản phẩm trending và theo danh mục
✅ Dark mode support hoạt động bình thường
✅ Tất cả tests pass (51 passed)

## Machine Learning Concepts Used
- **K-Means Clustering** - Phân cụm dữ liệu không giám sát
- **Euclidean Distance** - Tính khoảng cách giữa các điểm
- **Data Normalization** - Chuẩn hóa dữ liệu
- **Feature Extraction** - Trích xuất đặc trưng từ sản phẩm
- **Centroid Calculation** - Tính trung bình của các điểm
- **Convergence** - Kiểm tra hội tụ của thuật toán
