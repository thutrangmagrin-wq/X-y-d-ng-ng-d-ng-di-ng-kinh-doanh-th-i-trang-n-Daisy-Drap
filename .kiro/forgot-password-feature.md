# Forgot Password Feature for Admin

## Overview
Đã thêm tính năng "Quên mật khẩu" để admin có thể đặt lại mật khẩu nếu quên.

## Features

### 1. Forgot Password Screen
**Location:** Login Screen → "Quên mật khẩu?" link

**Two-Step Process:**

#### Step 1: Verify Email
- Nhập email admin: `admin@daisydrape.com`
- Hệ thống xác minh email
- Nếu email đúng, chuyển sang Step 2

#### Step 2: Reset Password
- Trả lời câu hỏi bảo mật: **"Tên cửa hàng của bạn là gì?"**
  - Câu trả lời: `daisydrape` (không phân biệt hoa/thường)
- Nhập mật khẩu mới
- Xác nhận mật khẩu
- Nhấn "Đặt lại mật khẩu"

### 2. Security Features
- ✅ Xác minh email admin
- ✅ Câu hỏi bảo mật để xác thực
- ✅ Mật khẩu mới phải có ít nhất 8 ký tự
- ✅ Mật khẩu được hash trước khi lưu
- ✅ Gợi ý câu trả lời để giúp admin nhớ

### 3. UI/UX
- 📝 Form nhập email
- ❓ Câu hỏi bảo mật hiển thị rõ ràng
- 👁️ Toggle hiển thị/ẩn mật khẩu
- 📋 Danh sách yêu cầu mật khẩu
- ⬅️ Nút "Quay lại" để bắt đầu lại
- ✅ Nút "Đặt lại mật khẩu"

## How to Use

### For Admin Who Forgot Password

1. **Vào Login Screen**
2. **Nhấn "Quên mật khẩu?"**
3. **Nhập email**: `admin@daisydrape.com`
4. **Nhấn "Tiếp tục"**
5. **Trả lời câu hỏi bảo mật**: Nhập `daisydrape`
6. **Nhập mật khẩu mới** (phải mạnh: 8+ ký tự, chữ hoa, chữ thường, số, ký tự đặc biệt)
7. **Xác nhận mật khẩu**
8. **Nhấn "Đặt lại mật khẩu"**
9. **Đăng nhập lại** với mật khẩu mới

## Files Created/Modified

### New Files
1. **screens/ForgotPasswordScreen.js**
   - Two-step password reset flow
   - Email verification
   - Security question verification
   - Password reset form

### Modified Files
1. **services/storageService.js**
   - `resetAdminPassword()` - Reset admin password

2. **screens/LoginScreen.js**
   - Added "Quên mật khẩu?" link
   - Added navigation to ForgotPasswordScreen

3. **App.js**
   - Import ForgotPasswordScreen
   - Added ForgotPassword route to AuthStack

## Security Question

**Question:** "Tên cửa hàng của bạn là gì?"  
**Answer:** `daisydrape` (case-insensitive)

This is a simple security question that only the admin should know.

## Password Requirements

New password must have:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*)

## Example Password Reset

**Scenario:** Admin forgot password

1. Click "Quên mật khẩu?" on Login Screen
2. Enter email: `admin@daisydrape.com`
3. Click "Tiếp tục"
4. Answer security question: `daisydrape`
5. Enter new password: `AdminDaisy@2024`
6. Confirm password: `AdminDaisy@2024`
7. Click "Đặt lại mật khẩu"
8. Success! Now login with new password

## Testing Checklist

- [ ] Click "Quên mật khẩu?" link on Login Screen
- [ ] Enter wrong email (should show error)
- [ ] Enter correct email: `admin@daisydrape.com`
- [ ] Click "Tiếp tục"
- [ ] Enter wrong security answer (should show error)
- [ ] Enter correct security answer: `daisydrape`
- [ ] Enter weak password (should show error)
- [ ] Enter strong password
- [ ] Confirm password doesn't match (should show error)
- [ ] Confirm password matches
- [ ] Click "Đặt lại mật khẩu"
- [ ] Success message appears
- [ ] Redirected to Login Screen
- [ ] Login with new password works

## Future Enhancements

- [ ] Email verification (send code to email)
- [ ] SMS verification (send code to phone)
- [ ] Multiple security questions
- [ ] Custom security questions
- [ ] Password reset history
- [ ] Rate limiting for reset attempts
- [ ] Temporary password generation
- [ ] Password reset expiration (24 hours)

## Notes

⚠️ **Important:**
- Security question answer is case-insensitive
- Password is hashed before saving
- Admin must remember the security question answer
- If admin forgets both password and security answer, they need to contact developer
- Consider adding email verification for production

## Current Admin Credentials

**Email:** `admin@daisydrape.com`  
**Default Password:** `admin123` (can be reset using forgot password feature)  
**Security Question Answer:** `daisydrape`
