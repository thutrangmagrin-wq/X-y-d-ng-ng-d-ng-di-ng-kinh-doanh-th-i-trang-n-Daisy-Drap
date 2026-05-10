# Design Document: Dynamic Color Theming System for Daisy Drape

## Overview

The Daisy Drape app requires a dynamic color theming system that allows admin users to customize the app's color scheme (primary, secondary, background colors) in real-time. These changes must be reflected across ALL screens and components without requiring app restart.

The system builds upon the existing `AppConfigContext` which already manages app configuration including `primaryColor` and `backgroundColor`. This design extends that system to provide:

1. **Centralized theme management** through an enhanced context
2. **Persistent storage** of theme preferences
3. **Real-time synchronization** across all screens
4. **Admin customization interface** for color selection
5. **Component-level theme consumption** for consistent styling

### Key Requirements

- Admin users can change primary color, secondary color, and background color
- Changes are reflected immediately across all screens (HomeScreen, WishlistScreen, CartScreen, ProfileScreen, AdminDashboardScreen, SellerDashboardScreen, and all components)
- Theme preferences persist across app sessions
- All screens subscribe to theme changes and re-render with new colors
- Integration with existing AppConfigContext
- Admin panel provides intuitive color selection interface

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Daisy Drape App                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           AppConfigContext (Enhanced)                    │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ State:                                             │  │  │
│  │  │  - config (theme colors + app settings)           │  │  │
│  │  │  - updateConfig (persist + broadcast)             │  │  │
│  │  │  - loadConfig (restore from storage)              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         │                  │                  │                │
│    ┌────▼────┐      ┌─────▼──────┐    ┌─────▼──────┐         │
│    │ Storage  │      │  Screens   │    │ Components │         │
│    │ Service  │      │  (consume) │    │ (consume)  │         │
│    └──────────┘      └────────────┘    └────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Admin updates theme** → AdminCustomizeScreen calls `updateConfig()`
2. **Context updates state** → AppConfigContext updates internal state
3. **Persist to storage** → StorageService saves to AsyncStorage
4. **Broadcast to subscribers** → All screens using `useAppConfig()` re-render
5. **Components apply new colors** → ProductCard, CartItem, etc. use new theme

---

## Components and Interfaces

### 1. Enhanced AppConfigContext

**Location:** `context/AppConfigContext.js`

**Responsibilities:**
- Manage theme configuration state
- Provide `useAppConfig()` hook for component consumption
- Handle config updates and persistence
- Broadcast changes to all subscribers

**Interface:**

```typescript
interface AppConfig {
  shopName: string;
  primaryColor: string;        // e.g., '#E07B2A'
  secondaryColor: string;      // e.g., '#E91E8C'
  backgroundColor: string;     // e.g., '#FFF8F0'
  bannerImage: string;         // URL
}

interface AppConfigContextValue {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>;
  loadConfig: () => Promise<void>;
}

function useAppConfig(): AppConfigContextValue
```

**Key Methods:**

- `updateConfig(newConfig)`: Merges new config with existing, updates state, persists to storage
- `loadConfig()`: Loads config from AsyncStorage on app startup
- Context provider wraps entire app to make config available to all screens

### 2. StorageService Extensions

**Location:** `services/storageService.js`

**Responsibilities:**
- Persist theme configuration to AsyncStorage
- Load theme configuration on app startup
- Handle serialization/deserialization of color values

**New Functions:**

```javascript
// Get app configuration (theme + settings)
export const getAppConfig = async () => {
  const saved = await get(KEYS.APP_CONFIG, null);
  return saved ? { ...DEFAULT_CONFIG, ...saved } : DEFAULT_CONFIG;
};

// Save app configuration
export const saveAppConfig = (config) => set(KEYS.APP_CONFIG, config);
```

**Storage Key:** `APP_CONFIG` (JSON string)

**Default Configuration:**

```javascript
export const DEFAULT_CONFIG = {
  shopName: 'DaisyDrape',
  primaryColor: '#E07B2A',
  secondaryColor: '#E91E8C',
  backgroundColor: '#FFF8F0',
  bannerImage: 'https://images.unsplash.com/...',
};
```

### 3. Theme Constants

**Location:** `constants/theme.js`

**Responsibilities:**
- Define design tokens (colors, spacing, shadows, radius)
- Provide fallback colors for components
- Maintain design consistency

**Current Structure:**
- `COLORS`: Primary palette, backgrounds, text colors, status colors
- `FONTS`: Font weights
- `RADIUS`: Border radius values
- `SHADOW`: Shadow definitions

**Enhancement:** Add color preset definitions for admin customization

```javascript
export const COLOR_PRESETS = [
  { label: 'Cam nâu', value: '#E07B2A' },
  { label: 'Hồng', value: '#E91E8C' },
  { label: 'Đỏ', value: '#E53935' },
  // ... more presets
];

export const BG_PRESETS = [
  { label: 'Kem', value: '#FFF8F0' },
  { label: 'Trắng', value: '#FFFFFF' },
  // ... more presets
];
```

### 4. Screen Integration

**Affected Screens:**
- HomeScreen ✅ (already using useAppConfig)
- WishlistScreen ❌ (needs update)
- CartScreen ❌ (needs update)
- ProfileScreen ❌ (needs update)
- AdminDashboardScreen
- AdminCustomizeScreen
- SellerDashboardScreen
- All admin/seller sub-screens

**Current Issue:**
Only HomeScreen is currently using `useAppConfig()` hook. Other screens use hardcoded colors from COLORS constant, so they don't update when admin changes theme.

**Integration Pattern:**

```javascript
import { useAppConfig } from '../context/AppConfigContext';

export default function SomeScreen() {
  const { config } = useAppConfig();
  
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]}>
      {/* Use config.primaryColor, config.backgroundColor, etc. */}
      <TouchableOpacity style={[styles.button, { backgroundColor: config.primaryColor }]}>
        {/* ... */}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

**Key Points:**
- Use `useAppConfig()` hook to access current theme
- Apply colors dynamically using `config.primaryColor`, `config.backgroundColor`
- Screens automatically re-render when config changes
- No manual subscription/unsubscription needed (React Context handles it)
- Replace hardcoded `COLORS.primary` with `config.primaryColor`
- Replace hardcoded `COLORS.background` with `config.backgroundColor`

### 5. Component Integration

**Affected Components:**
- ProductCard
- CartItem
- WishlistItem
- TabBar
- All UI elements using colors

**Integration Pattern:**

```javascript
import { useAppConfig } from '../context/AppConfigContext';

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  const { config } = useAppConfig();
  
  return (
    <View style={[styles.card, { backgroundColor: config.backgroundColor }]}>
      <TouchableOpacity 
        style={[styles.addBtn, { backgroundColor: config.primaryColor }]}
        onPress={() => onAddToCart(product)}
      >
        <Text>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 6. Admin Customization Interface

**Location:** `screens/admin/AdminCustomizeScreen.js`

**Responsibilities:**
- Display current theme configuration
- Provide color picker/preset selector
- Allow banner image upload
- Save changes to context and storage

**Features:**
- Color presets for quick selection
- Live preview of banner with selected colors
- Shop name customization
- Banner image upload to Cloudinary
- Reset to default button
- Save changes button

**Implementation:**

```javascript
const handleSave = async () => {
  await updateConfig(config);  // Updates context + storage
  Alert.alert('✅ Đã lưu!', 'Giao diện toàn bộ app đã được cập nhật.');
};
```

---

## Data Models

### AppConfig Data Structure

```javascript
{
  shopName: string,           // Shop display name
  primaryColor: string,       // Hex color for primary actions/buttons
  secondaryColor: string,     // Hex color for secondary elements
  backgroundColor: string,    // Hex color for screen backgrounds
  bannerImage: string,        // URL to banner image
  createdAt?: timestamp,      // When config was created
  updatedAt?: timestamp,      // When config was last updated
}
```

### Storage Format

**Key:** `APP_CONFIG`
**Format:** JSON string
**Example:**

```json
{
  "shopName": "DaisyDrape",
  "primaryColor": "#E07B2A",
  "secondaryColor": "#E91E8C",
  "backgroundColor": "#FFF8F0",
  "bannerImage": "https://images.unsplash.com/...",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Theme Persistence Round-Trip

*For any* valid app configuration, saving the configuration to storage and then loading it should return an equivalent configuration with all color values and settings preserved.

**Validates: Requirements 1.5, 8.2, 8.3**

**Rationale:** This property ensures that theme customization is durable. Admins can change colors and trust that the changes persist across app sessions. The round-trip validates both serialization (stringify) and deserialization (parse) work correctly.

### Property 2: Search Filter Correctness

*For any* product list and any search query string, the filtered results should contain only products whose names include the search text (case-insensitive), and should not include products that don't match.

**Validates: Requirements 2.2**

**Rationale:** This property ensures search functionality works correctly across all product lists and search inputs. It validates both positive matches (matching products are included) and negative matches (non-matching products are excluded).

### Property 3: Empty Search Returns All Products

*For any* product list, when the search query is an empty string or whitespace-only string, all products should be returned unfiltered.

**Validates: Requirements 2.3**

**Rationale:** This property ensures the search filter correctly handles the empty state, returning the complete product list when no search is active.

### Property 4: Wishlist Toggle Idempotence

*For any* product and any wishlist state, adding a product to the wishlist and then removing it should return the wishlist to its original state (round-trip property).

**Validates: Requirements 3.1, 3.2**

**Rationale:** This property validates that wishlist add/remove operations are inverses of each other. It ensures that toggling a product twice returns to the original state.

### Property 5: Wishlist Persistence

*For any* valid wishlist, saving it to storage and then loading it should return an equivalent wishlist with all products and their properties preserved.

**Validates: Requirements 3.4, 3.5, 3.6**

**Rationale:** This property ensures wishlist data is correctly persisted and restored. It validates the complete round-trip from in-memory state to storage and back.

### Property 6: Cart Addition Creates Correct Quantity

*For any* product not in the cart, adding it to the cart should result in a cart item with quantity exactly 1.

**Validates: Requirements 4.1**

**Rationale:** This property ensures that new cart items are created with the correct initial quantity.

### Property 7: Cart Addition Increments Existing Quantity

*For any* product already in the cart with quantity Q, adding it again should result in quantity Q+1.

**Validates: Requirements 4.2**

**Rationale:** This property ensures that adding an existing cart item increments its quantity by exactly 1, not by any other amount.

### Property 8: Cart Quantity Increment

*For any* cart item with quantity Q, incrementing it should result in quantity Q+1.

**Validates: Requirements 4.5**

**Rationale:** This property validates that the increment operation increases quantity by exactly 1.

### Property 9: Cart Quantity Decrement (Q > 1)

*For any* cart item with quantity Q where Q > 1, decrementing it should result in quantity Q-1.

**Validates: Requirements 4.6**

**Rationale:** This property validates that the decrement operation decreases quantity by exactly 1 when quantity is greater than 1.

### Property 10: Cart Quantity Decrement (Q = 1) Removes Item

*For any* cart item with quantity exactly 1, decrementing it should remove the item from the cart entirely.

**Validates: Requirements 4.7**

**Rationale:** This property validates the edge case where decrementing a quantity-1 item removes it rather than creating a quantity-0 item.

### Property 11: Cart Total Price Calculation

*For any* cart containing items with prices P₁, P₂, ..., Pₙ and quantities Q₁, Q₂, ..., Qₙ, the total price should equal exactly (P₁×Q₁) + (P₂×Q₂) + ... + (Pₙ×Qₙ).

**Validates: Requirements 4.8**

**Rationale:** This property ensures the total price calculation is mathematically correct for all possible cart configurations.

### Property 12: Cart Persistence

*For any* valid cart, saving it to storage and then loading it should return an equivalent cart with all items, quantities, and prices preserved.

**Validates: Requirements 4.9, 4.10, 4.11**

**Rationale:** This property ensures cart data is correctly persisted and restored, validating the complete round-trip.

### Property 13: Checkout Creates Valid Order

*For any* non-empty cart with items and total price T, checking out should create an order containing exactly those items and total price T.

**Validates: Requirements 5.2**

**Rationale:** This property ensures that checkout correctly captures the cart state into an order without data loss or corruption.

### Property 14: Order Persistence

*For any* valid order, saving it to storage and then loading it should return an equivalent order with all items, total price, and timestamp preserved.

**Validates: Requirements 5.3**

**Rationale:** This property ensures order data is correctly persisted and restored.

### Property 15: Checkout Clears Cart

*For any* non-empty cart, after successful checkout, the cart should be empty (contain zero items).

**Validates: Requirements 5.4**

**Rationale:** This property ensures that checkout properly clears the cart after creating an order.

### Property 16: User Persistence

*For any* valid user object, saving it to storage and then loading it should return an equivalent user with all properties preserved.

**Validates: Requirements 6.2, 6.6, 6.7**

**Rationale:** This property ensures user authentication data is correctly persisted and restored.

### Property 17: Login Validation Rejects Empty Fields

*For any* login attempt where username is empty OR password is empty, the login should be rejected and the user should not be authenticated.

**Validates: Requirements 6.5**

**Rationale:** This property ensures that the login validation correctly rejects incomplete credentials.

### Property 18: JSON Serialization Round-Trip

*For any* valid JavaScript object, serializing it with JSON.stringify and then deserializing with JSON.parse should return an equivalent object with all properties and values preserved.

**Validates: Requirements 8.2, 8.3**

**Rationale:** This property validates that the JSON serialization/deserialization process used by StorageService preserves data integrity.

---

## Error Handling

### Storage Errors

**Scenario:** AsyncStorage read/write fails

**Handling:**
- Wrap all storage operations in try/catch blocks
- Log errors to console for debugging
- Return sensible defaults (empty arrays, null, DEFAULT_CONFIG)
- Display user-friendly alerts for critical failures

**Implementation:**

```javascript
const get = async (key, fallback = null) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`get(${key}) error:`, e);
    return fallback;
  }
};
```

### Invalid Color Values

**Scenario:** Admin enters invalid hex color

**Handling:**
- Validate color format before saving
- Show error message to admin
- Revert to previous valid color
- Provide color presets to avoid manual entry

**Implementation:**

```javascript
const isValidHexColor = (color) => /^#[0-9A-F]{6}$/i.test(color);

const handleColorChange = (color) => {
  if (!isValidHexColor(color)) {
    Alert.alert('Invalid Color', 'Please enter a valid hex color (e.g., #E07B2A)');
    return;
  }
  setConfig(prev => ({ ...prev, primaryColor: color }));
};
```

### Missing Configuration

**Scenario:** App config not found in storage on startup

**Handling:**
- Use DEFAULT_CONFIG as fallback
- Automatically save default config to storage
- Ensure app is always usable with sensible defaults

**Implementation:**

```javascript
export const getAppConfig = async () => {
  const saved = await get(KEYS.APP_CONFIG, null);
  return saved ? { ...DEFAULT_CONFIG, ...saved } : DEFAULT_CONFIG;
};
```

### Network Errors (Banner Upload)

**Scenario:** Cloudinary upload fails

**Handling:**
- Show error alert to admin
- Keep previous banner image
- Allow retry
- Provide fallback banner URL

**Implementation:**

```javascript
const handlePickBanner = async () => {
  try {
    setUploading(true);
    const url = await uploadImageToCloudinary(result.assets[0].uri);
    setConfig(prev => ({ ...prev, bannerImage: url }));
  } catch (e) {
    Alert.alert('Upload Failed', 'Could not upload banner. Please try again.');
  } finally {
    setUploading(false);
  }
};
```

---

## Testing Strategy

### Unit Tests

**Focus:** Individual functions and components in isolation

**Test Categories:**

1. **StorageService Tests**
   - `getAppConfig()` returns DEFAULT_CONFIG when storage is empty
   - `saveAppConfig()` correctly serializes and saves config
   - `getAppConfig()` correctly deserializes saved config
   - Error handling when AsyncStorage fails
   - Color validation functions

2. **AppConfigContext Tests**
   - `useAppConfig()` hook returns current config
   - `updateConfig()` updates state and persists to storage
   - `loadConfig()` loads from storage on startup
   - Multiple subscribers receive updates

3. **Component Tests**
   - ProductCard applies theme colors correctly
   - CartItem displays correct total price
   - AdminCustomizeScreen color presets work
   - Search filter returns correct results
   - Wishlist toggle works correctly

4. **Integration Tests**
   - Admin changes color → all screens update
   - App restart → theme persists
   - Cart operations maintain correct totals
   - Checkout clears cart and creates order

### Property-Based Tests

**Framework:** fast-check (JavaScript) or similar

**Test Configuration:** Minimum 100 iterations per property

**Properties to Test:**

1. **Theme Persistence** (Property 1)
   - Generate: Random valid AppConfig objects
   - Action: Save to storage, load from storage
   - Assert: Loaded config equals original config

2. **Search Filter** (Properties 2, 3)
   - Generate: Random product lists, random search queries
   - Action: Filter products by search text
   - Assert: All results contain search text (case-insensitive)

3. **Wishlist Toggle** (Property 4)
   - Generate: Random products, random wishlist states
   - Action: Add product, remove product
   - Assert: Final wishlist equals original wishlist

4. **Cart Operations** (Properties 6-12)
   - Generate: Random cart states, random products, random quantities
   - Action: Add/remove/increment/decrement items
   - Assert: Quantities and totals are correct

5. **Checkout** (Properties 13-15)
   - Generate: Random non-empty carts
   - Action: Checkout
   - Assert: Order created correctly, cart cleared

6. **User Persistence** (Properties 16-17)
   - Generate: Random user objects
   - Action: Save to storage, load from storage
   - Assert: Loaded user equals original user

7. **JSON Serialization** (Property 18)
   - Generate: Random JavaScript objects
   - Action: Stringify, parse
   - Assert: Parsed object equals original object

### Visual/Manual Tests

**Focus:** UI appearance and user experience

1. **Color Application**
   - Verify primary color applied to buttons, active tabs
   - Verify background color applied to screens
   - Verify secondary color applied to accents

2. **Theme Consistency**
   - All screens use same theme colors
   - Components inherit theme from context
   - No hardcoded colors in components

3. **Admin Customization**
   - Color presets work correctly
   - Live preview updates as colors change
   - Changes persist after app restart
   - Reset to default works

4. **Responsive Design**
   - Theme works on different screen sizes
   - Safe area insets respected
   - Shadows and radius consistent

### Test Coverage Goals

- **Unit Tests:** 80%+ coverage of business logic
- **Property Tests:** All testable acceptance criteria
- **Integration Tests:** Critical user workflows
- **Visual Tests:** All screens and components

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Enhance AppConfigContext with theme management
- [ ] Extend StorageService with config persistence
- [ ] Add color presets to theme constants
- [ ] Write unit tests for storage and context

### Phase 2: Screen Integration (Week 2)
- [ ] Update HomeScreen to use dynamic colors
- [ ] Update WishlistScreen to use dynamic colors
- [ ] Update CartScreen to use dynamic colors
- [ ] Update ProfileScreen to use dynamic colors
- [ ] Update all admin/seller screens

### Phase 3: Component Integration (Week 3)
- [ ] Update ProductCard to use dynamic colors
- [ ] Update CartItem component
- [ ] Update WishlistItem component
- [ ] Update TabBar to use dynamic colors
- [ ] Update all UI components

### Phase 4: Admin Interface (Week 4)
- [ ] Enhance AdminCustomizeScreen with color picker
- [ ] Add color presets UI
- [ ] Add live preview
- [ ] Add save/reset functionality
- [ ] Test admin workflow

### Phase 5: Testing & Polish (Week 5)
- [ ] Write property-based tests
- [ ] Write integration tests
- [ ] Visual regression testing
- [ ] Performance optimization
- [ ] Documentation

---

## Performance Considerations

### Context Updates

**Issue:** Frequent context updates could cause unnecessary re-renders

**Solution:**
- Use React.memo for components that don't need theme updates
- Memoize useAppConfig hook results
- Batch updates when multiple config changes occur

**Implementation:**

```javascript
const MemoizedProductCard = React.memo(ProductCard, (prev, next) => {
  return prev.product.id === next.product.id &&
         prev.isWishlisted === next.isWishlisted;
});
```

### Storage Operations

**Issue:** AsyncStorage operations are async and could block UI

**Solution:**
- Load config on app startup, not on every screen
- Cache config in context state
- Use background loading for non-critical data

**Implementation:**

```javascript
useEffect(() => {
  loadConfig();  // Load once on app startup
}, []);
```

### Color Calculations

**Issue:** Computing derived colors (lighter/darker shades) on every render

**Solution:**
- Pre-compute color variations when config changes
- Store computed colors in context
- Use memoization for color utility functions

---

## Security Considerations

### Color Validation

**Risk:** Malicious color values could break UI or inject code

**Mitigation:**
- Validate hex color format: `/^#[0-9A-F]{6}$/i`
- Reject invalid formats
- Use color presets to limit user input

### Storage Security

**Risk:** Sensitive data stored in AsyncStorage (not encrypted)

**Mitigation:**
- Theme colors are not sensitive
- User credentials stored separately with encryption
- AsyncStorage is device-local, not transmitted

### Admin Access

**Risk:** Non-admin users could modify theme

**Mitigation:**
- AdminCustomizeScreen only accessible to admin users
- Check user role before allowing customization
- Log theme changes for audit trail

---

## Future Enhancements

1. **Dark Mode Support**
   - Add dark theme preset
   - Auto-detect system dark mode preference
   - Allow user to toggle dark mode

2. **Advanced Color Customization**
   - Color picker instead of presets
   - Generate complementary colors automatically
   - Save custom color palettes

3. **Theme Scheduling**
   - Schedule theme changes for specific times
   - Seasonal theme variations
   - Holiday-specific themes

4. **Multi-Language Support**
   - Translate color preset labels
   - Localize admin interface

5. **Theme Analytics**
   - Track which themes are most popular
   - A/B test different color schemes
   - User preference analytics

---

## References

- [React Context API](https://react.dev/reference/react/useContext)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/)
- [React Native Styling](https://reactnative.dev/docs/style)
- [Color Theory in UI Design](https://www.interaction-design.org/literature/topics/color-theory)
