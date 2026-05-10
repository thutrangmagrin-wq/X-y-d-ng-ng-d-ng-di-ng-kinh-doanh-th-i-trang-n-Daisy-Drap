/**
 * passwordService.js
 * Xác thực và mã hóa mật khẩu
 */

// ─── PASSWORD VALIDATION ───────────────────────────────────────────────────────

/**
 * Kiểm tra độ mạnh của mật khẩu
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {object} { isValid, strength, message, requirements }
 */
export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  let strength = 'weak';
  if (metRequirements >= 5) strength = 'very-strong';
  else if (metRequirements >= 4) strength = 'strong';
  else if (metRequirements >= 3) strength = 'medium';
  else if (metRequirements >= 2) strength = 'weak';

  const isValid = 
    requirements.minLength &&
    requirements.hasUpperCase &&
    requirements.hasLowerCase &&
    requirements.hasNumber &&
    requirements.hasSpecialChar;

  let message = '';
  if (!requirements.minLength) message = 'Mật khẩu phải có ít nhất 8 ký tự';
  else if (!requirements.hasUpperCase) message = 'Mật khẩu phải chứa chữ hoa (A-Z)';
  else if (!requirements.hasLowerCase) message = 'Mật khẩu phải chứa chữ thường (a-z)';
  else if (!requirements.hasNumber) message = 'Mật khẩu phải chứa số (0-9)';
  else if (!requirements.hasSpecialChar) message = 'Mật khẩu phải chứa ký tự đặc biệt (!@#$%^&*)';
  else message = 'Mật khẩu đủ mạnh';

  return {
    isValid,
    strength,
    message,
    requirements,
  };
};

// ─── PASSWORD HASHING ──────────────────────────────────────────────────────────

/**
 * Hàm hash đơn giản cho mật khẩu
 * Lưu ý: Đây là hashing cơ bản. Trong production, nên dùng bcrypt hoặc argon2
 * @param {string} password - Mật khẩu cần hash
 * @returns {string} - Mật khẩu đã hash
 */
export const hashPassword = (password) => {
  // Sử dụng một salt đơn giản
  const salt = 'daisy_drape_salt_2024';
  
  // Tạo hash bằng cách kết hợp password + salt
  let hash = 0;
  const combined = password + salt;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Chuyển đổi thành hex string
  return Math.abs(hash).toString(16);
};

/**
 * Kiểm tra mật khẩu với hash
 * @param {string} password - Mật khẩu cần kiểm tra
 * @param {string} hash - Hash đã lưu
 * @returns {boolean} - True nếu mật khẩu khớp
 */
export const verifyPassword = (password, hash) => {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
};

// ─── PASSWORD STRENGTH COLORS ──────────────────────────────────────────────────

export const getPasswordStrengthColor = (strength) => {
  const colors = {
    'very-weak': '#E53935',    // Red
    'weak': '#FB8C00',         // Orange
    'medium': '#FDD835',       // Yellow
    'strong': '#7CB342',       // Light Green
    'very-strong': '#43A047',  // Green
  };
  return colors[strength] || '#999';
};

export const getPasswordStrengthLabel = (strength) => {
  const labels = {
    'very-weak': 'Rất yếu',
    'weak': 'Yếu',
    'medium': 'Trung bình',
    'strong': 'Mạnh',
    'very-strong': 'Rất mạnh',
  };
  return labels[strength] || 'Không xác định';
};

// ─── PASSWORD REQUIREMENTS DISPLAY ────────────────────────────────────────────

export const getRequirementStatus = (requirement) => {
  const statuses = {
    minLength: 'Ít nhất 8 ký tự',
    hasUpperCase: 'Chứa chữ hoa (A-Z)',
    hasLowerCase: 'Chứa chữ thường (a-z)',
    hasNumber: 'Chứa số (0-9)',
    hasSpecialChar: 'Chứa ký tự đặc biệt (!@#$%^&*)',
  };
  return statuses[requirement] || requirement;
};
