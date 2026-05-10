import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../../../constants/theme';
import { getCollections, saveCollections, getProducts } from '../../../services/storageService';

export default function CollectionsTab({ onDataChange }) {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productIds: [],
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  const loadData = useCallback(async () => {
    const c = await getCollections();
    const p = await getProducts();
    setCollections(c);
    setProducts(p);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(useCallback(() => {
    loadData();
  }, [loadData]));

  const handleOpenModal = (collection = null) => {
    if (collection) {
      setEditingId(collection.id);
      setFormData({
        name: collection.name,
        description: collection.description,
        productIds: collection.productIds || [],
      });
      setSelectedProducts(collection.productIds || []);
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', productIds: [] });
      setSelectedProducts([]);
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setFormData({ name: '', description: '', productIds: [] });
    setSelectedProducts([]);
  };

  const handleToggleProduct = (productId) => {
    const updated = selectedProducts.includes(productId)
      ? selectedProducts.filter((id) => id !== productId)
      : [...selectedProducts, productId];
    setSelectedProducts(updated);
    setFormData({ ...formData, productIds: updated });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên bộ sưu tập');
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }

    try {
      let updated = [...collections];

      if (editingId) {
        // Update existing
        updated = updated.map((c) =>
          c.id === editingId
            ? { ...c, ...formData, productIds: selectedProducts }
            : c
        );
      } else {
        // Add new
        const newCollection = {
          id: Date.now().toString(),
          ...formData,
          productIds: selectedProducts,
          createdAt: new Date().toISOString(),
        };
        updated = [newCollection, ...updated];
      }

      await saveCollections(updated);
      setCollections(updated);
      handleCloseModal();
      Alert.alert('Thành công', editingId ? 'Cập nhật thành công' : 'Thêm thành công');
      onDataChange?.();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu bộ sưu tập');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Xóa bộ sưu tập', 'Bạn có chắc muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const updated = collections.filter((c) => c.id !== id);
            await saveCollections(updated);
            setCollections(updated);
            Alert.alert('Thành công', 'Xóa thành công');
            onDataChange?.();
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa bộ sưu tập');
          }
        },
      },
    ]);
  };

  const renderCollectionItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: COLORS.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.collectionName}>{item.name}</Text>
          <Text style={styles.collectionDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.productCount}>
            {item.productIds?.length || 0} sản phẩm
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => handleOpenModal(item)}
          >
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Preview */}
      {item.productIds && item.productIds.length > 0 && (
        <View style={styles.productPreview}>
          {products
            .filter((p) => item.productIds.includes(p.id))
            .slice(0, 3)
            .map((p) => (
              <Image
                key={p.id}
                source={{ uri: p.image }}
                style={styles.previewImage}
              />
            ))}
          {item.productIds.length > 3 && (
            <View style={styles.moreIndicator}>
              <Text style={styles.moreText}>+{item.productIds.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderProductOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.productOption,
        selectedProducts.includes(item.id) && styles.productOptionSelected,
      ]}
      onPress={() => handleToggleProduct(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.productOptionImage} />
      <View style={styles.productOptionInfo}>
        <Text style={styles.productOptionName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productOptionPrice}>
          {item.price.toLocaleString('vi-VN')} ₫
        </Text>
      </View>
      <View
        style={[
          styles.checkbox,
          selectedProducts.includes(item.id) && styles.checkboxChecked,
        ]}
      >
        {selectedProducts.includes(item.id) && (
          <Ionicons name="checkmark" size={16} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bộ Sưu Tập</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleOpenModal()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {collections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>Chưa có bộ sưu tập nào</Text>
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          renderItem={renderCollectionItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Chỉnh sửa bộ sưu tập' : 'Thêm bộ sưu tập'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Name Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tên bộ sưu tập</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên bộ sưu tập"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Nhập mô tả bộ sưu tập"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Product Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Chọn sản phẩm ({selectedProducts.length} được chọn)
                </Text>
                <FlatList
                  data={products}
                  keyExtractor={(item) => item.id}
                  renderItem={renderProductOption}
                  scrollEnabled={false}
                  nestedScrollEnabled={true}
                />
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { padding: 16, paddingBottom: 24 },
  card: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardInfo: { flex: 1, marginRight: 12 },
  collectionName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  collectionDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  productCount: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productPreview: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceWarm,
  },
  moreIndicator: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  productOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  productOptionImage: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    marginRight: 12,
  },
  productOptionInfo: {
    flex: 1,
  },
  productOptionName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  productOptionPrice: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
