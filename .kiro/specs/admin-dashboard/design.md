# Design Document: Admin Dashboard for DaisyDrape

## Overview

The Admin Dashboard is a comprehensive management interface for DaisyDrape administrators to monitor business metrics, manage products, customers, and orders. It provides real-time statistics, data visualization, and CRUD operations for core business entities. The dashboard serves as the central hub for all administrative tasks, enabling admins to make data-driven decisions and efficiently manage the e-commerce platform.

The dashboard includes four main sections:
1. **Dashboard (Statistics)** - Real-time metrics and charts
2. **Product Management** - CRUD operations with search/filter
3. **Customer Management** - Customer list with account controls
4. **Order Management** - Order tracking and status updates

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           AdminDashboardScreen (Main)                    │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Tab Navigation:                                    │  │  │
│  │  │  - Dashboard (Statistics)                          │  │  │
│  │  │  - Products                                        │  │  │
│  │  │  - Customers                                       │  │  │
│  │  │  - Orders                                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         │                  │                  │                │
│    ┌────▼────┐      ┌─────▼──────┐    ┌─────▼──────┐         │
│    │ Storage  │      │  Sub-Tabs  │    │ Components │         │
│    │ Service  │      │  (consume) │    │ (consume)  │         │
│    └──────────┘      └────────────┘    └────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Admin navigates to Dashboard** → AdminDashboardScreen loads
2. **Load statistics data** → Fetch from storage/API
3. **Display metrics & charts** → Render statistics tab
4. **Admin selects tab** → Switch between Products/Customers/Orders
5. **Load tab data** → Fetch relevant data from storage
6. **Display list/table** → Render with search/filter options
7. **Admin performs action** → Add/Edit/Delete/Update status
8. **Persist changes** → Save to storage and update UI

---

## Components and Interfaces

### 1. AdminDashboardScreen (Main Container)

**Location:** `screens/admin/AdminDashboardScreen.js`

**Responsibilities:**
- Manage tab navigation between Dashboard, Products, Customers, Orders
- Load and cache data for all sections
- Handle user authentication/authorization
- Provide header with admin info and logout

**Interface:**

```javascript
interface AdminDashboardScreen {
  user: User                    // Admin user object
  onLogout: () => void         // Logout callback
}

// State
{
  activeTab: 'dashboard' | 'products' | 'customers' | 'orders'
  loading: boolean
  refreshing: boolean
  error: string | null
}
```

**Key Methods:**
- `handleTabChange(tab)`: Switch active tab
- `handleRefresh()`: Reload data for current tab
- `handleLogout()`: Logout and return to login screen

### 2. DashboardTab (Statistics & Charts)

**Location:** `screens/admin/tabs/DashboardTab.js`

**Responsibilities:**
- Display key metrics (total orders, total customers, total products, revenue)
- Render revenue chart (line/bar chart)
- Display recent orders table
- Calculate statistics from stored data

**Interface:**

```javascript
interface DashboardTab {
  products: Product[]
  customers: Customer[]
  orders: Order[]
}

interface Statistics {
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  totalRevenue: number
  recentOrders: Order[]
}

interface ChartData {
  labels: string[]           // Dates or time periods
  datasets: {
    label: string
    data: number[]          // Revenue values
    borderColor: string
    backgroundColor: string
  }[]
}
```

**Key Methods:**
- `calculateStatistics()`: Compute metrics from data
- `generateChartData()`: Prepare data for chart rendering
- `formatCurrency(amount)`: Format numbers as currency

### 3. ProductsTab (Product Management)

**Location:** `screens/admin/tabs/ProductsTab.js`

**Responsibilities:**
- Display product list in table format
- Provide search and filter functionality
- Handle add/edit/delete product operations
- Show product details modal

**Interface:**

```javascript
interface ProductsTab {
  products: Product[]
  onAddProduct: (product: Product) => void
  onEditProduct: (id: string, updates: Partial<Product>) => void
  onDeleteProduct: (id: string) => void
}

interface ProductListState {
  searchQuery: string
  filteredProducts: Product[]
  selectedProduct: Product | null
  showModal: boolean
  modalMode: 'add' | 'edit'
}
```

**Key Methods:**
- `handleSearch(query)`: Filter products by name/category
- `handleAddProduct()`: Open add product modal
- `handleEditProduct(product)`: Open edit product modal
- `handleDeleteProduct(id)`: Delete product with confirmation
- `handleSaveProduct(product)`: Save new or edited product
- `filterProducts(query)`: Search and filter logic

### 4. CustomersTab (Customer Management)

**Location:** `screens/admin/tabs/CustomersTab.js`

**Responsibilities:**
- Display customer list in table format
- Show customer details (name, email, phone, join date)
- Provide lock/unlock account functionality
- Display customer statistics

**Interface:**

```javascript
interface CustomersTab {
  customers: Customer[]
  onLockCustomer: (id: string) => void
  onUnlockCustomer: (id: string) => void
  onViewDetails: (customer: Customer) => void
}

interface CustomerListState {
  searchQuery: string
  filteredCustomers: Customer[]
  selectedCustomer: Customer | null
  showDetailsModal: boolean
}
```

**Key Methods:**
- `handleSearch(query)`: Filter customers by name/email
- `handleLockAccount(id)`: Lock customer account
- `handleUnlockAccount(id)`: Unlock customer account
- `handleViewDetails(customer)`: Show customer details modal
- `filterCustomers(query)`: Search logic

### 5. OrdersTab (Order Management)

**Location:** `screens/admin/tabs/OrdersTab.js`

**Responsibilities:**
- Display order list in table format
- Show order details (ID, customer, total, status, date)
- Provide order status update functionality
- Display order details modal

**Interface:**

```javascript
interface OrdersTab {
  orders: Order[]
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void
  onViewDetails: (order: Order) => void
}

interface OrderListState {
  searchQuery: string
  filteredOrders: Order[]
  selectedOrder: Order | null
  showDetailsModal: boolean
  statusFilter: OrderStatus | 'all'
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
```

**Key Methods:**
- `handleSearch(query)`: Filter orders by ID/customer name
- `handleStatusChange(orderId, newStatus)`: Update order status
- `handleViewDetails(order)`: Show order details modal
- `filterOrders(query, status)`: Search and filter logic

### 6. ProductFormModal (Add/Edit Product)

**Location:** `screens/admin/modals/ProductFormModal.js`

**Responsibilities:**
- Provide form for adding/editing products
- Validate product data
- Handle image upload
- Save product to storage

**Interface:**

```javascript
interface ProductFormModal {
  visible: boolean
  mode: 'add' | 'edit'
  product: Product | null
  onSave: (product: Product) => void
  onCancel: () => void
}

interface ProductFormData {
  name: string
  price: number
  originalPrice: number
  category: string
  description: string
  image: string
  images: string[]
  rating: number
  sold: number
  sizes: string[]
}
```

**Key Methods:**
- `handleImagePick()`: Select image from gallery
- `handleSave()`: Validate and save product
- `validateForm()`: Check required fields and data types

### 7. CustomerDetailsModal (View Customer)

**Location:** `screens/admin/modals/CustomerDetailsModal.js`

**Responsibilities:**
- Display customer information
- Show customer order history
- Provide lock/unlock buttons
- Show account status

**Interface:**

```javascript
interface CustomerDetailsModal {
  visible: boolean
  customer: Customer | null
  orders: Order[]
  onLock: (id: string) => void
  onUnlock: (id: string) => void
  onClose: () => void
}
```

### 8. OrderDetailsModal (View Order)

**Location:** `screens/admin/modals/OrderDetailsModal.js`

**Responsibilities:**
- Display order information
- Show order items with prices
- Provide status update dropdown
- Display customer information

**Interface:**

```javascript
interface OrderDetailsModal {
  visible: boolean
  order: Order | null
  onStatusChange: (status: OrderStatus) => void
  onClose: () => void
}
```

---

## Data Models

### Product Model

```javascript
interface Product {
  id: string                    // Unique identifier
  name: string                  // Product name
  price: number                 // Current price (VND)
  originalPrice: number         // Original price before discount
  image: string                 // Main image URL
  images: string[]              // Additional images
  category: string              // Product category
  description: string           // Product description
  rating: number                // Average rating (0-5)
  sold: number                  // Number sold
  sizes: string[]               // Available sizes
  createdAt: timestamp          // Creation date
  updatedAt: timestamp          // Last update date
}
```

### Customer Model

```javascript
interface Customer {
  id: string                    // Unique identifier
  username: string              // Username
  email: string                 // Email address
  phone: string                 // Phone number
  fullName: string              // Full name
  address: string               // Delivery address
  isLocked: boolean             // Account lock status
  joinDate: timestamp           // Account creation date
  lastLogin: timestamp          // Last login date
  totalOrders: number           // Number of orders
  totalSpent: number            // Total amount spent (VND)
}
```

### Order Model

```javascript
interface Order {
  id: string                    // Unique identifier
  customerId: string            // Customer ID
  customerName: string          // Customer name
  items: OrderItem[]            // Order items
  totalPrice: number            // Total price (VND)
  status: OrderStatus           // Current status
  shippingAddress: string       // Delivery address
  createdAt: timestamp          // Order creation date
  updatedAt: timestamp          // Last update date
}

interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  selectedSize: string
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
```

### Statistics Model

```javascript
interface Statistics {
  totalOrders: number           // Total number of orders
  totalCustomers: number        // Total number of customers
  totalProducts: number         // Total number of products
  totalRevenue: number          // Total revenue (VND)
  recentOrders: Order[]         // Last 5 orders
  dailyRevenue: {               // Revenue by day
    date: string
    amount: number
  }[]
}
```

---

## Correctness Properties

### Property 1: Product Search Correctness

*For any* product list and any search query string, the filtered results should contain only products whose names include the search text (case-insensitive), and should not include products that don't match.

**Validates:** Product search functionality works correctly

**Rationale:** Ensures admins can reliably find products by name

### Property 2: Statistics Calculation Accuracy

*For any* set of orders, the calculated total revenue should equal exactly the sum of all order totals, and the total orders count should equal the number of orders in the list.

**Validates:** Statistics calculations are mathematically correct

**Rationale:** Ensures admins see accurate business metrics

### Property 3: Order Status Update Persistence

*For any* order with status S, updating the status to S' and then reloading should show the new status S' (not revert to S).

**Validates:** Order status changes persist correctly

**Rationale:** Ensures order updates are saved and not lost

### Property 4: Customer Lock/Unlock Idempotence

*For any* customer account, locking and then unlocking should return the account to its original state (unlocked).

**Validates:** Lock/unlock operations are inverses

**Rationale:** Ensures account state management is correct

### Property 5: Product CRUD Round-Trip

*For any* valid product, creating it, reading it back, and then deleting it should result in the product no longer existing in the system.

**Validates:** Product CRUD operations work correctly

**Rationale:** Ensures product management operations are complete and correct

### Property 6: Data Persistence Round-Trip

*For any* valid data (products, customers, orders), saving to storage and then loading should return equivalent data with all properties preserved.

**Validates:** Data persistence works correctly

**Rationale:** Ensures admin changes are durable across app sessions

---

## Error Handling

### Product Not Found

**Scenario:** Admin tries to edit/delete a product that no longer exists

**Handling:**
- Show error alert: "Product not found"
- Refresh product list
- Remove product from UI

**Implementation:**

```javascript
const handleEditProduct = async (productId) => {
  const product = products.find(p => p.id === productId);
  if (!product) {
    Alert.alert('Error', 'Product not found');
    loadProducts();
    return;
  }
  // Continue with edit
};
```

### Invalid Product Data

**Scenario:** Admin submits product form with missing/invalid data

**Handling:**
- Validate all required fields
- Show specific error messages
- Highlight invalid fields
- Prevent form submission

**Implementation:**

```javascript
const validateProduct = (product) => {
  const errors = [];
  if (!product.name?.trim()) errors.push('Product name is required');
  if (product.price <= 0) errors.push('Price must be greater than 0');
  if (!product.category?.trim()) errors.push('Category is required');
  return errors;
};
```

### Storage Errors

**Scenario:** AsyncStorage read/write fails

**Handling:**
- Log error to console
- Show user-friendly alert
- Retry operation
- Use cached data as fallback

**Implementation:**

```javascript
const loadProducts = async () => {
  try {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
  } catch (error) {
    console.error('Failed to load products:', error);
    Alert.alert('Error', 'Failed to load products. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Concurrent Updates

**Scenario:** Multiple admins update same product simultaneously

**Handling:**
- Show warning when data is stale
- Provide refresh button
- Use timestamps to detect conflicts
- Last-write-wins strategy

**Implementation:**

```javascript
const handleSaveProduct = async (product) => {
  const existing = products.find(p => p.id === product.id);
  if (existing?.updatedAt > product.updatedAt) {
    Alert.alert('Warning', 'Product was modified by another admin. Refresh to see latest changes.');
    return;
  }
  // Continue with save
};
```

---

## Testing Strategy

### Unit Tests

**Focus:** Individual functions and components

**Test Categories:**

1. **Search & Filter Tests**
   - Search returns correct products
   - Empty search returns all products
   - Case-insensitive search works
   - Filter by category works

2. **Statistics Tests**
   - Total orders calculated correctly
   - Total revenue calculated correctly
   - Recent orders list is correct
   - Statistics update when data changes

3. **CRUD Operations Tests**
   - Add product creates new product
   - Edit product updates existing product
   - Delete product removes product
   - Product data persists correctly

4. **Status Update Tests**
   - Order status updates correctly
   - Status change persists
   - Invalid status rejected
   - Status history tracked

5. **Validation Tests**
   - Required fields validated
   - Price validation (must be > 0)
   - Email validation for customers
   - Phone number validation

### Property-Based Tests

**Framework:** fast-check

**Properties to Test:**

1. **Product Search** (Property 1)
   - Generate: Random product lists, random search queries
   - Assert: All results contain search text

2. **Statistics Accuracy** (Property 2)
   - Generate: Random order lists
   - Assert: Totals calculated correctly

3. **Status Persistence** (Property 3)
   - Generate: Random orders, random status values
   - Assert: Status changes persist

4. **Lock/Unlock** (Property 4)
   - Generate: Random customer states
   - Assert: Lock then unlock returns to original state

5. **CRUD Operations** (Property 5)
   - Generate: Random products
   - Assert: Create, read, delete work correctly

6. **Data Persistence** (Property 6)
   - Generate: Random data objects
   - Assert: Save and load returns equivalent data

### Integration Tests

**Focus:** Complete workflows

1. **Admin adds product**
   - Fill form → Save → Product appears in list → Persists after reload

2. **Admin edits product**
   - Select product → Edit form → Save → List updates → Persists

3. **Admin deletes product**
   - Select product → Confirm delete → Product removed → Persists

4. **Admin updates order status**
   - Select order → Change status → Save → Status updates → Persists

5. **Admin locks customer**
   - Select customer → Lock account → Status changes → Persists

---

## Performance Considerations

### Data Loading

**Issue:** Loading all products/customers/orders at once could be slow

**Solution:**
- Implement pagination (load 20 items per page)
- Lazy load data as user scrolls
- Cache data in memory
- Show loading indicators

**Implementation:**

```javascript
const [page, setPage] = useState(1);
const itemsPerPage = 20;
const paginatedProducts = products.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);
```

### Search Performance

**Issue:** Searching through large lists could be slow

**Solution:**
- Debounce search input (300ms)
- Use efficient filtering algorithm
- Index data for faster lookup
- Show search results incrementally

**Implementation:**

```javascript
const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useCallback(
  debounce((query) => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, 300),
  [products]
);
```

### Chart Rendering

**Issue:** Rendering large charts could be slow

**Solution:**
- Limit chart data to last 30 days
- Use efficient chart library
- Memoize chart components
- Render charts asynchronously

**Implementation:**

```javascript
const chartData = useMemo(() => {
  return generateChartData(orders.slice(-30));
}, [orders]);
```

### Memory Usage

**Issue:** Storing all data in memory could use too much RAM

**Solution:**
- Implement data pagination
- Clear unused data
- Use efficient data structures
- Implement data compression

---

## Security Considerations

### Admin Authorization

**Risk:** Non-admin users could access admin dashboard

**Mitigation:**
- Check user role before rendering dashboard
- Verify admin status on every screen
- Implement role-based access control
- Log admin actions for audit trail

**Implementation:**

```javascript
if (user?.role !== 'admin') {
  return <UnauthorizedScreen />;
}
```

### Data Validation

**Risk:** Invalid data could corrupt database

**Mitigation:**
- Validate all input data
- Sanitize strings to prevent injection
- Type-check all values
- Reject invalid data with error messages

**Implementation:**

```javascript
const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, '');
};
```

### Sensitive Data

**Risk:** Customer data could be exposed

**Mitigation:**
- Don't log sensitive data (passwords, emails)
- Mask sensitive fields in UI
- Implement data access controls
- Encrypt sensitive data in storage

**Implementation:**

```javascript
const maskEmail = (email) => {
  const [name, domain] = email.split('@');
  return `${name.substring(0, 2)}***@${domain}`;
};
```

---

## Future Enhancements

1. **Advanced Analytics**
   - Sales trends and forecasting
   - Customer segmentation
   - Product performance analysis
   - Inventory management

2. **Bulk Operations**
   - Bulk product import/export
   - Bulk customer management
   - Bulk order processing
   - Batch status updates

3. **Notifications**
   - Real-time order notifications
   - Low stock alerts
   - Customer activity alerts
   - System notifications

4. **Reporting**
   - Generate PDF reports
   - Email reports to stakeholders
   - Custom report builder
   - Scheduled reports

5. **Multi-Admin Support**
   - Role-based permissions
   - Admin activity logs
   - Approval workflows
   - Admin management interface

6. **Mobile Optimization**
   - Responsive design for tablets
   - Touch-friendly controls
   - Offline mode
   - Mobile-specific layouts

---

## References

- [React Native Documentation](https://reactnative.dev/)
- [AsyncStorage API](https://react-native-async-storage.github.io/)
- [React Navigation](https://reactnavigation.org/)
- [Chart Libraries for React Native](https://github.com/indiespirit/react-native-chart-kit)

