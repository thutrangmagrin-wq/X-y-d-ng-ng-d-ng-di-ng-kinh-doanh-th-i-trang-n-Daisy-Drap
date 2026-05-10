import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { registerUser } from '../services/storageService';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthLabel, getRequirementStatus } from '../services/passwordService';

export default function RegisterScreen({ onLoginSuccess, navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(null);

  const handlePasswordChange = (text) => {
    setPassword(text);
    const validation = validatePassword(text);
    setPasswordValidation(validation);
  };

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!passwordValidation?.isValid) {
      Alert.alert('Lỗi', passwordValidation?.message || 'Mật khẩu không đủ mạnh');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        fullName,
        email,
        password,
        username: email.split('@')[0],
      });

      if (result.success) {
        Alert.alert('Thành công', 'Đăng ký thành công! Đang đăng nhập...', [
          {
            text: 'OK',
            onPress: () => onLoginSuccess(result.user),
          },
        ]);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>DaisyDrape</Text>
          <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên"
              placeholderTextColor={COLORS.textMuted}
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && passwordValidation && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill,
                      { 
                        width: `${(Object.values(passwordValidation.requirements).filter(Boolean).length / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(passwordValidation.strength)
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.strengthLabel, { color: getPasswordStrengthColor(passwordValidation.strength) }]}>
                  Độ mạnh: {getPasswordStrengthLabel(passwordValidation.strength)}
                </Text>
                
                {/* Requirements Checklist */}
                <View style={styles.requirementsContainer}>
                  {Object.entries(passwordValidation.requirements).map(([key, met]) => (
                    <View key={key} style={styles.requirementItem}>
                      <Text style={[styles.requirementIcon, { color: met ? '#4CAF50' : '#999' }]}>
                        {met ? '✓' : '○'}
                      </Text>
                      <Text style={[styles.requirementText, { color: met ? '#4CAF50' : '#999' }]}>
                        {getRequirementStatus(key)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor={COLORS.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerBtn, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerBtnText}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
            <Text style={styles.loginLink}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { 
    fontSize: 36, 
    fontWeight: '700', 
    color: COLORS.primaryDark, 
    marginBottom: 8,
    fontStyle: 'italic',
  },
  subtitle: { fontSize: 16, color: COLORS.textSecondary },
  form: { marginBottom: 24 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  eyeIcon: { fontSize: 18, marginLeft: 8 },
  passwordStrengthContainer: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceWarm,
    borderRadius: RADIUS.md,
  },
  strengthBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementsContainer: {
    gap: 6,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementIcon: {
    fontSize: 14,
    fontWeight: '700',
    width: 16,
  },
  requirementText: {
    fontSize: 11,
    fontWeight: '500',
  },
  registerBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  loginLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});
