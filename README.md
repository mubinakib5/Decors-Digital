# Decor's Digital - Next.js Website

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-blue.svg)](https://tailwindcss.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, responsive business website built with Next.js 15, featuring clean design, smooth animations, and comprehensive page layouts for professional businesses and agencies. This project combines the power of Next.js with Bootstrap and Tailwind CSS for optimal performance and design flexibility.

## 🚀 Live Demo

- **[Live Preview](https://decorsdigital.com)** (when deployed)
- **[GitHub Repository](https://github.com/mubinakib5/Decors-Digital)**

## ✨ Features

### 🎨 Design & UI/UX

- **Modern & Clean Design**: Professional business aesthetic with contemporary styling
- **Fully Responsive**: Optimized for all devices (desktop, tablet, mobile)
- **Smooth Animations**: AOS (Animate On Scroll) integration for engaging user experience
- **Accessibility**: WCAG compliant with proper semantic HTML structure
- **SEO Optimized**: Meta tags, structured data, and performance optimized

### 📱 Pages & Components

- **Homepage**: Hero section with video background, services showcase, testimonials, portfolio
- **About Us**: Company information, team members, mission & vision
- **Services**: Detailed service offerings with interactive tabs
- **Portfolio/Projects**: Project showcase with carousel functionality
- **Blog**: Article listings and detailed blog posts with dynamic routing
- **Contact**: Contact forms and location information with Calendly integration
- **Authentication**: Sign-in and sign-up pages
- **Legal Pages**: Privacy policy, terms & conditions
- **404 Error Page**: Custom error handling

### 🛠 Technical Features

- **Next.js 15.4.6**: Latest React framework with App Router
- **React 19.1.0**: Latest React features and performance improvements
- **Tailwind CSS v4**: Modern utility-first CSS framework
- **Bootstrap 5.3.7**: Additional UI components and utilities
- **Static Export**: Optimized for static hosting and CDN deployment
- **Owl Carousel**: Touch-enabled carousel for testimonials and portfolios
- **Iconify**: Modern icon system with extensive icon library
- **Calendly Integration**: Seamless appointment booking system

## 📦 Installation

### Prerequisites

- **Node.js**: 18.0+ (recommended: 20.0+)
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/mubinakib5/Decors-Digital.git
   cd Decors-Digital
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The website should now be running locally

## 📁 Project Structure

```
Decors-Digital/
├── app/                      # Next.js App Router directory
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   └── ...              # Page-specific components
│   ├── about-us/            # About page
│   ├── blog/                # Blog pages with dynamic routing
│   ├── contact/             # Contact page
│   ├── projects/            # Projects page
│   ├── services/            # Services page
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout component
│   └── page.js              # Homepage
├── public/                  # Static assets
│   ├── assets/              # Images, icons, and media
│   │   ├── images/          # Image assets
│   │   ├── js/              # JavaScript files
│   │   └── libs/            # Third-party libraries
│   ├── favicon.ico          # Website favicon
│   ├── robots.txt           # SEO robots file
│   ├── sitemap.xml          # SEO sitemap
│   └── site.webmanifest     # PWA manifest
├── .cpanel.yml              # cPanel deployment configuration
├── next.config.mjs          # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
└── README.md               # This file
```

## 🎯 Key Pages

| Page         | Description                    | Features                                               |
| ------------ | ------------------------------ | ------------------------------------------------------ |
| **Homepage** | Landing page with hero section | Video background, services, testimonials, portfolio preview |
| **About Us** | Company information            | Team showcase, company history, mission statement      |
| **Services** | Service offerings              | Interactive tabs, service cards, feature comparison    |
| **Projects** | Portfolio showcase             | Project carousel, filtering, detailed project pages    |
| **Blog**     | Content marketing              | Article listings, dynamic routing, search functionality |
| **Contact**  | Contact information            | Contact forms, Calendly integration, business hours    |

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Deploy automatically on every push

2. **Manual Deployment**
   ```bash
   npm run build
   # Deploy the 'out' directory to your hosting provider
   ```

### cPanel Deployment

1. **Configure Git Repository**
   - Set up Git Version Control in cPanel
   - Update `.cpanel.yml` with your username
   - Push changes to trigger automatic deployment

2. **Manual Deployment**
   ```bash
   npm run build
   # Upload the 'out' directory to public_html/
   ```

### Static Hosting

The project is configured for static export, making it compatible with:
- **Netlify**
- **GitHub Pages**
- **AWS S3**
- **Any static hosting service**

## 🎨 Customization

### Colors & Branding

- Primary colors are defined in `tailwind.config.js`
- Logo files are located in `public/assets/images/logos/`
- Customize brand colors and typography in the Tailwind configuration

### Content Management

- Update content in React components under `app/components/`
- Replace images in `public/assets/images/` directory
- Modify text content in respective page components

### Styling

- Main stylesheet: `app/globals.css`
- Tailwind configuration: `tailwind.config.js`
- Component-specific styles: Inline or CSS modules

## 🚀 Performance Optimization

- **Static Export**: Pre-rendered pages for optimal performance
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting by Next.js
- **SEO Optimized**: Meta tags, structured data, and sitemap
- **CDN Ready**: Optimized for content delivery networks

## 🌐 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 991px
- **Desktop**: 992px+

## 🔧 Dependencies

### Core Dependencies

- **Next.js**: 15.4.6 - React framework
- **React**: 19.1.0 - UI library
- **React DOM**: 19.1.0 - React DOM rendering
- **Tailwind CSS**: 4.0 - Utility-first CSS framework
- **Bootstrap**: 5.3.7 - CSS framework
- **AOS**: 2.3.4 - Animate On Scroll library
- **jQuery**: 3.7.1 - JavaScript library
- **Owl Carousel**: 2.3.4 - Touch-enabled carousel
- **Iconify**: 1.0.8 - Icon system

### Development Dependencies

- **@tailwindcss/postcss**: 4.0 - PostCSS plugin
- **autoprefixer**: 10.4.21 - CSS vendor prefixing

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Static Export
npm run export       # Export static files
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow Next.js best practices
- Use TypeScript for type safety (optional)
- Follow ESLint configuration
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

- **Design & Code**: Copyright © [Decor's Digital](https://www.decorsdigital.com/)
- **Original Template**: [ThemeWagon](https://themewagon.com)

## 👥 Authors

- **Decor's Digital Team** - _Design and Development_ - [Decor's Digital](https://www.decorsdigital.com/)
- **Mubin Akib** - _Next.js Implementation_ - [GitHub](https://github.com/mubinakib5)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Bootstrap](https://getbootstrap.com/) - CSS Framework
- [AOS](https://michalsnik.github.io/aos/) - Animate On Scroll
- [Owl Carousel](https://owlcarousel2.github.io/OwlCarousel2/) - Carousel Component
- [Iconify](https://iconify.design/) - Icon System
- [Calendly](https://calendly.com/) - Appointment Scheduling

## 📞 Support

- **Documentation**: [Next.js Documentation](https://nextjs.org/docs)
- **Issues**: [GitHub Issues](https://github.com/mubinakib5/Decors-Digital/issues)
- **Email**: contact@decorsdigital.com

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Initial Next.js implementation
- ✅ Static export configuration
- ✅ SEO optimization
- ✅ Responsive design
- ✅ Calendly integration
- ✅ Scroll-to-top functionality
- ✅ Deployment configurations

---

**Made with ❤️ by Decor's Digital Team**

*Built with Next.js, Tailwind CSS, and Bootstrap*
