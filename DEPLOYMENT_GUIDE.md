# cPanel Deployment Guide for Next.js Website

## Overview
This guide explains how to deploy your Next.js website to cPanel hosting using Git Version Control.

## Prerequisites
- cPanel hosting account with Git Version Control enabled
- Git repository with your website code
- SSH access (recommended)

## Setup Instructions

### 1. Configure cPanel Git Repository

1. **Login to cPanel**
   - Go to your cPanel dashboard
   - Navigate to "Files" → "Git Version Control"

2. **Create Repository**
   - Click "Create" to create a new repository
   - Choose a name for your repository (e.g., `website`)
   - Select the branch you want to deploy (usually `main` or `master`)

3. **Clone Repository Locally**
   ```bash
   git clone ssh://username@yourdomain.com/home/username/repositories/website.git
   cd website
   ```

### 2. Update Deployment Configuration

1. **Edit `.cpanel.yml`**
   - Update the `DEPLOYPATH` to match your cPanel username:
   ```yaml
   - export DEPLOYPATH=/home/YOUR_USERNAME/public_html/
   ```

2. **Commit Configuration**
   ```bash
   git add .cpanel.yml
   git commit -m "Add cPanel deployment configuration"
   git push origin main
   ```

### 3. Deploy Your Website

#### Option A: Automatic Deployment (Push)
```bash
# Make your changes locally
git add .
git commit -m "Update website"
git push origin main
```
The website will automatically deploy when you push to the repository.

#### Option B: Manual Deployment (Pull)
1. Push changes to your remote repository (GitHub, GitLab, etc.)
2. In cPanel Git Version Control:
   - Click "Update from Remote"
   - Click "Deploy HEAD Commit"

## Configuration Files

### `.cpanel.yml`
This file controls the deployment process:
- Builds the Next.js application
- Exports static files
- Copies files to the web directory
- Sets proper permissions

### `next.config.mjs`
Configured for static export:
- `output: 'export'` - Enables static site generation
- `images.unoptimized: true` - Disables image optimization
- `trailingSlash: true` - Adds trailing slashes for static hosting

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check that all dependencies are installed
   - Verify Node.js version compatibility
   - Review build logs in cPanel

2. **Permission Errors**
   - Ensure proper file permissions (644 for files, 755 for directories)
   - Check that the deployment path is correct

3. **Routing Issues**
   - Verify `.htaccess` file is created correctly
   - Check that all pages are properly exported

### Debugging Steps

1. **Check Deployment Logs**
   - In cPanel Git Version Control, view deployment history
   - Look for error messages in the deployment output

2. **Verify File Structure**
   - Ensure all files are copied to the correct location
   - Check that static assets are accessible

3. **Test Locally**
   - Run `npm run build` locally to verify the build process
   - Test the exported files in a local server

## Best Practices

1. **Version Control**
   - Always commit changes before deployment
   - Use meaningful commit messages
   - Keep deployment configuration in version control

2. **Testing**
   - Test changes locally before deployment
   - Use staging environment if available
   - Verify functionality after deployment

3. **Backup**
   - Keep backups of your website files
   - Use Git for version control
   - Document deployment procedures

## Support

If you encounter issues:
1. Check the cPanel error logs
2. Review the deployment configuration
3. Contact your hosting provider for assistance
4. Refer to the cPanel Git Version Control documentation

## Notes

- The website is configured for static export, which is ideal for cPanel hosting
- All pages are pre-rendered at build time
- Dynamic features may require additional configuration
- Consider using a CDN for better performance
