# Deployment Guide for Namecheap Hosting

## Prerequisites

- Namecheap hosting account
- Access to cPanel or File Manager
- Node.js installed locally (for building)

## Method 1: Static Export (Recommended for Shared Hosting)

### Step 1: Build the Static Export

```bash
# Install dependencies (if not already done)
npm install

# Build the static export
npm run build
```

This will create a `out` folder with all static files.

### Step 2: Upload to Namecheap

1. **Via cPanel File Manager:**

   - Log into your Namecheap cPanel
   - Open File Manager
   - Navigate to `public_html` folder
   - Upload all contents from the `out` folder to `public_html`

2. **Via FTP:**
   - Use an FTP client (FileZilla, Cyberduck, etc.)
   - Connect to your Namecheap hosting
   - Upload all contents from the `out` folder to the root directory

### Step 3: Configure Domain

- Point your domain to the hosting
- The site should be accessible at your domain

## Method 2: Node.js Hosting (If Available)

If your Namecheap plan supports Node.js:

### Step 1: Prepare for Deployment

```bash
npm install
npm run build
```

### Step 2: Upload Files

Upload these folders/files to your hosting:

- `src/` folder
- `public/` folder
- `package.json`
- `next.config.ts`
- `tailwind.config.js`
- `tsconfig.json`
- `.next/` folder (after build)

### Step 3: Install Dependencies on Server

```bash
npm install --production
```

### Step 4: Start the Server

```bash
npm start
```

## Method 3: Using Git Deployment

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Namecheap

- Use Namecheap's Git deployment feature
- Connect your GitHub repository
- Set build command: `npm run build`
- Set output directory: `out`

## Troubleshooting

### Common Issues:

1. **404 Errors:** Make sure all files are in the correct directory
2. **Image Issues:** Check that images are in the `public` folder
3. **Styling Issues:** Ensure CSS files are properly uploaded
4. **Performance:** Consider using a CDN for better performance

### File Structure After Upload:

```
public_html/
├── index.html
├── about/
│   └── index.html
├── services/
│   └── index.html
├── _next/
│   └── static/
├── images/
└── favicon.ico
```

## Performance Optimization

1. **Enable Gzip Compression** in cPanel
2. **Set up Browser Caching** for static assets
3. **Use a CDN** for better global performance
4. **Optimize Images** before uploading

## SSL Certificate

- Enable SSL certificate in Namecheap cPanel
- Update any hardcoded HTTP links to HTTPS

## Support

If you encounter issues:

1. Check Namecheap's hosting documentation
2. Verify file permissions (usually 644 for files, 755 for folders)
3. Check error logs in cPanel
4. Ensure all dependencies are properly installed
