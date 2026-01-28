# Table Booking System

A comprehensive table booking and restaurant management system with QR code functionality.

## 📁 Project Structure

```
├── api/                    # Backend API (Node.js/TypeScript)
├── dineeasy-admin-main/    # Admin Dashboard (React/Vite)
├── table-feast user/       # Customer App (React/Vite)
└── qr code/               # QR Code Generator
```

## 🚀 Deployment Instructions

This project consists of three separate applications that need to be deployed independently on Vercel:

### 1. API Backend
- Navigate to the `api` folder
- Deploy to Vercel
- Set environment variables in Vercel dashboard

### 2. Admin Panel
- Navigate to the `dineeasy-admin-main` folder
- Deploy to Vercel
- Update API URL in environment variables

### 3. User App
- Navigate to the `table-feast user` folder
- Deploy to Vercel
- Update API URL in environment variables

## 🔧 Environment Variables

### API (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Admin Panel (.env)
```
VITE_API_URL=your_deployed_api_url
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### User App (.env)
```
VITE_API_URL=your_deployed_api_url
```

## 📦 Installation

Each project folder has its own dependencies:

```bash
# API
cd api
npm install

# Admin Panel
cd dineeasy-admin-main
npm install

# User App
cd "table-feast user"
npm install

# QR Code Generator
cd "qr code"
npm install
```

## 🛠️ Local Development

```bash
# API
cd api
npm run dev

# Admin Panel
cd dineeasy-admin-main
npm run dev

# User App
cd "table-feast user"
npm run dev
```

## 📝 Features

- **Admin Dashboard**: Manage restaurants, menus, orders, and analytics
- **Customer App**: Browse menu, place orders, track order status
- **QR Code System**: Table-specific QR codes for seamless ordering
- **Real-time Updates**: Live order tracking and notifications
- **Image Upload**: Cloudinary integration for menu item images
- **Responsive Design**: Works on desktop and mobile devices

## 🔐 Security

- JWT-based authentication
- Environment variable management
- Secure API endpoints
- Input validation and sanitization

## 📄 License

This project is private and proprietary.
