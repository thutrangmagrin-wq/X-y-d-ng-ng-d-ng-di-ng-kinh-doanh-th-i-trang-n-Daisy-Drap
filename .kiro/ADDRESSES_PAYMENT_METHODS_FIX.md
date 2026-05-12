# 📍 Addresses & Payment Methods - Debugging Guide

## Issue
User added addresses and payment methods, but they don't show in ProfileScreen

## Root Cause Analysis

The issue is likely one of these:

1. **Data not being saved** - saveUser() failed silently
2. **Data not being reloaded** - ProfileScreen didn't refresh after returning
3. **Data structure issue** - addresses/paymentMethods not initialized properly

## Debugging Steps

### Step 1: Check Console Logs

When you add an address or payment method, watch for these logs:

**Adding Address**:
```
💾 Saving addresses: 1
✅ Address save result: true
```

**Adding Payment Method**:
```
💾 Saving payment methods: 1
✅ Payment method save result: true
```

**Returning to ProfileScreen**:
```
📝 Loading user data in ProfileScreen
👤 User data loaded: user@example.com
📍 Addresses: 1
💳 Payment methods: 1
📝 Reviews: 0
```

### Step 2: Verify Data is Saved

If you see the save logs but ProfileScreen shows 0 addresses/payment methods:

1. **Check if saveUser() returned true**
   - If false: AsyncStorage save failed
   - If true: Data was saved

2. **Check if ProfileScreen reloaded**
   - Look for "📝 Loading user data in ProfileScreen" log
   - Check the address/payment method count

### Step 3: Manual Test

1. **Add an address**:
   - Go to Profile → Addresses → Add
   - Fill in all fields
   - Click "Thêm địa chỉ"
   - Watch console for logs
   - Go back to Profile
   - Check if address appears

2. **Add a payment method**:
   - Go to Profile → Payment Methods → Add
   - Fill in all fields
   - Click "Thêm"
   - Watch console for logs
   - Go back to Profile
   - Check if payment method appears

## Common Issues & Solutions

### Issue 1: Save logs show but data doesn't appear

**Symptom**: 
```
💾 Saving addresses: 1
✅ Address save result: true
```
But ProfileScreen shows "Chưa có địa chỉ nào"

**Solution**:
1. Check if ProfileScreen is reloading (look for "📝 Loading user data" log)
2. If not reloading, the useFocusEffect might not be working
3. Try closing and reopening the app
4. Check if userData is null in ProfileScreen

### Issue 2: Save logs don't appear

**Symptom**: No console logs when adding address/payment method

**Solution**:
1. Check if the form validation is failing
2. Make sure all required fields are filled
3. Check browser console for errors
4. Try adding again with valid data

### Issue 3: Save returns false

**Symptom**:
```
✅ Address save result: false
```

**Solution**:
1. AsyncStorage save failed
2. Check device storage space
3. Check AsyncStorage permissions
4. Try restarting the app

## Enhanced Logging

I've added comprehensive logging to help debug:

### AddressesScreen
```javascript
console.log('📍 AddressesScreen - Loaded addresses:', data?.addresses?.length || 0);
console.log('💾 Saving addresses:', updatedAddresses.length);
console.log('✅ Address save result:', saveResult);
```

### PaymentMethodsScreen
```javascript
console.log('💳 PaymentMethodsScreen - Loaded payment methods:', data?.paymentMethods?.length || 0);
console.log('💾 Saving payment methods:', updatedMethods.length);
console.log('✅ Payment method save result:', saveResult);
```

### ProfileScreen
```javascript
console.log('📝 Loading user data in ProfileScreen');
console.log('👤 User data loaded:', data?.email);
console.log('📍 Addresses:', data?.addresses?.length || 0);
console.log('💳 Payment methods:', data?.paymentMethods?.length || 0);
console.log('📝 Reviews:', data?.reviews?.length || 0);
```

## Testing Checklist

- [ ] Add an address
- [ ] Check console for "💾 Saving addresses: 1"
- [ ] Check console for "✅ Address save result: true"
- [ ] Go back to Profile
- [ ] Check console for "📍 Addresses: 1"
- [ ] Verify address appears in ProfileScreen
- [ ] Add a payment method
- [ ] Check console for "💾 Saving payment methods: 1"
- [ ] Check console for "✅ Payment method save result: true"
- [ ] Go back to Profile
- [ ] Check console for "💳 Payment methods: 1"
- [ ] Verify payment method appears in ProfileScreen

## Data Structure

### Addresses
```javascript
userData.addresses = [
  {
    id: "1234567890",
    name: "Nhà riêng",
    phone: "0123456789",
    address: "123 Đường ABC, TP HCM",
    isDefault: true
  }
]
```

### Payment Methods
```javascript
userData.paymentMethods = [
  {
    id: "1234567890",
    type: "credit_card",
    cardName: "Visa",
    cardNumber: "4111 1111 1111 1111",
    expiryDate: "12/25",
    isDefault: true
  }
]
```

## Next Steps

1. **Monitor console logs** when adding addresses/payment methods
2. **Check if data is being saved** (look for "✅ Address save result: true")
3. **Verify ProfileScreen reloads** (look for "📍 Addresses: X" log)
4. **Report any issues** with specific console logs

---

**Status**: Enhanced logging added to help debug addresses and payment methods issues
