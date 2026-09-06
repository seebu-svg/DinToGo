import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { uploadsAPI, resolveImageUrl } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Reusable image upload component
 * Supports single and multiple file uploads
 */
const ImageUpload = ({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  label = 'Upload Image',
  preview = true,
  endpoint = 'single', // 'single', 'avatar', 'cover', 'dinner', 'restaurant', 'multiple'
  className = '',
  accept = 'image/*',
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState(
    value ? (Array.isArray(value) ? value.map(resolveImageUrl) : [resolveImageUrl(value)]) : []
  );
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file count
    if (!multiple && files.length > 1) {
      toast.error('Please select only one file.');
      return;
    }

    if (multiple && files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      toast.error('Only image files (JPEG, PNG, GIF, WebP) are allowed.');
      return;
    }

    // Validate file size (5MB)
    const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Each file must be less than 5MB.');
      return;
    }

    // Show local previews immediately
    if (preview) {
      const localUrls = files.map(f => URL.createObjectURL(f));
      setPreviewUrls(multiple ? [...previewUrls, ...localUrls] : localUrls);
    }

    // Upload files
    setUploading(true);
    try {
      const formData = new FormData();
      
      // Determine the field name based on endpoint
      const fieldName = endpoint === 'dinner' || endpoint === 'restaurant' || endpoint === 'multiple' ? 'images' : 
                        endpoint === 'avatar' ? 'avatar' : 
                        endpoint === 'cover' ? 'cover' : 'image';
      
      files.forEach(file => formData.append(fieldName, file));

      let response;
      switch (endpoint) {
        case 'avatar':
          response = await uploadsAPI.uploadAvatar(formData);
          break;
        case 'cover':
          response = await uploadsAPI.uploadCover(formData);
          break;
        case 'dinner':
          response = await uploadsAPI.uploadDinnerImages(formData);
          break;
        case 'restaurant':
          response = await uploadsAPI.uploadRestaurantImages(formData);
          break;
        case 'multiple':
          response = await uploadsAPI.uploadMultiple(formData);
          break;
        default:
          response = await uploadsAPI.uploadSingle(formData);
      }

      const uploadedData = response.data.data;
      const urls = multiple 
        ? (Array.isArray(uploadedData) ? uploadedData.map(f => f.url) : [uploadedData.url])
        : [uploadedData.url];

      setPreviewUrls(urls);
      onChange(multiple ? urls : urls[0]);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
      // Revert preview on error
      setPreviewUrls(value ? (Array.isArray(value) ? value : [value]) : []);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    onChange(multiple ? newUrls : newUrls[0] || '');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-charcoal-700">
          {label}
        </label>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? 'Uploading...' : label}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        {multiple && (
          <span className="text-xs text-charcoal-400">
            Max {maxFiles} files, 5MB each
          </span>
        )}
      </div>

      {/* Preview Grid */}
      {preview && previewUrls.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-charcoal-100 bg-cream-50">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={14} />
              </button>

              {/* Upload Overlay */}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader size={24} className="text-white animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {preview && previewUrls.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-charcoal-200 rounded-xl p-8 text-center">
          <ImageIcon size={32} className="mx-auto text-charcoal-300 mb-2" />
          <p className="text-sm text-charcoal-500">No image uploaded yet</p>
          <p className="text-xs text-charcoal-400 mt-1">Click the button above to upload</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
