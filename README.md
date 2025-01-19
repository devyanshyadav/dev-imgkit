
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
      VITE_AWS_ACCESS_KEY=YOUR_ACCESS_KEY
      VITE_AWS_SECRET_KEY=YOUR_SECRET_KEY
      VITE_AWS_BUCKET_NAME=YOUR_BUCKET
      VITE_AWS_REGION=YOUR_REGION
      VITE_CLOUDFRONT_DOMAIN=YOUR_CLOUDFRONT
      VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
      VITE_APP_USER_POOL_ID=YOUR_APP_USER_POOL_ID
      VITE_USER_POOL_ID=YOUR_USER_POOL_ID
      VITE_POOL_WEB_CLIENT_ID=YOUR_APP_USER_POOL_CLIENT_ID
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
- [YOUTUBE Concept Video](https://www.youtube.com/watch?v=5iEgfqugU5Y&t=2s)
- [GEMINI API Documentation](https://ai.google.dev/gemini-api/docs)
- [Dev Components](https://dev-components.vercel.app/)


---

For detailed backend implementation, including AWS services configuration, check out our [blog post](https://www.developerthink.com/blogs/on-fly-image-transformation-pipeline-using-amazon-cloudfront-and-aws-lambda) on building a scalable Image or File transformation system.

---
