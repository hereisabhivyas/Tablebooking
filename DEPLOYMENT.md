# Deployment Guide - Table Booking System

Complete step-by-step instructions to deploy the Table Booking System on Vercel.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Database Setup (MongoDB)](#database-setup-mongodb)
4. [Image Hosting Setup (Cloudinary)](#image-hosting-setup-cloudinary)
5. [Vercel Setup](#vercel-setup)
6. [Deploy API Backend](#deploy-api-backend)
7. [Deploy Admin Panel](#deploy-admin-panel)
8. [Deploy User App](#deploy-user-app)
9. [Post-Deployment Configuration](#post-deployment-configuration)
10. [Testing & Troubleshooting](#testing--troubleshooting)

---

## Prerequisites

Before starting, you need:

- **GitHub Account** - https://github.com (free)
- **Vercel Account** - https://vercel.com (free, linked to GitHub)
- **MongoDB Atlas Account** - https://mongodb.com/cloud/atlas (free tier available)
- **Cloudinary Account** - https://cloudinary.com (free tier available)
- **Node.js & npm** - Already installed on your machine
- **Git** - Already installed on your machine

---

## GitHub Setup

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Fill in the repository details:
   - **Repository name**: `table-booking-system` (or your preferred name)
   - **Description**: "Table booking and restaurant management system"
   - **Visibility**: Choose "Public" or "Private"
   - **Initialize repository**: Leave unchecked (we already have commits)

3. Click **Create repository**

### Step 2: Add Remote and Push Code

Open terminal in `D:\Table booking`:

```bash
# Add GitHub as remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main
git branch -M main

# Push all commits to GitHub
git push -u origin main
```

**Expected output:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
* [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ Your code is now on GitHub!

---

## Database Setup (MongoDB)

### Step 1: Create MongoDB Atlas Account

1. Visit https://www.mongodb.com/cloud/atlas
2. Click **Sign Up** (or Log In if you have an account)
3. Complete the registration

### Step 2: Create a New Project

1. After login, click **New Project**
2. Enter project name: `table-booking`
3. Click **Create Project**

### Step 3: Create a Database Cluster

1. Click **Build a Database**
2. Choose **M0 FREE** tier
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to you
5. Click **Create** (this takes 2-3 minutes)

### Step 4: Create Database User

1. In the left sidebar, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. **Username**: `admin` (or any name you prefer)
5. **Password**: Click **Auto-generate secure password** and copy it somewhere safe
6. Under **Built-in Role**, select **Atlas Admin**
7. Click **Add User**

### Step 5: Get Connection String

1. Go to **Databases** (left sidebar)
2. Click **Connect** on your cluster
3. Select **Drivers**
4. Choose **Node.js** and version **3.6 or later**
5. Copy the connection string that looks like:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>` with the password you created earlier**

**Save this connection string - you'll need it later!**

### Step 6: Allow Access from Anywhere

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development/testing)
4. Click **Confirm**

✅ MongoDB is ready!

---

## Image Hosting Setup (Cloudinary)

### Step 1: Create Cloudinary Account

1. Visit https://cloudinary.com
2. Click **Sign Up** and create account
3. Verify your email

### Step 2: Get Your Credentials

1. After login, go to your **Dashboard**
2. You'll see your credentials:
   - **Cloud Name**: Note this down
   - **API Key**: Note this down
   - **API Secret**: Note this down

### Step 3: Create Upload Preset

1. Go to **Settings** (gear icon)
2. Click **Upload** tab
3. Scroll to **Upload presets**
4. Click **Add upload preset**
5. **Name**: `table-booking` (or any name)
6. **Unsigned**: Toggle **ON** (important for frontend upload)
7. Click **Save**

**Save these three values:**
- Cloud Name
- API Key
- API Secret
- Upload Preset Name

✅ Cloudinary is ready!

---

## Vercel Setup

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

✅ You're now connected to Vercel!

---

## Deploy API Backend

### Step 1: Prepare API Environment Variables

In `api/.env.example`, you should have the structure. Now create the actual values:

```
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-random-string-make-it-long-and-random
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

### Step 2: Deploy API on Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. **Import Git Repository**
4. Select your `table-booking-system` repository
5. Click **Import**

6. **Configure Project:**
   - **Project Name**: `table-booking-api`
   - **Framework Preset**: **Other**
   - **Root Directory**: Select `api` from dropdown

7. **Environment Variables** - Add these:
   - Click **Environment Variables**
   - Add each variable:
     ```
     MONGODB_URI = your_mongodb_connection_string
     JWT_SECRET = your-random-secret-key
     CLOUDINARY_CLOUD_NAME = your_cloud_name
     CLOUDINARY_API_KEY = your_api_key
     CLOUDINARY_API_SECRET = your_api_secret
     ```

8. Click **Deploy**

**⏳ Wait for deployment (2-3 minutes)**

Once done, you'll get a URL like: `https://table-booking-api.vercel.app`

**Save this API URL - you'll need it for the frontends!**

✅ API is deployed!

---

## Deploy Admin Panel

### Step 1: Prepare Admin Environment

In `dineeasy-admin-main`, update `.env.example` or create `.env`:

```
VITE_API_URL=https://table-booking-api.vercel.app
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=table-booking
```

### Step 2: Deploy Admin on Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. **Import Git Repository**
4. Select your `table-booking-system` repository
5. Click **Import**

6. **Configure Project:**
   - **Project Name**: `table-booking-admin`
   - **Framework Preset**: **Vite**
   - **Root Directory**: Select `dineeasy-admin-main` from dropdown
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

7. **Environment Variables** - Add these:
   ```
   VITE_API_URL = https://table-booking-api.vercel.app
   VITE_CLOUDINARY_CLOUD_NAME = your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET = table-booking
   ```

8. Click **Deploy**

**⏳ Wait for deployment (2-3 minutes)**

You'll get a URL like: `https://table-booking-admin.vercel.app`

✅ Admin Panel is deployed!

---

## Deploy User App

### Step 1: Prepare User App Environment

In `table-feast user`, update `.env.example` or create `.env`:

```
VITE_API_URL=https://table-booking-api.vercel.app
```

### Step 2: Deploy User App on Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. **Import Git Repository**
4. Select your `table-booking-system` repository
5. Click **Import**

6. **Configure Project:**
   - **Project Name**: `table-booking-user-app`
   - **Framework Preset**: **Vite**
   - **Root Directory**: Select `table-feast user` from dropdown
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

7. **Environment Variables** - Add this:
   ```
   VITE_API_URL = https://table-booking-api.vercel.app
   ```

8. Click **Deploy**

**⏳ Wait for deployment (2-3 minutes)**

You'll get a URL like: `https://table-booking-user-app.vercel.app`

✅ User App is deployed!

---

## Post-Deployment Configuration

### Step 1: Update Admin Panel Deployment

Now that you have all URLs, update the Admin panel environment variables:

1. Go to **table-booking-admin** project in Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Update `VITE_API_URL` to point to your deployed API
4. Click **Save**
5. Go to **Deployments** and click **Redeploy** on latest deployment

### Step 2: Update User App Deployment

1. Go to **table-booking-user-app** project in Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Update `VITE_API_URL` to point to your deployed API
4. Click **Save**
5. Go to **Deployments** and click **Redeploy** on latest deployment

### Step 3: Add Custom Domains (Optional)

1. In each Vercel project, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions from Vercel

✅ All deployments are configured!

---

## Testing & Troubleshooting

### Test Your Deployments

#### 1. Test API
```
Visit: https://table-booking-api.vercel.app/health
(or your API URL)

Expected: Should return API status
```

#### 2. Test Admin Panel
```
Visit: https://table-booking-admin.vercel.app
Expected: Admin login page loads
```

#### 3. Test User App
```
Visit: https://table-booking-user-app.vercel.app
Expected: Customer app loads
```

### Common Issues & Solutions

#### Issue: "Build Failed" Error
**Solution:**
- Check if all environment variables are set correctly
- Verify `package.json` scripts (build command should exist)
- Check for TypeScript errors: `npm run build` locally

#### Issue: "Cannot connect to MongoDB"
**Solution:**
- Verify MongoDB connection string is correct
- Check if IP is whitelisted in MongoDB Atlas (Network Access)
- Ensure password doesn't contain special characters (encode if needed)

#### Issue: "Images not uploading"
**Solution:**
- Verify Cloudinary credentials are correct
- Check if upload preset is set to "Unsigned"
- Verify Cloud Name matches

#### Issue: "API URL not working in frontend"
**Solution:**
- Make sure `VITE_API_URL` environment variable is set
- Verify API is actually deployed and accessible
- Check browser console for CORS errors
- Add API domain to CORS whitelist in API code

#### Issue: "Changes not showing after push"
**Solution:**
- Make sure you pushed to GitHub: `git push origin main`
- Vercel automatically redeploys on push
- Wait 2-3 minutes for deployment
- Check Vercel dashboard for deployment status

### View Logs

To debug issues:

1. Go to Vercel project dashboard
2. Click **Deployments**
3. Click on a failed deployment
4. Scroll down to see build logs
5. Look for error messages

---

## Final Checklist

Before considering deployment complete:

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas cluster created with user credentials
- [ ] Cloudinary account setup with upload preset
- [ ] API deployed on Vercel with environment variables
- [ ] Admin panel deployed pointing to API URL
- [ ] User app deployed pointing to API URL
- [ ] All three apps are accessible via their URLs
- [ ] Admin login works
- [ ] User app loads without errors
- [ ] API returns status when called

---

## Your Deployment URLs

Once everything is deployed, save these:

```
🔗 Admin Panel: https://table-booking-admin.vercel.app
🔗 User App: https://table-booking-user-app.vercel.app
🔗 API Backend: https://table-booking-api.vercel.app
🗄️  MongoDB: Your Atlas connection
☁️  Cloudinary: Your cloud name
```

---

## Support & Next Steps

If you encounter any issues:
1. Check the "Testing & Troubleshooting" section
2. Review environment variables in Vercel dashboard
3. Check Vercel deployment logs
4. Verify API health at `/health` endpoint

For production readability:
- Add custom domain for professional appearance
- Set up automated backups for MongoDB
- Monitor API usage in Vercel dashboard
- Enable analytics in Cloudinary

---

**Deployment Complete! 🎉**

Your Table Booking System is now live on Vercel!
