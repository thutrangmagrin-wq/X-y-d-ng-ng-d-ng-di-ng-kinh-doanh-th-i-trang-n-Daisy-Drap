# Implementation Plan: Dynamic Color Theming System for Daisy Drape

## Overview

This implementation plan converts the Daisy Drape design into actionable coding tasks. The critical issue is that only HomeScreen currently uses the `useAppConfig()` hook for dynamic colors. CartScreen, WishlistScreen, and ProfileScreen use hardcoded colors from the COLORS constant, so they don't update when the admin changes the theme.

The implementation follows an incremental approach:
1. Update all screens to use dynamic colors from AppConfigContext
2. Update all components to use dynamic colors
3. Enhance AdminCustomizeScreen for better color customization
4. Write tests to verify theme persistence and synchronization

---

## Tasks

- [x] 1. Update CartScreen to use dynamic colors from AppConfigContext
  - Import `useAppConfig` hook from context
  - Replace all hardcoded `COLORS.primary` with `config.primaryColor`
  - Replace all hardcoded `COLORS.background` with `config.backgroundColor`
  - Replace all hardcoded `COLORS.surface` with appropriate dynamic color
  - Ensure header, buttons, badges, and footer use dynamic colors
  - Test that CartScreen re-renders when theme changes
  - _Requirements: 1.5, 4.3, 4.4, 4.8_

- [x] 2. Update WishlistScreen to use dynamic colors from AppConfigContext
  - Import `useAppConfig` hook from context
  - Replace all hardcoded `COLORS.primary` with `config.primaryColor`
  - Replace all hardcoded `COLORS.background` with `config.backgroundColor`
  - Replace all hardcoded `COLORS.surface` with appropriate dynamic color
  - Ensure header, action buttons, and cards use dynamic colors
  - Test that WishlistScreen re-renders when theme changes
  - _Requirements: 1.5, 3.3, 3.4_

- [x] 3. Update ProfileScreen to use dynamic colors from AppConfigContext
  - Import `useAppConfig` hook from context
  - Replace all hardcoded `COLORS.primary` with `config.primaryColor`
  - Replace all hardcoded `COLORS.background` with `config.backgroundColor`
  - Replace all hardcoded `COLORS.surface` with appropriate dynamic color
  - Ensure user card, stats, menu, and buttons use dynamic colors
  - Test that ProfileScreen re-renders when theme changes
  - _Requirements: 1.5, 6.3, 7.2_

- [x] 4. Update ProductCard component to use dynamic colors from AppConfigContext
  - Import `useAppConfig` hook from context
  - Replace all hardcoded `COLORS.primary` with `config.primaryColor`
  - Replace all hardcoded `COLORS.background` with `config.backgroundColor`
  - Replace all hardcoded `COLORS.surface` with appropriate dynamic color
  - Ensure discount badge, cart button, and card background use dynamic colors
  - Test that ProductCard re-renders when theme changes
  - _Requirements: 1.5, 1.2, 10.1_

- [x] 5. Update all admin screens to use dynamic colors from AppConfigContext
  - **AdminDashboardScreen**: Replace hardcoded header background `#2C1810` with `config.primaryColor`
  - **AdminProductsScreen**: Replace hardcoded header background `#2C1810` with `config.primaryColor`
  - **AdminOrdersScreen**: Replace hardcoded header background `#2C1810` with `config.primaryColor`, update revenue card to use `config.primaryColor`
  - **AdminUsersScreen**: Replace hardcoded header background `#2C1810` with `config.primaryColor`, update filter tabs to use `config.primaryColor`
  - **AdminCustomizeScreen**: Already using `useAppConfig()` ✅
  - Import `useAppConfig` hook in each admin screen
  - Replace all hardcoded `#2C1810` with `config.primaryColor`
  - Replace all hardcoded `#FFD700` (gold text) with appropriate text color for contrast
  - Test that all admin screens update when theme changes
  - _Requirements: 1.5_

- [x] 6. Enhance AdminCustomizeScreen with improved color customization
  - Verify color presets are properly defined in constants/theme.js
  - Add secondary color customization UI (currently only primary and background)
  - Add hex color input fields for manual color entry with validation
  - Add color validation function to reject invalid hex colors
  - Implement live preview that updates as colors change
  - Add "Copy hex code" functionality for selected colors
  - Test that color changes persist after app restart
  - _Requirements: 1.5, 8.2, 8.3_

- [x] 7. Verify StorageService correctly handles theme persistence
  - Confirm `getAppConfig()` returns DEFAULT_CONFIG when storage is empty
  - Confirm `saveAppConfig()` correctly serializes config to JSON
  - Confirm `getAppConfig()` correctly deserializes saved config
  - Test error handling when AsyncStorage fails
  - Verify theme loads on app startup via AppConfigContext
  - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

- [x] 8. Checkpoint - Verify all screens use dynamic colors
  - Manually test each screen (HomeScreen, CartScreen, WishlistScreen, ProfileScreen)
  - Verify all screens update when admin changes theme in AdminCustomizeScreen
  - Verify theme persists after app restart
  - Ensure no hardcoded colors remain in screens or components
  - Ask the user if questions arise.

- [ ] 9. Write property test for theme persistence round-trip
  - **Property 1: Theme Persistence Round-Trip**
  - **Validates: Requirements 1.5, 8.2, 8.3**
  - Generate random valid AppConfig objects with hex colors
  - Save config to storage and load it back
  - Assert that loaded config equals original config (all colors preserved)
  - Test with minimum 100 iterations
  - _Requirements: 1.5, 8.2, 8.3_

- [ ]* 10. Write unit tests for StorageService config functions
  - Test `getAppConfig()` returns DEFAULT_CONFIG when storage is empty
  - Test `saveAppConfig()` correctly saves and retrieves config
  - Test error handling when AsyncStorage.getItem fails
  - Test error handling when AsyncStorage.setItem fails
  - Test JSON serialization/deserialization round-trip
  - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

- [ ]* 11. Write unit tests for AppConfigContext hook
  - Test `useAppConfig()` returns current config
  - Test `updateConfig()` updates state and persists to storage
  - Test `loadConfig()` loads from storage on startup
  - Test multiple subscribers receive updates when config changes
  - Test context provider wraps app correctly
  - _Requirements: 1.5_

- [ ]* 12. Write integration tests for theme synchronization
  - Test admin changes primary color → all screens update
  - Test admin changes background color → all screens update
  - Test theme persists after app restart
  - Test ProductCard updates when theme changes
  - Test CartScreen updates when theme changes
  - Test WishlistScreen updates when theme changes
  - Test ProfileScreen updates when theme changes
  - _Requirements: 1.5, 4.3, 3.3, 6.3_

- [ ]* 13. Write property test for search filter correctness
  - **Property 2: Search Filter Correctness**
  - **Validates: Requirements 2.2**
  - Generate random product lists and search query strings
  - Filter products by search text (case-insensitive)
  - Assert all results contain search text
  - Assert no non-matching products are included
  - Test with minimum 100 iterations
  - _Requirements: 2.2_

- [ ]* 14. Write property test for empty search returns all products
  - **Property 3: Empty Search Returns All Products**
  - **Validates: Requirements 2.3**
  - Generate random product lists
  - Filter with empty string and whitespace-only strings
  - Assert all products are returned unfiltered
  - Test with minimum 100 iterations
  - _Requirements: 2.3_

- [ ]* 15. Write property test for wishlist toggle idempotence
  - **Property 4: Wishlist Toggle Idempotence**
  - **Validates: Requirements 3.1, 3.2**
  - Generate random products and wishlist states
  - Add product to wishlist, then remove it
  - Assert final wishlist equals original wishlist
  - Test with minimum 100 iterations
  - _Requirements: 3.1, 3.2_

- [ ]* 16. Write property test for wishlist persistence
  - **Property 5: Wishlist Persistence**
  - **Validates: Requirements 3.4, 3.5, 3.6**
  - Generate random valid wishlist objects
  - Save to storage and load from storage
  - Assert loaded wishlist equals original wishlist
  - Test with minimum 100 iterations
  - _Requirements: 3.4, 3.5, 3.6_

- [ ]* 17. Write property test for cart addition creates correct quantity
  - **Property 6: Cart Addition Creates Correct Quantity**
  - **Validates: Requirements 4.1**
  - Generate random products not in cart
  - Add product to cart
  - Assert cart item has quantity exactly 1
  - Test with minimum 100 iterations
  - _Requirements: 4.1_

- [ ]* 18. Write property test for cart addition increments existing quantity
  - **Property 7: Cart Addition Increments Existing Quantity**
  - **Validates: Requirements 4.2**
  - Generate random cart states with existing items
  - Add existing product to cart
  - Assert quantity incremented by exactly 1
  - Test with minimum 100 iterations
  - _Requirements: 4.2_

- [ ]* 19. Write property test for cart quantity increment
  - **Property 8: Cart Quantity Increment**
  - **Validates: Requirements 4.5**
  - Generate random cart items with various quantities
  - Increment quantity
  - Assert quantity increased by exactly 1
  - Test with minimum 100 iterations
  - _Requirements: 4.5_

- [ ]* 20. Write property test for cart quantity decrement (Q > 1)
  - **Property 9: Cart Quantity Decrement (Q > 1)**
  - **Validates: Requirements 4.6**
  - Generate random cart items with quantity > 1
  - Decrement quantity
  - Assert quantity decreased by exactly 1
  - Test with minimum 100 iterations
  - _Requirements: 4.6_

- [ ]* 21. Write property test for cart quantity decrement (Q = 1) removes item
  - **Property 10: Cart Quantity Decrement (Q = 1) Removes Item**
  - **Validates: Requirements 4.7**
  - Generate random cart items with quantity exactly 1
  - Decrement quantity
  - Assert item removed from cart entirely
  - Test with minimum 100 iterations
  - _Requirements: 4.7_

- [ ]* 22. Write property test for cart total price calculation
  - **Property 11: Cart Total Price Calculation**
  - **Validates: Requirements 4.8**
  - Generate random carts with multiple items and quantities
  - Calculate total price
  - Assert total equals sum of (price × quantity) for all items
  - Test with minimum 100 iterations
  - _Requirements: 4.8_

- [ ]* 23. Write property test for cart persistence
  - **Property 12: Cart Persistence**
  - **Validates: Requirements 4.9, 4.10, 4.11**
  - Generate random valid cart objects
  - Save to storage and load from storage
  - Assert loaded cart equals original cart
  - Test with minimum 100 iterations
  - _Requirements: 4.9, 4.10, 4.11_

- [ ]* 24. Write property test for checkout creates valid order
  - **Property 13: Checkout Creates Valid Order**
  - **Validates: Requirements 5.2**
  - Generate random non-empty carts
  - Create order from cart
  - Assert order contains exactly same items and total price
  - Test with minimum 100 iterations
  - _Requirements: 5.2_

- [ ]* 25. Write property test for order persistence
  - **Property 14: Order Persistence**
  - **Validates: Requirements 5.3**
  - Generate random valid order objects
  - Save to storage and load from storage
  - Assert loaded order equals original order
  - Test with minimum 100 iterations
  - _Requirements: 5.3_

- [ ]* 26. Write property test for checkout clears cart
  - **Property 15: Checkout Clears Cart**
  - **Validates: Requirements 5.4**
  - Generate random non-empty carts
  - Checkout
  - Assert cart is empty after checkout
  - Test with minimum 100 iterations
  - _Requirements: 5.4_

- [ ]* 27. Write property test for user persistence
  - **Property 16: User Persistence**
  - **Validates: Requirements 6.2, 6.6, 6.7**
  - Generate random valid user objects
  - Save to storage and load from storage
  - Assert loaded user equals original user
  - Test with minimum 100 iterations
  - _Requirements: 6.2, 6.6, 6.7_

- [ ]* 28. Write property test for login validation rejects empty fields
  - **Property 17: Login Validation Rejects Empty Fields**
  - **Validates: Requirements 6.5**
  - Generate login attempts with empty username or password
  - Attempt login
  - Assert login is rejected
  - Test with minimum 100 iterations
  - _Requirements: 6.5_

- [ ]* 29. Write property test for JSON serialization round-trip
  - **Property 18: JSON Serialization Round-Trip**
  - **Validates: Requirements 8.2, 8.3**
  - Generate random JavaScript objects
  - Serialize with JSON.stringify and deserialize with JSON.parse
  - Assert parsed object equals original object
  - Test with minimum 100 iterations
  - _Requirements: 8.2, 8.3_

- [ ] 30. Final checkpoint - Ensure all tests pass and theme system works end-to-end
  - Run all unit tests and verify they pass
  - Run all property-based tests and verify they pass
  - Manually verify theme changes propagate to all screens
  - Verify theme persists across app restart
  - Verify no console errors or warnings
  - Ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 8 and 30) ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All screens must use `useAppConfig()` hook to receive theme updates
- No hardcoded colors should remain in screens or components after implementation
- Theme colors should be applied consistently across all UI elements

