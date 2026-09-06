# DinToGo Image Upload System

## Overview
The DinToGo platform includes a complete image upload system with local file storage for the MVP.

## Architecture

### Backend Storage
- **Location**: `backend/uploads/` directory
- **Structure**: Organized by type (avatars, covers, dinners, restaurants, general)
- **Serving**: Static files served at `/uploads/*` endpoint
- **Limits**: 5MB per file, max 10 files per request
- **Formats**: JPEG, JPG, PNG, GIF, WebP

### API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/uploads/single` | POST | ✓ | Upload single image |
| `/api/uploads/multiple` | POST | ✓ | Upload multiple images (max 10) |
| `/api/uploads/avatar` | POST | ✓ | Upload user avatar |
| `/api/uploads/cover` | POST | ✓ | Upload cover image |
| `/api/uploads/dinner` | POST | ✓ | Upload dinner images (max 5) |
| `/api/uploads/restaurant` | POST | ✓ | Upload restaurant images (max 10) |
| `/api/uploads` | DELETE | ✓ | Delete uploaded file |

### Request Format

**Single Image Upload:**
```javascript
const formData = new FormData();
formData.append('image', file); // or 'avatar', 'cover'

const response = await uploadsAPI.uploadSingle(formData);
// response.data.data.url = "/uploads/general/image-1234567890.jpg"
```

**Multiple Images Upload:**
```javascript
const formData = new FormData();
files.forEach(file => formData.append('images', file));

const response = await uploadsAPI.uploadDinnerImages(formData);
// response.data.data = [{ url: "/uploads/dinners/images-123.jpg", ... }, ...]
```

### Frontend Component

**ImageUpload Component** (`frontend/src/components/ImageUpload.jsx`):

```jsx
import ImageUpload from '../components/ImageUpload';

// Single image upload
<ImageUpload
  value={formData.avatar}
  onChange={(url) => setFormData({ ...formData, avatar: url })}
  endpoint="avatar"
  label="Upload Avatar"
/>

// Multiple images upload
<ImageUpload
  value={formData.images}
  onChange={(urls) => setFormData({ ...formData, images: urls })}
  endpoint="dinner"
  multiple={true}
  maxFiles={5}
  label="Upload Dinner Photos"
/>
```

**Component Props:**
- `value`: Current value (string URL or array of URLs)
- `onChange`: Callback with new value(s)
- `multiple`: Enable multiple file selection (default: false)
- `maxFiles`: Maximum files for multiple upload (default: 5)
- `label`: Button label text
- `preview`: Show image previews (default: true)
- `endpoint`: Upload endpoint type ('single', 'avatar', 'cover', 'dinner', 'restaurant', 'multiple')
- `className`: Additional CSS classes
- `accept`: File accept attribute (default: 'image/*')

## Usage Examples

### Profile Avatar Upload
```jsx
const [avatar, setAvatar] = useState(user?.avatar || '');

<ImageUpload
  value={avatar}
  onChange={setAvatar}
  endpoint="avatar"
  label="Change Avatar"
/>
```

### Dinner Cover Image
```jsx
const [coverImage, setCoverImage] = useState('');

<ImageUpload
  value={coverImage}
  onChange={setCoverImage}
  endpoint="cover"
  label="Upload Cover Image"
/>
```

### Multiple Dinner Photos
```jsx
const [images, setImages] = useState([]);

<ImageUpload
  value={images}
  onChange={setImages}
  endpoint="dinner"
  multiple={true}
  maxFiles={5}
  label="Add Photos"
/>
```

## File Organization

```
backend/uploads/
├── avatars/          # User profile pictures
├── covers/           # Cover images (profiles, dinners)
├── dinners/          # Dinner event photos
├── restaurants/      # Restaurant images
└── general/          # General uploads
```

## Security Features

1. **File Type Validation**: Only images (JPEG, PNG, GIF, WebP) allowed
2. **File Size Limit**: 5MB per file
3. **File Count Limit**: Max 10 files per request
4. **Path Traversal Protection**: Delete endpoint validates file paths
5. **Authentication Required**: All upload endpoints require valid JWT token

## Production Considerations

For production deployment, consider:

1. **Cloud Storage**: Migrate to AWS S3, Cloudinary, or similar
2. **CDN**: Serve images through CDN for better performance
3. **Image Optimization**: Add compression and resizing
4. **Backup**: Regular backups of uploads directory
5. **Cleanup**: Periodic cleanup of orphaned files

### Cloudinary Integration (Optional)

The backend already has Cloudinary configuration in `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

To enable Cloudinary:
1. Install: `npm install cloudinary`
2. Create `backend/src/utils/cloudinary.js`
3. Update upload controller to use Cloudinary when configured

## API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/avatars/avatar-1234567890.jpg",
    "filename": "avatar-1234567890.jpg",
    "originalName": "profile.jpg",
    "size": 245678,
    "mimetype": "image/jpeg"
  }
}
```

**Multiple Files Response:**
```json
{
  "success": true,
  "data": [
    {
      "url": "/uploads/dinners/images-1234567890.jpg",
      "filename": "images-1234567890.jpg",
      "originalName": "photo1.jpg",
      "size": 345678,
      "mimetype": "image/jpeg"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Only image files (jpeg, png, gif, webp) are allowed.",
  "statusCode": 400
}
```

## Testing

1. Start backend: `npm run dev:backend`
2. Upload endpoint: `POST http://localhost:5000/api/uploads/single`
3. Access uploaded file: `http://localhost:5000/uploads/general/filename.jpg`
