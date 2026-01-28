# Quick Setup Reference

Fast lookup for all URLs and credentials needed.

## 📋 Service Credentials Checklist

Print or save this section and fill in as you go:

### GitHub
- [ ] Repository URL: `https://github.com/YOUR_USERNAME/YOUR_REPO`
- [ ] Branch: `main`

### MongoDB Atlas
- [ ] Connection String: `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
- [ ] Database Name: `table_booking`
- [ ] Username: `admin`
- [ ] Password: `[SAVED SECURELY]`

### Cloudinary
- [ ] Cloud Name: `_________________`
- [ ] API Key: `_________________`
- [ ] API Secret: `[SAVED SECURELY]`
- [ ] Upload Preset: `table-booking`

### Vercel Deployments
- [ ] API URL: `https://table-booking-api.vercel.app`
- [ ] Admin URL: `https://table-booking-admin.vercel.app`
- [ ] User App URL: `https://table-booking-user-app.vercel.app`

---

## 🔐 Environment Variables Templates

### api/.env
```bash
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-random-string-min-32-characters
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
NODE_ENV=production
```

### dineeasy-admin-main/.env
```bash
VITE_API_URL=https://table-booking-api.vercel.app
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=table-booking
```

### table-feast user/.env
```bash
VITE_API_URL=https://table-booking-api.vercel.app
```

---

## ⚡ Quick Deployment Commands

### Push Updates to GitHub
```bash
cd "d:\Table booking"
git add .
git commit -m "Your message here"
git push origin main
```

### Redeploy on Vercel (after pushing to GitHub)
- Vercel automatically redeploys on push
- Check Vercel dashboard for status
- Wait 2-3 minutes for deployment

### Update Environment Variables
1. Go to Vercel project dashboard
2. Settings → Environment Variables
3. Update and save
4. Redeploy from Deployments tab

---

## 🧪 Testing URLs

After each deployment, test these:

**API Health Check:**
```
https://table-booking-api.vercel.app/health
```

**Admin Panel:**
```
https://table-booking-admin.vercel.app
```

**User App:**
```
https://table-booking-user-app.vercel.app
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Vite Docs**: https://vitejs.dev

---

## 🎯 Common Commands

```bash
# Check git status
git status

# View git log
git log --oneline

# Pull latest from GitHub
git pull origin main

# Check Node version
node --version

# Check npm version
npm --version

# Install dependencies (run in each project folder)
npm install

# Build locally (run in each project folder)
npm run build

# Test locally (run in API folder)
npm run dev
```

---

## 💾 Security Reminders

⚠️ **NEVER commit secrets to GitHub**
- Use `.env.example` for templates
- Store actual passwords securely
- Vercel environment variables are encrypted
- Use strong passwords (20+ characters recommended)

---

## 📝 Deployment Checklist (One-Time)

- [ ] Read full DEPLOYMENT.md
- [ ] Create GitHub account & repository
- [ ] Create MongoDB Atlas account & cluster
- [ ] Create Cloudinary account
- [ ] Create Vercel account (linked to GitHub)
- [ ] Deploy API
- [ ] Deploy Admin Panel
- [ ] Deploy User App
- [ ] Test all three apps
- [ ] Bookmark all three URLs
- [ ] Save credentials securely

---

## 🔄 Regular Maintenance

**Weekly:**
- Check Vercel deployment status
- Monitor MongoDB usage

**Monthly:**
- Review Cloudinary usage
- Check for security updates

**As Needed:**
- Update environment variables
- Redeploy applications
- Backup data

---

**Happy Deployment! 🚀**
