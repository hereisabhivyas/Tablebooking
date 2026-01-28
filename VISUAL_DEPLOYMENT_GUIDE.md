# Visual Step-by-Step Deployment Guide

This guide includes descriptions of what you should see at each step.

---

## STEP 1: GitHub Repository Setup

### 1.1 Create Repository
- **Go to**: https://github.com/new
- **Fill in**:
  - Repository name: `table-booking-system`
  - Description: `Table booking and restaurant management system`
  - Visibility: `Public` (or Private)
- **Click**: Create repository
- **You should see**: Empty repository with instructions

### 1.2 Push Your Code
```bash
cd "d:\Table booking"
git remote add origin https://github.com/YOUR_USERNAME/table-booking-system.git
git branch -M main
git push -u origin main
```

**Expected output**:
```
Enumerating objects: 261, done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Verify**: Go to your GitHub repo URL - you should see all your code files

---

## STEP 2: MongoDB Atlas Setup

### 2.1 Create Account
- **Go to**: https://mongodb.com/cloud/atlas
- **Sign up** with email or Google
- **You should see**: MongoDB Welcome page

### 2.2 Create Project
- **Click**: "+ New Project"
- **Enter name**: `table-booking`
- **Click**: Create Project
- **You should see**: Project dashboard loading

### 2.3 Create Cluster
- **Click**: "Build a Database"
- **Select**: M0 FREE (gray "Recommended" badge)
- **Provider**: AWS (or your choice)
- **Region**: Choose closest to you (e.g., us-east-1)
- **Click**: Create
- **Wait**: 2-3 minutes for cluster to initialize
- **You should see**: Cluster status changes from "Building" to "Available"

### 2.4 Create Database User
- **Left sidebar**: Click "Database Access"
- **Click**: "+ Add New Database User"
- **Authentication**: Select "Password"
- **Username**: `admin`
- **Password**: Click "Auto-generate" and copy it
- **Role**: Select "Atlas Admin"
- **Click**: "Add User"
- **You should see**: User listed with status "Active"

### 2.5 Get Connection String
- **Left sidebar**: Click "Databases"
- **Your cluster card**: Click "Connect"
- **Select**: "Drivers"
- **Language**: Select "Node.js" version "4.1 or later"
- **Copy**: Connection string
  ```
  mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- **Replace**: `<password>` with your actual password

**Save this**: It's critical for the API

### 2.6 Allow Network Access
- **Left sidebar**: "Network Access"
- **Click**: "+ Add IP Address"
- **Select**: "Allow Access from Anywhere"
- **Click**: "Confirm"
- **You should see**: IP address `0.0.0.0/0` listed

---

## STEP 3: Cloudinary Setup

### 3.1 Create Account
- **Go to**: https://cloudinary.com
- **Click**: "Sign up"
- **Fill details** and verify email
- **You should see**: Cloudinary Dashboard

### 3.2 Get Credentials
- **Dashboard** shows three credentials:
  ```
  Cloud Name: _______________
  API Key: _______________
  API Secret: [hidden] _______________
  ```
- **Save these**: You'll need them in environment variables

### 3.3 Create Upload Preset
- **Top menu**: Click "Settings" (gear icon)
- **Tab**: Click "Upload"
- **Scroll**: Find "Upload presets" section
- **Click**: "+ Add upload preset"
- **Fill in**:
  - **Name**: `table-booking`
  - **Unsigned**: Toggle ON (blue switch)
- **Click**: "Save"
- **You should see**: Preset listed as "Unsigned"

**Save**: Upload preset name (`table-booking`)

---

## STEP 4: Vercel Account Setup

### 4.1 Create Account
- **Go to**: https://vercel.com
- **Click**: "Sign Up"
- **Select**: "Continue with GitHub"
- **Authorize**: Vercel to access GitHub
- **You should see**: Vercel Dashboard

---

## STEP 5: Deploy API Backend

### 5.1 Create Vercel Project
- **Vercel Dashboard**: Click "Add New..." → "Project"
- **Step 1**: "Import Repository"
  - **Select**: Your `table-booking-system` repository
  - **Click**: "Import"
- **You should see**: Project configuration screen

### 5.2 Configure Project
- **Project Name**: Change to `table-booking-api`
- **Framework**: Leave as "Other"
- **Root Directory**: Click dropdown, select `api`
- **Click**: "Deploy"

### 5.3 Add Environment Variables (IMPORTANT!)
- **Wait**: For first deployment to complete (2-3 min)
- **After deployment**: Go to "Settings" → "Environment Variables"
- **Add each variable**:
  
  Variable 1:
  - **Name**: `MONGODB_URI`
  - **Value**: `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
  - Click "Save"

  Variable 2:
  - **Name**: `JWT_SECRET`
  - **Value**: `your-super-secret-random-key-min-32-chars`
  - Click "Save"

  Variable 3:
  - **Name**: `CLOUDINARY_CLOUD_NAME`
  - **Value**: `your_cloud_name`
  - Click "Save"

  Variable 4:
  - **Name**: `CLOUDINARY_API_KEY`
  - **Value**: `your_api_key`
  - Click "Save"

  Variable 5:
  - **Name**: `CLOUDINARY_API_SECRET`
  - **Value**: `your_api_secret`
  - Click "Save"

### 5.4 Redeploy with Variables
- **After adding variables**: Go to "Deployments"
- **Latest deployment**: Click "..."menu
- **Click**: "Redeploy"
- **You should see**: New deployment starting
- **Wait**: 2-3 minutes for completion

**Save your API URL**: Shown in green, like `https://table-booking-api.vercel.app`

### 5.5 Test API
- **Open browser**: Visit `https://table-booking-api.vercel.app/health`
- **You should see**: JSON response with API status

---

## STEP 6: Deploy Admin Panel

### 6.1 Create Vercel Project
- **Vercel Dashboard**: Click "Add New..." → "Project"
- **Select**: `table-booking-system` repository
- **Click**: "Import"

### 6.2 Configure Project
- **Project Name**: `table-booking-admin`
- **Framework**: Select "Vite"
- **Root Directory**: Select `dineeasy-admin-main`
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `dist`

### 6.3 Add Environment Variables
- **After first deployment**: Settings → Environment Variables
- **Add**:
  - `VITE_API_URL` = Your API URL (e.g., `https://table-booking-api.vercel.app`)
  - `VITE_CLOUDINARY_CLOUD_NAME` = Your cloud name
  - `VITE_CLOUDINARY_UPLOAD_PRESET` = `table-booking`

### 6.4 Redeploy
- **Deployments** → Redeploy latest

**Save your Admin URL**: Like `https://table-booking-admin.vercel.app`

### 6.5 Test Admin
- **Open browser**: Visit admin URL
- **You should see**: Admin login page with form fields

---

## STEP 7: Deploy User App

### 7.1 Create Vercel Project
- **Vercel Dashboard**: Click "Add New..." → "Project"
- **Select**: `table-booking-system` repository
- **Click**: "Import"

### 7.2 Configure Project
- **Project Name**: `table-booking-user-app`
- **Framework**: Select "Vite"
- **Root Directory**: Select `table-feast user`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 7.3 Add Environment Variables
- **After first deployment**: Settings → Environment Variables
- **Add**:
  - `VITE_API_URL` = Your API URL (e.g., `https://table-booking-api.vercel.app`)

### 7.4 Redeploy
- **Deployments** → Redeploy latest

**Save your User App URL**: Like `https://table-booking-user-app.vercel.app`

### 7.5 Test User App
- **Open browser**: Visit user app URL
- **You should see**: Customer app homepage/menu page

---

## STEP 8: Verify All Deployments

### Checklist:
- [ ] API URL loads and shows health status
- [ ] Admin URL shows login page
- [ ] User App URL shows homepage
- [ ] No red error badges in Vercel dashboards
- [ ] All three projects in Vercel dashboard

### If Something Fails:
1. **Go to** Vercel project → Deployments
2. **Click** failed deployment
3. **Scroll down** to see error logs in red text
4. **Common errors**:
   - Missing environment variables
   - Build command failed (check npm scripts)
   - Connection string incorrect

---

## STEP 9: Final Configuration

### Update All Environment Variables
After all three apps are deployed:

**Admin Panel** (redeploy):
- `VITE_API_URL` should point to your API

**User App** (redeploy):
- `VITE_API_URL` should point to your API

---

## Summary: Your Live URLs

After completing all steps, you have:

```
🌐 Admin Panel:    https://table-booking-admin.vercel.app
🌐 User App:       https://table-booking-user-app.vercel.app
🔌 API Backend:    https://table-booking-api.vercel.app
```

These are your production URLs! Share with users and team members.

---

## Troubleshooting Checklist

### If Admin/User App doesn't load:
- [ ] Check if `VITE_API_URL` is set correctly
- [ ] Verify API is deployed and accessible
- [ ] Check browser console (F12) for errors
- [ ] Redeploy the frontend

### If API errors on upload:
- [ ] Check if Cloudinary credentials are correct
- [ ] Verify MongoDB connection string
- [ ] Check JWT_SECRET is set

### If deployments keep failing:
- [ ] Check Vercel deployment logs (red text)
- [ ] Verify root directory is correct
- [ ] Ensure all environment variables are set
- [ ] Try redeploying manually

---

**🎉 You're Done! Your Table Booking System is Live!**

