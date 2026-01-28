# 📚 Documentation Index

Complete guide to deploying your Table Booking System on Vercel.

## 📖 Documentation Files

### 1. **DEPLOYMENT.md** (Main Guide)
**Complete step-by-step deployment instructions**
- Prerequisites (accounts needed)
- GitHub setup
- MongoDB Atlas configuration
- Cloudinary setup
- Vercel project setup
- Deploy each component (API, Admin, User App)
- Post-deployment configuration
- Testing & troubleshooting
- Full checklist

**👉 Start here if you want detailed instructions for each step**

---

### 2. **VISUAL_DEPLOYMENT_GUIDE.md** (Visual Steps)
**Screenshot descriptions and what you should see**
- Visual walkthrough of each step
- Expected outputs for each stage
- What buttons to click
- Where to find credentials
- Step-by-step verification

**👉 Use this if you need visual guidance**

---

### 3. **QUICK_SETUP.md** (Quick Reference)
**Fast lookup and templates**
- Credentials checklist to fill in
- Environment variable templates
- Quick deployment commands
- Testing URLs
- Common commands reference
- Security reminders
- Weekly/monthly maintenance checklist

**👉 Use this for quick reference while deploying**

---

## 🚀 Quick Start Path

Follow these steps in order:

### Phase 1: Prerequisites (30 minutes)
1. ✅ Create GitHub account (free)
2. ✅ Create Vercel account (free, link to GitHub)
3. ✅ Create MongoDB Atlas account (free)
4. ✅ Create Cloudinary account (free)

**→ Read**: DEPLOYMENT.md sections 1-4

---

### Phase 2: GitHub Setup (5 minutes)
1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Verify code is online

**→ Read**: DEPLOYMENT.md section "GitHub Setup"

---

### Phase 3: Services Configuration (30 minutes)
1. ✅ Setup MongoDB Atlas
   - Create cluster
   - Create database user
   - Get connection string
   
2. ✅ Setup Cloudinary
   - Create account
   - Get API credentials
   - Create upload preset

**→ Read**: DEPLOYMENT.md sections "Database Setup" and "Image Hosting Setup"

---

### Phase 4: Deploy API (15 minutes)
1. ✅ Create Vercel project for API
2. ✅ Set root directory to `api`
3. ✅ Add environment variables
4. ✅ Deploy
5. ✅ Test API health endpoint

**→ Read**: DEPLOYMENT.md section "Deploy API Backend"

---

### Phase 5: Deploy Admin Panel (15 minutes)
1. ✅ Create Vercel project for admin
2. ✅ Set root directory to `dineeasy-admin-main`
3. ✅ Add environment variables (with API URL)
4. ✅ Deploy
5. ✅ Test admin loads

**→ Read**: DEPLOYMENT.md section "Deploy Admin Panel"

---

### Phase 6: Deploy User App (15 minutes)
1. ✅ Create Vercel project for user app
2. ✅ Set root directory to `table-feast user`
3. ✅ Add environment variables (with API URL)
4. ✅ Deploy
5. ✅ Test user app loads

**→ Read**: DEPLOYMENT.md section "Deploy User App"

---

### Phase 7: Final Configuration (10 minutes)
1. ✅ Update environment variables if needed
2. ✅ Redeploy applications
3. ✅ Test all three URLs work

**→ Read**: DEPLOYMENT.md section "Post-Deployment Configuration"

---

## 📋 Checklist Before You Start

- [ ] You have GitHub account
- [ ] You have Vercel account (linked to GitHub)
- [ ] You have MongoDB Atlas account
- [ ] You have Cloudinary account
- [ ] Your code is in GitHub repository
- [ ] You understand what each app does:
  - **API**: Backend server handling data
  - **Admin Panel**: Restaurant admin dashboard
  - **User App**: Customer-facing mobile/web app

---

## 🔑 Critical Information

### Three Deployments Needed
You'll create **three separate Vercel projects**:

| Project | Root Directory | URL |
|---------|---|---|
| API | `api` | `https://table-booking-api.vercel.app` |
| Admin Panel | `dineeasy-admin-main` | `https://table-booking-admin.vercel.app` |
| User App | `table-feast user` | `https://table-booking-user-app.vercel.app` |

### Most Common Mistake
❌ **Wrong**: Deploying all from root directory
✅ **Right**: Each project from its own root directory

### Environment Variables Are Critical
Without these, your apps won't work:
- API needs: `MONGODB_URI`, `JWT_SECRET`, Cloudinary keys
- Admin needs: `VITE_API_URL`, Cloudinary info
- User App needs: `VITE_API_URL`

---

## ⚠️ Important Notes

### Database
- MongoDB Atlas M0 (free tier) is sufficient for testing
- Production: Consider M2 tier later
- Make sure IP is whitelisted

### Image Uploads
- Cloudinary free tier: 25GB storage, 25K transformations/month
- Perfect for testing/small production use

### Deployment Time
- First deployment: 3-5 minutes each
- Subsequent deployments: 1-2 minutes each

---

## 🆘 Need Help?

### Common Issues

**"Build Failed"**
- Check environment variables in Vercel
- Verify build command in vercel.json
- Check for TypeScript errors locally

**"Cannot connect to database"**
- Verify MongoDB connection string
- Check IP is whitelisted
- Ensure password is correct (escape special chars if needed)

**"Images not uploading"**
- Verify Cloudinary credentials
- Check upload preset is unsigned
- Look at browser console errors

**"API URL not working"**
- Make sure API is deployed first
- Update `VITE_API_URL` in frontends
- Redeploy frontends after changing variable

### Get Help From
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/cloud
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## 📞 Support Resources

### Documentation You Have
1. **DEPLOYMENT.md** - Detailed step-by-step
2. **VISUAL_DEPLOYMENT_GUIDE.md** - What you should see
3. **QUICK_SETUP.md** - Quick reference & templates
4. **README.md** - Project overview

### Official Documentation
- Vercel: https://vercel.com/docs
- MongoDB: https://docs.mongodb.com
- Cloudinary: https://cloudinary.com/documentation
- Vite: https://vitejs.dev

---

## 💡 Pro Tips

1. **Save your URLs** as soon as they're created
2. **Keep credentials secure** - never share API keys
3. **Test each step** before moving to next
4. **Check Vercel logs** if deployment fails
5. **Use QUICK_SETUP.md** as reference while deploying

---

## ✅ Success Indicators

You know you're done when:
- ✅ `https://table-booking-api.vercel.app/health` shows API status
- ✅ `https://table-booking-admin.vercel.app` shows admin login
- ✅ `https://table-booking-user-app.vercel.app` shows customer app
- ✅ No errors in browser console (F12)
- ✅ All three projects visible in Vercel dashboard

---

## 🎯 Next Steps After Deployment

1. **Share your URLs** with team members
2. **Test admin login** with test credentials
3. **Test user app** navigation
4. **Add custom domain** (optional but recommended)
5. **Setup automated backups** for MongoDB
6. **Monitor API usage** in Vercel dashboard

---

## 📈 Scaling in Future

When you're ready to scale:
- Upgrade MongoDB tier for more storage
- Upgrade Vercel for more API calls
- Setup CDN for faster image delivery
- Consider dedicated API server

---

## 🎉 Ready to Deploy?

Pick your starting point:

- **Want step-by-step detailed guide?** → Read **DEPLOYMENT.md**
- **Want visual walkthrough?** → Read **VISUAL_DEPLOYMENT_GUIDE.md**
- **Want quick reference?** → Use **QUICK_SETUP.md**

---

**Good luck with your deployment! 🚀**

Estimated total time: **2-3 hours** for complete setup

