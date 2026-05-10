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
import { COLORS, RADIUS } from '../constants/theme';
import { resetAdminPassword } from '../services/storageService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: verify email, 2: reset password
  const [showPassword, setShowPassword] = useState(false);

  const SECURITY_QUESTION = 'Tên cửa hàng của bạn là gì?';
  const SECURITY_ANSWER = 'daisydrape'; // Lowercase for comparison

  const handleVerifyEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    if (email.toLowerCase() !== 'admin@daisydrape.com') {
      Alert.alert('Lỗi', 'Email không tồn tại');
      return;
    }

    setStep(2);
  };

  const handleResetPassword = async () => {
    if (!securityAnswer.trim()) {
      Alert.alert('Lỗi', 'Vui lòng trả lời câu hỏi bảo mật');
      return;
    }

    if (securityAnswer.toLowerCase() !== SECURITY_ANSWER) {
      Alert.alert('Lỗi', 'Câu trả lời không chính xác');
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setLoading(true);
    try {
      const result = await resetAdminPassword(newPassword);
      if (result.success) {
        Alert.alert('Thành công', 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.', [
          {
            text: 'OK',
            onPress: () => navigation?.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>DaisyDrape</Text>
          <Text style={styles.subtitle}>Quên mật khẩu</Text>
        </View>

        {step === 1 ? (
          // Step 1: Verify Email
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Admin</Text>
              <TextInput
                style={styles.input}
                placeholder="admin@daisydrape.com"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.btn, { opacity: loading ? 0.6 : 1 }]}
              onPress={handleVerifyEmail}
              disabled={loading}
            >
              <Text style={styles.btnText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Step 2: Reset Password
          <View style={styles.form}>
            {/* Security Question */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Câu hỏi bảo mật</Text>
              <Text style={styles.question}>{SECURITY_QUESTION}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập câu trả lời"
                placeholderTextColor={COLORS.textMuted}
                value={securityAnswer}
                onChangeText={setSecurityAnswer}
                editable={!loading}
              />
              <Text style={styles.hint}>💡 Gợi ý: Tên cửa hàng của bạn</Text>
            </View>

            {/* New Password */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor={COLORS.textMuted}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
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

            {/* Password Requirements */}
            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
              <Text style={styles.requirementItem}>• Ít nhất 8 ký tự</Text>
              <Text style={styles.requirementItem}>• Chứa chữ hoa, chữ thường, số, ký tự đặc biệt</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  setStep(1);
                  setSecurityAnswer('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={loading}
              >
                <Text style={styles.backBtnText}>Quay lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { opacity: loading ? 0.6 : 1 }]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.btnText}>
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Back to Login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Nhớ mật khẩu? </Text>
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
  question: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    padding: 12,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 8,
  },
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
  hint: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  requirements: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 6,
  },
  requirementItem: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backBtn: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backBtnText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  loginLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});
