# Git Deployment Guide for cPanel

## Issue: Diverging Branches Error

The error you're encountering is a common Git issue when deploying to cPanel:

```
Error: (XID xpvfch) "/usr/local/cpanel/3rdparty/bin/git" reported error code "128"
hint: Diverging branches can't be fast-forwarded
fatal: Not possible to fast-forward, aborting.
```

## 🔧 Solution Steps

### Step 1: Fix Local Repository

1. **Commit all changes locally**
   ```bash
   git add .
   git commit -m "Update project files"
   ```

2. **Push to GitHub first**
   ```bash
   git push host main
   ```

### Step 2: Configure cPanel Git Repository

1. **Login to cPanel**
   - Go to your cPanel dashboard
   - Navigate to "Files" → "Git Version Control"

2. **Create/Update Repository**
   - Click "Create" or "Manage" your existing repository
   - Set the repository name (e.g., `website`)
   - Choose the branch: `main`
   - Set the repository URL: `https://github.com/mubinakib5/Decors-Digital.git`

3. **Initial Setup**
   - Click "Create" to set up the repository
   - This will clone your GitHub repository to cPanel

### Step 3: Deploy Using cPanel Interface

#### Option A: Manual Deployment (Recommended for first time)

1. **In cPanel Git Version Control**
   - Click "Update from Remote"
   - This will pull the latest changes from GitHub
   - Click "Deploy HEAD Commit"
   - This will run your `.cpanel.yml` deployment script

#### Option B: Automatic Deployment

1. **Push to GitHub**
   ```bash
   git push host main
   ```

2. **cPanel will automatically deploy** when it detects changes

### Step 4: Verify Deployment

1. **Check deployment logs** in cPanel Git Version Control
2. **Visit your website** to confirm it's working
3. **Check for any error messages** in the deployment output

## 🚨 Troubleshooting

### If you still get the diverging branches error:

1. **Reset cPanel repository**
   ```bash
   # In cPanel terminal or SSH
   cd /home/yourusername/repositories/website
   git fetch origin
   git reset --hard origin/main
   ```

2. **Force push from local**
   ```bash
   # In your local repository
   git push host main --force
   ```

3. **Update cPanel repository**
   - Go to cPanel Git Version Control
   - Click "Update from Remote"
   - Click "Deploy HEAD Commit"

### Alternative: Fresh Setup

If the above doesn't work, start fresh:

1. **Delete existing cPanel repository**
   - Go to cPanel Git Version Control
   - Click "Delete" on your existing repository

2. **Create new repository**
   - Click "Create"
   - Repository name: `website`
   - Repository URL: `https://github.com/mubinakib5/Decors-Digital.git`
   - Branch: `main`

3. **Deploy immediately**
   - Click "Deploy HEAD Commit" after creation

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All changes are committed to GitHub
- [ ] `.cpanel.yml` file is in the root directory
- [ ] `DEPLOYPATH` in `.cpanel.yml` matches your cPanel username
- [ ] `next.config.mjs` is configured for static export
- [ ] All dependencies are properly listed in `package.json`

## 🔄 Regular Deployment Workflow

### For future updates:

1. **Make changes locally**
   ```bash
   # Edit your files
   git add .
   git commit -m "Description of changes"
   ```

2. **Push to GitHub**
   ```bash
   git push host main
   ```

3. **Deploy to cPanel**
   - Go to cPanel Git Version Control
   - Click "Update from Remote"
   - Click "Deploy HEAD Commit"

## 📞 Support

If you continue to have issues:

1. **Check cPanel error logs**
2. **Verify your cPanel username** in `.cpanel.yml`
3. **Contact your hosting provider** for Git support
4. **Check cPanel Git Version Control documentation**

## 🎯 Success Indicators

Your deployment is successful when:

- ✅ No error messages in cPanel
- ✅ Website loads correctly
- ✅ All pages are accessible
- ✅ Static files are served properly
- ✅ Scroll-to-top button works
- ✅ All images and assets load

---

**Note**: This guide assumes you're using the username `thedvozp` in your `.cpanel.yml` file. Adjust the paths accordingly if your username is different.
