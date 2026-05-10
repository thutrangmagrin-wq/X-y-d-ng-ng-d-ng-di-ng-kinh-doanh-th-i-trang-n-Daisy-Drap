import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../../../constants/theme';
import { useAppConfig } from '../../../context/AppConfigContext';
import { saveProducts } from '../../../services/storageService';
import { uploadImageToCloudinary } from '../../../services/cloudinaryService';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const ProductFormModal = ({ visible, mode, product, onSave, onCancel, primaryColor }) => {
  const [formData, setFormData] = useState(
    product || {
      id: Date.now().toString(),
      name: '',
      price: 0,
      originalPrice: 0,
      category: '',
      description: '',
      image: 'https://via.placeholder.com/300',
      images: [],
      rating: 0,
      sold: 0,
      sizes: ['S', 'M', 'L'],
    }
  );
  const [uploading, setUploading] = useState(false);

  // Reset form khi modal mở ở mode "add"
  useEffect(() => {
    if (visible && mode === 'add') {
      setFormData({
        id: Date.now().toString(),
        name: '',
        price: 0,
        originalPrice: 0,
        category: '',
        description: '',
        image: 'https://via.placeholder.com/300',
        images: [],
        rating: 0,
        sold: 0,
        sizes: ['S', 'M', 'L'],
      });
    } else if (visible && mode === 'edit' && product) {
      setFormData(product);
    }
  }, [visible, mode, product]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploading(true);
        try {
          const imageUrl = await uploadImageToCloudinary(result.assets[0].uri);
          setFormData({ ...formData, image: imageUrl });
          Alert.alert('Thành công', 'Ảnh đã được tải lên');
        } catch (error) {
          Alert.alert('Lỗi', error.message || 'Không thể tải ảnh lên. Vui lòng kiểm tra cấu hình Cloudinary.');
          console.error('Upload error:', error);
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
      console.error('Image picker error:', error);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm');
      return;
    }
    if (formData.price <= 0) {
      Alert.alert('Lỗi', 'Giá phải lớn hơn 0');
      return;
    }
    if (!formData.category.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.modalContainer, { backgroundColor: COLORS.background }]}>
        {/* Modal Header */}
        <View style={[styles.modalHeader, { backgroundColor: primaryColor }]}>
          <TouchableOpacity onPress={onCancel} disabled={uploading}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {mode === 'add' ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={uploading}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.modalForm} contentContainerStyle={styles.modalFormContent}>
          {/* Product Image */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Hình ảnh</Text>
            <View style={[styles.imagePreview, { backgroundColor: COLORS.surface }]}>
              {uploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color={primaryColor} />
                  <Text style={styles.uploadingText}>Đang tải lên...</Text>
                </View>
              ) : (
                <Image
                  source={{ uri: formData.image }}
                  style={styles.previewImage}
                  defaultSource={require('../../../assets/icon.png')}
                />
              )}
            </View>
            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: primaryColor, opacity: uploading ? 0.6 : 1 }]}
              onPress={handlePickImage}
              disabled={uploading}
            >
              <Ionicons name="cloud-upload" size={18} color="#fff" />
              <Text style={styles.uploadBtnText}>
                {uploading ? 'Đang tải...' : 'Chọn ảnh từ thiết bị'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Tên sản phẩm *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: COLORS.surface }]}
              placeholder="Nhập tên sản phẩm"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor={COLORS.textMuted}
              editable={!uploading}
            />
          </View>

          {/* Category */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Danh mục *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: COLORS.surface }]}
              placeholder="Nhập danh mục"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholderTextColor={COLORS.textMuted}
              editable={!uploading}
            />
          </View>

          {/* Price Row */}
          <View style={styles.rowContainer}>
            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.formLabel}>Giá hiện tại *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.surface }]}
                placeholder="0"
                value={formData.price.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: parseInt(text) || 0 })
                }
                keyboardType="numeric"
                placeholderTextColor={COLORS.textMuted}
                editable={!uploading}
              />
            </View>
            <View style={[styles.formSection, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.formLabel}>Giá gốc</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.surface }]}
                placeholder="0"
                value={formData.originalPrice.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, originalPrice: parseInt(text) || 0 })
                }
                keyboardType="numeric"
                placeholderTextColor={COLORS.textMuted}
                editable={!uploading}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Mô tả</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: COLORS.surface }]}
              placeholder="Nhập mô tả sản phẩm"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
              placeholderTextColor={COLORS.textMuted}
              editable={!uploading}
            />
          </View>

          {/* Rating & Sold */}
          <View style={styles.rowContainer}>
            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.formLabel}>Đánh giá</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.surface }]}
                placeholder="0-5"
                value={formData.rating.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, rating: parseFloat(text) || 0 })
                }
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.textMuted}
                editable={!uploading}
              />
            </View>
            <View style={[styles.formSection, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.formLabel}>Đã bán</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.surface }]}
                placeholder="0"
                value={formData.sold.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, sold: parseInt(text) || 0 })
                }
                keyboardType="numeric"
                placeholderTextColor={COLORS.textMuted}
                editable={!uploading}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const ProductRow = ({ product, onEdit, onDelete, primaryColor }) => (
  <View style={[styles.productRow, { backgroundColor: COLORS.surface }]}>
    <Image
      source={{ uri: product.image }}
      style={styles.productImage}
      defaultSource={require('../../../assets/icon.png')}
    />
    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.productCategory}>{product.category}</Text>
      <View style={styles.priceRow}>
        <Text style={[styles.productPrice, { color: primaryColor }]}>
          {formatPrice(product.price)}
        </Text>
        {product.originalPrice > product.price && (
          <Text style={styles.originalPrice}>
            {formatPrice(product.originalPrice)}
          </Text>
        )}
      </View>
    </View>
    <View style={styles.productActions}>
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: `${primaryColor}20` }]}
        onPress={() => onEdit(product)}
      >
        <Ionicons name="pencil" size={18} color={primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: '#F4433620' }]}
        onPress={() => onDelete(product.id)}
      >
        <Ionicons name="trash" size={18} color="#F44336" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProductsTab({ products, onDataChange }) {
  const { config } = useAppConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Nếu có tìm kiếm, chỉ lọc sản phẩm khớp
    if (searchQuery.trim()) {
      filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sắp xếp theo mới nhất trước (dựa trên id hoặc createdAt)
    return filtered.sort((a, b) => {
      const aTime = parseInt(a.id) || 0;
      const bTime = parseInt(b.id) || 0;
      return bTime - aTime;
    });
  }, [products, searchQuery]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert('Xóa sản phẩm', 'Bạn có chắc chắn muốn xóa sản phẩm này?', [
      { text: 'Hủy', onPress: () => {} },
      {
        text: 'Xóa',
        onPress: async () => {
          const updated = products.filter((p) => p.id !== productId);
          await saveProducts(updated);
          onDataChange();
          Alert.alert('Thành công', 'Sản phẩm đã được xóa');
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSaveProduct = async (product) => {
    let updated;
    if (modalMode === 'add') {
      updated = [...products, product];
    } else {
      updated = products.map((p) => (p.id === product.id ? product : p));
    }
    await saveProducts(updated);
    onDataChange();
    setModalVisible(false);
    Alert.alert('Thành công', modalMode === 'add' ? 'Sản phẩm đã được thêm' : 'Sản phẩm đã được cập nhật');
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: config.primaryColor }]}
        onPress={handleAddProduct}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addBtnText}>Thêm sản phẩm</Text>
      </TouchableOpacity>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductRow
              product={item}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              primaryColor={config.primaryColor}
            />
          )}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        visible={modalVisible}
        mode={modalMode}
        product={selectedProduct}
        onSave={handleSaveProduct}
        onCancel={() => setModalVisible(false)}
        primaryColor={config.primaryColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.lg,
    gap: 12,
    ...SHADOW.sm,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modalForm: {
    flex: 1,
  },
  modalFormContent: {
    padding: 16,
    paddingBottom: 24,
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  uploadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadingText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
