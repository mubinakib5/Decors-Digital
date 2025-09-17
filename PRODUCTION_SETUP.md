# Production Setup Guide

This guide will help you resolve the "Configuration Error" and properly set up the authentication system in production.

## 🚨 Current Issue: Configuration Error

The error "There is a problem with the server configuration" indicates that required environment variables are missing in your production environment.

## ✅ Quick Fix Steps

### 1. **Set Environment Variables in Production**

Your production server needs these environment variables:

```env
NEXTAUTH_SECRET=your-super-secret-nextauth-key
NEXTAUTH_URL=https://your-actual-domain.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/decors_digital
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key
```

### 2. **Platform-Specific Instructions**

#### **For Vercel:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable from the list above

#### **For Netlify:**
1. Go to your Netlify dashboard
2. Select your site
3. Go to Site settings → Environment variables
4. Add each variable from the list above

#### **For cPanel/Shared Hosting:**
1. Log into your cPanel
2. Go to "Environment Variables" or "PHP Variables"
3. Add each variable from the list above

#### **For VPS/Custom Server:**
1. Create a `.env.production` file on your server
2. Add all environment variables
3. Ensure your deployment script loads these variables

### 3. **Generate Secure Keys**

Generate secure secrets using these commands:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

### 4. **Database Configuration**

Ensure your MongoDB setup is correct:

1. **MongoDB Atlas (Recommended for Production):**
   - Create a cluster at mongodb.com
   - Get your connection string
   - Replace `<username>`, `<password>`, and `<cluster>` with actual values
   - Whitelist your production server's IP address

2. **Connection String Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/decors_digital
   ```

### 5. **Domain Configuration**

Set `NEXTAUTH_URL` to your exact production domain:
- ✅ Correct: `https://decorsdigital.com`
- ✅ Correct: `https://www.decorsdigital.com`
- ❌ Wrong: `http://decorsdigital.com` (missing https)
- ❌ Wrong: `https://decorsdigital.com/` (trailing slash)

## 🔧 Troubleshooting

### Error: "Configuration Error"
- **Cause:** Missing environment variables
- **Solution:** Set all required environment variables in your hosting platform

### Error: "Database Connection Failed"
- **Cause:** Invalid MongoDB URI or network restrictions
- **Solution:** Check connection string and whitelist server IP in MongoDB Atlas

### Error: "Invalid Secret"
- **Cause:** Missing or invalid NEXTAUTH_SECRET
- **Solution:** Generate a new secret using `openssl rand -base64 32`

### Error: "Redirect URI Mismatch"
- **Cause:** NEXTAUTH_URL doesn't match your domain
- **Solution:** Set NEXTAUTH_URL to your exact production domain

## 🧪 Testing Your Setup

After setting environment variables, test your authentication:

1. **Visit your login page:** `https://yourdomain.com/admin/auth/signin`
2. **Try logging in with your admin credentials**
3. **Check browser console for any errors**
4. **Verify database connection in your hosting logs**

## 📋 Environment Variables Checklist

Copy this checklist and verify each item:

- [ ] `NEXTAUTH_SECRET` - Generated 32-character secret
- [ ] `NEXTAUTH_URL` - Your exact production domain with https
- [ ] `MONGODB_URI` - Valid MongoDB connection string
- [ ] `ADMIN_USERNAME` - Your admin username
- [ ] `ADMIN_PASSWORD` - Your admin password
- [ ] `JWT_SECRET` - Generated secret for API routes
- [ ] All variables are set in your hosting platform
- [ ] No trailing spaces or quotes in variable values
- [ ] MongoDB cluster allows connections from your server IP

## 🔒 Security Best Practices

1. **Use strong passwords** for admin accounts
2. **Generate unique secrets** for each environment
3. **Never commit** `.env` files to version control
4. **Regularly rotate** secrets and passwords
5. **Use HTTPS** in production (never HTTP)
6. **Whitelist specific IPs** in MongoDB Atlas

## 📞 Support

If you continue to experience issues:

1. Check your hosting platform's error logs
2. Verify all environment variables are correctly set
3. Test MongoDB connection separately
4. Ensure your domain has valid SSL certificate

## 🚀 Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Admin login tested
- [ ] SSL certificate active
- [ ] Domain properly configured
- [ ] Error logging enabled
- [ ] Backup strategy in place

---

**Note:** After setting environment variables, you may need to restart your application or redeploy for changes to take effect.