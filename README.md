
# Dev ImgKit - Cloud Image or File Management Solution using AWS Services

![Banner Img](/public/banner.jpg)

A powerful Image or File management platform built with React Vite and AWS services, featuring advanced Image/File transformations and AI-powered capabilities.

## 🌟 Features

### Authentication & Security
- **AWS Cognito Integration**
  - Secure user authentication
  - Email/Password registration
  - Password reset functionality
  - Forgot password recovery
  - Protected routes and API endpoints

### Image or File Management
- **Upload & Storage**
  - Drag & drop file upload
  - Multiple file selection
  - Direct S3 bucket storage

- **Bulk Operations**
  - Multi-select files
  - Batch delete
  - Bulk share functionality
  - Download multiple files as ZIP

### Image or File Transformations
- **Advanced Transformations and Effects**
  - Resize (width/height)
  - Rotation
  - Crop
  - Format conversion
  - Quality adjustment
  - Filters and overlays
  - Brightness/Contrast
  - Saturation control
  - Blur effects
  - and more

### AI-Powered Features
- **GEMINI API Integration**
  - AI-based Image transformation
  - Instant Image transformations

## 🚀 Getting Started

1. **Install Dependencies**
    ```bash
    npm install
    ```

2. **Configure Environment Variables**
    ```env
    # AWS Configuration
    VITE_APP_CLOUDFRONT_URL=your-cloudfront-url
    VITE_APP_REGION=your-aws-region
    VITE_APP_USER_POOL_ID=your-cognito-user-pool-id
    VITE_APP_USER_POOL_CLIENT_ID=your-client-id

    # API Configuration
    VITE_APP_API_ENDPOINT=your-api-endpoint
    VITE_GEMINI_API_KEY=your-gemini-api-key
    ```

3. **Run Development Server**
    ```bash
    npm run dev
    ```

## 🔄 Using Image or File Transformations

### Basic URL Parameters
```
https://your-cloudfront-url/t_w-200_h-300_r-45/image.jpg
```
- `w-{pixels}`: Width
- `h-{pixels}`: Height
- `r-{degrees}`: Rotation
- `e-{effect}`: Special effects

### Advanced Transformations
```typescript
// Example transformation object
const transforms = {
    resize:{width: 200,height: 300},
    rotation: 45,
    effects: ['blur', 'grayscale'],
    quality: 80
};
```

### AI Transformations
```typescript
// Example transformation Prompt
convert this Image to a square and apply a blur effect
```

## 🔒 Authentication Flow

1. **User Registration**
   - Email verification required
   - Password strength requirements
   - MFA option available

2. **Password Reset**
   - Email-based reset flow
   - Security question verification
   - Temporary password generation

## 📦 Production Build

```bash
npm run build
```

## 🔗 Related Resources

- [Backend Architecture Blog](https://www.developerthink.com/blogs/on-fly-image-transformation-pipeline-using-amazon-cloudfront-and-aws-lambda)
- [YOUTUBE CONCEPT VIDEO](https://www.youtube.com/watch?v=5iEgfqugU5Y&t=2s)
- [GEMINI API Documentation](https://ai.google.dev/gemini-api/docs)


## 📝 License

MIT License - See LICENSE file for details

---

For detailed backend implementation, including AWS services configuration, check out our [blog post](https://www.developerthink.com/blogs/on-fly-image-transformation-pipeline-using-amazon-cloudfront-and-aws-lambda) on building a scalable Image or File transformation system.

---
