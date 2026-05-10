# Requirements Document

## Introduction

Daisy Drape là ứng dụng mobile bán quần áo nữ xây dựng bằng React Native (Expo). Ứng dụng cho phép người dùng duyệt sản phẩm, quản lý danh sách yêu thích, thêm sản phẩm vào giỏ hàng, thanh toán và xem lịch sử đơn hàng. Toàn bộ dữ liệu được lưu trữ cục bộ bằng AsyncStorage.

## Glossary

- **App**: Ứng dụng Daisy Drape
- **HomeScreen**: Màn hình chính hiển thị danh sách sản phẩm
- **WishlistScreen**: Màn hình danh sách yêu thích
- **CartScreen**: Màn hình giỏ hàng
- **ProfileScreen**: Màn hình hồ sơ người dùng và lịch sử đơn hàng
- **ProductCard**: Component hiển thị thông tin một sản phẩm
- **StorageService**: Module xử lý toàn bộ thao tác đọc/ghi AsyncStorage
- **AsyncStorage**: Bộ nhớ cục bộ của thiết bị dùng để lưu dữ liệu
- **Cart**: Giỏ hàng chứa danh sách sản phẩm người dùng muốn mua
- **Wishlist**: Danh sách sản phẩm yêu thích của người dùng
- **Order**: Đơn hàng đã được thanh toán
- **User**: Người dùng đã đăng nhập vào ứng dụng

## Requirements

### Requirement 1: Hiển thị danh sách sản phẩm

**User Story:** As a shopper, I want to browse women's clothing products in a grid layout, so that I can quickly find items I'm interested in.

#### Acceptance Criteria

1. THE HomeScreen SHALL display products in a 2-column grid layout.
2. THE ProductCard SHALL display the product image, name, and price for each product.
3. WHEN the HomeScreen is loaded, THE App SHALL render all available products from the static product data.
4. THE HomeScreen SHALL include a header displaying "Daisy Drape 🌸".
5. THE App SHALL apply a pink and white color scheme across all screens.

---

### Requirement 2: Tìm kiếm sản phẩm realtime

**User Story:** As a shopper, I want to search for products by name in real time, so that I can quickly find specific items without scrolling.

#### Acceptance Criteria

1. THE HomeScreen SHALL include a search input field.
2. WHEN the user types in the search field, THE HomeScreen SHALL filter and display only products whose names contain the search text (case-insensitive).
3. WHEN the search field is empty, THE HomeScreen SHALL display all available products.

---

### Requirement 3: Quản lý danh sách yêu thích

**User Story:** As a shopper, I want to save products to a wishlist, so that I can revisit items I like later.

#### Acceptance Criteria

1. WHEN the user taps the wishlist button on a ProductCard, THE App SHALL add the product to the Wishlist.
2. WHEN the user taps the wishlist button on a product already in the Wishlist, THE App SHALL remove the product from the Wishlist.
3. THE WishlistScreen SHALL display all products currently saved in the Wishlist.
4. WHEN the Wishlist is modified, THE StorageService SHALL persist the updated Wishlist to AsyncStorage using the key "WISHLIST" as a JSON string.
5. WHEN the App is launched, THE StorageService SHALL load the Wishlist from AsyncStorage key "WISHLIST" and parse it from JSON.
6. IF the AsyncStorage read for "WISHLIST" fails, THEN THE StorageService SHALL return an empty array.

---

### Requirement 4: Quản lý giỏ hàng

**User Story:** As a shopper, I want to manage items in my cart, so that I can control what I purchase before checking out.

#### Acceptance Criteria

1. WHEN the user taps "Add to Cart" on a ProductCard, THE App SHALL add the product to the Cart with a quantity of 1.
2. WHEN the user taps "Add to Cart" on a product already in the Cart, THE App SHALL increment the product's quantity by 1.
3. WHEN a product is added to the Cart, THE App SHALL display an Alert confirming the product was added.
4. THE CartScreen SHALL display each cart item with its image, name, unit price, and current quantity.
5. WHEN the user taps the increase button on a cart item, THE CartScreen SHALL increment that item's quantity by 1.
6. WHEN the user taps the decrease button on a cart item with quantity greater than 1, THE CartScreen SHALL decrement that item's quantity by 1.
7. WHEN the user taps the decrease button on a cart item with quantity equal to 1, THE CartScreen SHALL remove that item from the Cart.
8. THE CartScreen SHALL display the total price calculated as the sum of (unit price × quantity) for all cart items.
9. WHEN the Cart is modified, THE StorageService SHALL persist the updated Cart to AsyncStorage using the key "CART" as a JSON string.
10. WHEN the App is launched, THE StorageService SHALL load the Cart from AsyncStorage key "CART" and parse it from JSON.
11. IF the AsyncStorage read for "CART" fails, THEN THE StorageService SHALL return an empty array.

---

### Requirement 5: Thanh toán đơn hàng

**User Story:** As a shopper, I want to checkout my cart, so that I can place an order for the items I selected.

#### Acceptance Criteria

1. THE CartScreen SHALL include a "Checkout" button.
2. WHEN the user taps "Checkout" and the Cart is not empty, THE App SHALL create a new Order containing the current cart items, total price, and a timestamp.
3. WHEN an Order is created, THE StorageService SHALL append the Order to the Orders list and persist it to AsyncStorage using the key "ORDERS" as a JSON string.
4. WHEN an Order is successfully saved, THE StorageService SHALL clear the Cart and persist the empty Cart to AsyncStorage using the key "CART".
5. WHEN checkout is successful, THE App SHALL display an Alert confirming the order was placed successfully.
6. IF the Cart is empty when the user taps "Checkout", THEN THE App SHALL display an Alert informing the user the cart is empty.

---

### Requirement 6: Đăng nhập người dùng (fake authentication)

**User Story:** As a user, I want to log in with a username and password, so that I can access my profile and order history.

#### Acceptance Criteria

1. THE ProfileScreen SHALL display a login form with username and password input fields when no User is logged in.
2. WHEN the user submits the login form with a non-empty username and non-empty password, THE App SHALL authenticate the user and save the User object to AsyncStorage using the key "USER" as a JSON string.
3. WHEN the user is logged in, THE ProfileScreen SHALL display the username and a logout button.
4. WHEN the user taps "Logout", THE App SHALL remove the User from AsyncStorage and return to the login form.
5. IF the login form is submitted with an empty username or empty password, THEN THE App SHALL display an Alert requesting the user to fill in all fields.
6. WHEN the App is launched, THE StorageService SHALL load the User from AsyncStorage key "USER" and parse it from JSON.
7. IF the AsyncStorage read for "USER" fails, THEN THE StorageService SHALL return null.

---

### Requirement 7: Xem lịch sử đơn hàng

**User Story:** As a logged-in user, I want to view my order history, so that I can track my past purchases.

#### Acceptance Criteria

1. WHEN the user is logged in, THE ProfileScreen SHALL display the list of past Orders loaded from AsyncStorage key "ORDERS".
2. THE ProfileScreen SHALL display each Order with its order number, date, list of items, and total price.
3. WHEN the App is launched, THE StorageService SHALL load Orders from AsyncStorage key "ORDERS" and parse it from JSON.
4. IF the AsyncStorage read for "ORDERS" fails, THEN THE StorageService SHALL return an empty array.

---

### Requirement 8: Lưu trữ dữ liệu cục bộ (StorageService)

**User Story:** As a developer, I want a centralized storage service, so that all AsyncStorage operations are consistent and maintainable.

#### Acceptance Criteria

1. THE StorageService SHALL expose async functions for get and set operations for each AsyncStorage key: "CART", "WISHLIST", "USER", "ORDERS".
2. THE StorageService SHALL use JSON.stringify before writing any value to AsyncStorage.
3. THE StorageService SHALL use JSON.parse after reading any value from AsyncStorage.
4. THE StorageService SHALL use async/await syntax for all AsyncStorage operations.
5. THE StorageService SHALL wrap all AsyncStorage operations in try/catch blocks.
6. IF an AsyncStorage write operation fails, THEN THE StorageService SHALL log the error to the console.

---

### Requirement 9: Điều hướng Bottom Tab

**User Story:** As a user, I want to navigate between screens using a bottom tab bar, so that I can easily switch between app sections.

#### Acceptance Criteria

1. THE App SHALL include a Bottom Tab Navigator with four tabs: Home, Wishlist, Cart, and Profile.
2. THE App SHALL display appropriate icons for each tab in the Bottom Tab Navigator.
3. THE App SHALL use a pink color scheme for the active tab indicator.
4. THE App SHALL use react-native-safe-area-context to handle safe area insets on all screens.

---

### Requirement 10: UI/UX – Bo góc, shadow, thiết kế giống app thật

**User Story:** As a user, I want a polished and visually appealing UI, so that the app feels professional and enjoyable to use.

#### Acceptance Criteria

1. THE ProductCard SHALL apply rounded corners (borderRadius) and shadow/elevation styling.
2. THE App SHALL use a consistent pink and white color palette across all screens and components.
3. THE CartScreen SHALL display cart items with rounded card styling and shadow/elevation.
4. THE WishlistScreen SHALL display wishlist items with rounded card styling and shadow/elevation.
