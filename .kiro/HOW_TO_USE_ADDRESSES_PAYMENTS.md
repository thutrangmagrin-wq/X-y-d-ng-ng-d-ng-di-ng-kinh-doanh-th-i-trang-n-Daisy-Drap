# 📍 How to Add & View Addresses and Payment Methods

## ✅ How It Works

When you add an address or payment method, it's automatically saved to your profile and should appear in ProfileScreen.

## 🚀 Step-by-Step Guide

### Adding an Address

1. **Go to Profile Tab**
   - Tap the Profile icon at the bottom

2. **Click on "Địa chỉ" (Addresses) Tab**
   - You'll see the addresses section

3. **Click "Thêm" (Add) Button**
   - A form will appear

4. **Fill in the form**
   - Tên địa chỉ (Address name): e.g., "Nhà riêng"
   - Số điện thoại (Phone): e.g., "0123456789"
   - Địa chỉ chi tiết (Full address): e.g., "123 Đường ABC, TP HCM"

5. **Click "Thêm địa chỉ" (Add Address)**
   - You'll see "Thành công" (Success) message
   - Address is now saved

6. **Go back to Profile**
   - The address should appear in the "Địa chỉ" tab
   - If not, try closing and reopening the app

### Adding a Payment Method

1. **Go to Profile Tab**
   - Tap the Profile icon at the bottom

2. **Click on "Thanh toán" (Payment) Tab**
   - You'll see the payment methods section

3. **Click "Thêm" (Add) Button**
   - A form will appear

4. **Fill in the form**
   - Tên thẻ (Card name): e.g., "Visa"
   - Loại thẻ (Card type): Choose from dropdown
   - Số thẻ (Card number): e.g., "4111 1111 1111 1111"
   - Ngày hết hạn (Expiry date): e.g., "12/25" (MM/YY)

5. **Click "Thêm" (Add)**
   - You'll see "Thành công" (Success) message
   - Payment method is now saved

6. **Go back to Profile**
   - The payment method should appear in the "Thanh toán" tab
   - If not, try closing and reopening the app

## 🔍 Troubleshooting

### Issue: Address/Payment Method Not Showing After Adding

**Solution 1: Refresh the Screen**
1. Go back to Profile
2. Click on the same tab again
3. The data should appear

**Solution 2: Close and Reopen App**
1. Close the app completely
2. Reopen the app
3. Go to Profile
4. Check the tab again

**Solution 3: Check Console Logs**
1. Open browser console (F12)
2. Add an address/payment method
3. Look for these logs:
   - `💾 Saving addresses: 1` or `💾 Saving payment methods: 1`
   - `✅ Address save result: true` or `✅ Payment method save result: true`
4. Go back to Profile
5. Look for `📍 Addresses: 1` or `💳 Payment methods: 1`

If you see "save result: false", there's an issue with saving.

### Issue: Form Validation Error

**Solution**: Make sure all required fields are filled:
- Address: name, phone, full address
- Payment: card name, card number (13-19 digits), expiry date (MM/YY)

### Issue: Invalid Card Number

**Solution**: Card number must be:
- 13-19 digits
- Only numbers (no spaces or special characters)
- Valid format (e.g., "4111111111111111")

### Issue: Invalid Expiry Date

**Solution**: Expiry date must be:
- Format: MM/YY (e.g., "12/25")
- Month: 01-12
- Year: 2-digit year

## 📊 Data Structure

### Addresses
```javascript
{
  id: "1234567890",
  name: "Nhà riêng",
  phone: "0123456789",
  address: "123 Đường ABC, TP HCM",
  isDefault: false
}
```

### Payment Methods
```javascript
{
  id: "1234567890",
  type: "credit_card",
  cardName: "Visa",
  cardNumber: "4111 1111 1111 1111",
  expiryDate: "12/25",
  isDefault: false
}
```

## ✨ Features

- ✅ Add multiple addresses
- ✅ Add multiple payment methods
- ✅ Set default address/payment method
- ✅ Edit existing address/payment method
- ✅ Delete address/payment method
- ✅ Data persists across app sessions

## 🎯 Tips

1. **Set a default address** - Click "Đặt làm mặc định" (Set as default)
2. **Set a default payment method** - Click the checkbox when adding
3. **Edit address/payment** - Click the pencil icon
4. **Delete address/payment** - Click the trash icon
5. **View all addresses** - Go to Profile → Addresses tab

## 📝 Common Questions

**Q: Where are my addresses saved?**
A: They're saved in your user profile in AsyncStorage. They persist across app sessions.

**Q: Can I have multiple addresses?**
A: Yes! You can add as many addresses as you want.

**Q: Can I have multiple payment methods?**
A: Yes! You can add as many payment methods as you want.

**Q: How do I change my default address?**
A: Click "Đặt làm mặc định" (Set as default) on the address you want to use.

**Q: How do I delete an address?**
A: Click the trash icon on the address card.

**Q: Is my payment information secure?**
A: Payment information is stored locally on your device. Never share your card details with anyone.

---

**Status**: ✅ Addresses and Payment Methods are working correctly
