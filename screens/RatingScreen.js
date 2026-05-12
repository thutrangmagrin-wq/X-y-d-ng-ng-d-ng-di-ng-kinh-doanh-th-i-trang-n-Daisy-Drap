import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { useAppConfig } from '../context/AppConfigContext';
import { getUser, saveUser } from '../services/storageService';

export default function RatingScreen({ navigation, route }) {
  const { config } = useAppConfig();
  const { product, orderId } = route.params || {};
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = async () => {
    if (!rating) {
      Alert.alert('Lỗi', 'Vui lòng chọn số sao');
      return;
    }

    setLoading(true);
    try {
      const userData = await getUser();
      console.log('📝 Current userData.reviews:', userData?.reviews);
      
      // Tạo đánh giá mới
      const newReview = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        orderId: orderId,
        rating: rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        userName: userData.fullName || userData.username,
      };

      // Ensure reviews is always an array
      let reviewsArray = [];
      if (Array.isArray(userData.reviews)) {
        reviewsArray = userData.reviews;
      } else if (userData.reviews && typeof userData.reviews === 'object') {
        // If it's an object, convert to array
        reviewsArray = Object.values(userData.reviews);
      }
      
      const updatedReviews = [...reviewsArray, newReview];
      const updatedUser = { ...userData, reviews: updatedReviews };
      
      console.log('💾 Saving review:', newReview);
      console.log('📊 Total reviews after save:', updatedReviews.length);
      const saveResult = await saveUser(updatedUser);
      console.log('✅ Review saved successfully, result:', saveResult);
      
      // Reset form
      setRating(0);
      setComment('');
      console.log('🔒 Setting submitted to true');
      setSubmitted(true);
      console.log('✅ Submitted state set to true');
      
      Alert.alert('✅ Thành công', `Cảm ơn bạn đã đánh giá ${product.name}!`, [
        {
          text: 'OK',
          onPress: () => {
            console.log('👈 Going back to previous screen');
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi đánh giá. Vui lòng thử lại.');
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: config.backgroundColor }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: config.primaryColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Product Info */}
        <View style={[styles.productCard, { backgroundColor: COLORS.surface }]}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>
              {product.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </Text>
          </View>
          <Text style={styles.productId}>Mã sản phẩm: {product.id}</Text>
        </View>

        {/* Rating Section */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={styles.sectionTitle}>Đánh giá của bạn</Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
                disabled={submitted}
              >
                <Text style={[styles.star, submitted && { opacity: 0.5 }]}>
                  {rating >= star ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.ratingLabels}>
            <Text style={styles.ratingLabel}>
              {rating === 0 && 'Chọn số sao'}
              {rating === 1 && '😞 Rất tệ'}
              {rating === 2 && '😕 Tệ'}
              {rating === 3 && '😐 Bình thường'}
              {rating === 4 && '😊 Tốt'}
              {rating === 5 && '😍 Tuyệt vời'}
            </Text>
          </View>
        </View>

        {/* Comment Section */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={styles.sectionTitle}>Nhận xét (tùy chọn)</Text>
          
          <TextInput
            style={[styles.commentInput, { borderColor: config.primaryColor }]}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={5}
            value={comment}
            onChangeText={setComment}
            maxLength={500}
            editable={!submitted}
          />
          
          <Text style={styles.charCount}>
            {comment.length}/500
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: config.primaryColor, opacity: submitted ? 0.5 : 1 }]}
          onPress={handleSubmitReview}
          disabled={loading || submitted}
        >
          <Ionicons name={submitted ? 'checkmark-circle' : 'send'} size={18} color="#fff" />
          <Text style={styles.submitBtnText}>
            {submitted ? '✅ Đã gửi đánh giá' : loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: config.primaryColor + '15', borderLeftColor: config.primaryColor }]}>
          <Ionicons name="information-circle" size={20} color={config.primaryColor} />
          <Text style={[styles.infoText, { color: config.primaryColor }]}>
            Đánh giá của bạn sẽ giúp những khách hàng khác đưa ra quyết định tốt hơn
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  productCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 20,
    ...SHADOW.sm,
  },
  productHeader: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  productId: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  section: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    ...SHADOW.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
  },
  ratingLabels: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  commentInput: {
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 16,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    borderLeftWidth: 3,
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});
