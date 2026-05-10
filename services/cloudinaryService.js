// Cloudinary Upload Service
// Cấu hình: Thay đổi CLOUD_NAME và UPLOAD_PRESET với thông tin của bạn

const CLOUD_NAME = 'dhnrlnoee';
const UPLOAD_PRESET = 'course_upload';

/**
 * Upload ảnh lên Cloudinary
 * @param {string} uri - URI của ảnh từ device
 * @returns {Promise<string>} - URL của ảnh đã upload
 */
export const uploadImageToCloudinary = async (uri) => {
  try {
    // Kiểm tra cấu hình
    if (CLOUD_NAME === 'YOUR_CLOUD_NAME' || UPLOAD_PRESET === 'YOUR_UPLOAD_PRESET') {
      throw new Error(
        'Cloudinary chưa được cấu hình. Vui lòng cập nhật CLOUD_NAME và UPLOAD_PRESET trong services/cloudinaryService.js'
      );
    }

    const formData = new FormData();
    
    // Thêm file vào form data
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `product-${Date.now()}.jpg`,
    });
    
    // Thêm upload preset
    formData.append('upload_preset', UPLOAD_PRESET);
    
    console.log('Uploading to Cloudinary:', {
      cloud: CLOUD_NAME,
      preset: UPLOAD_PRESET,
      uri: uri.substring(0, 50) + '...',
    });
    
    // Upload lên Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary error response:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }
    
    console.log('Upload successful:', data.secure_url);
    return data.secure_url; // Trả về URL của ảnh
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw error;
  }
};

/**
 * Delete ảnh từ Cloudinary (cần public_id)
 * @param {string} publicId - Public ID của ảnh trên Cloudinary
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    // Lưu ý: Xóa ảnh cần API key, nên thường được xử lý ở backend
    // Hàm này chỉ là reference
    console.log('Delete image:', publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};
