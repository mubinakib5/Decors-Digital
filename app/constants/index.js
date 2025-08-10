// 应用常量
export const APP_NAME = "Decor's Digital";
export const APP_DESCRIPTION = "We create high-performing digital solutions that elevate brands and enhance conversions.";

// API 端点
export const API_ENDPOINTS = {
  CONTACT: '/api/contact',
  BLOG: '/api/blog',
  PROJECTS: '/api/projects'
};

// 动画延迟
export const ANIMATION_DELAYS = {
  FAST: 100,
  MEDIUM: 200,
  SLOW: 300,
  VERY_SLOW: 500
};

// 断点
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200
};

// 颜色
export const COLORS = {
  PRIMARY: '#007bff',
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40'
};

// 字体大小
export const FONT_SIZES = {
  XS: '0.75rem',
  SM: '0.875rem',
  BASE: '1rem',
  LG: '1.125rem',
  XL: '1.25rem',
  '2XL': '1.5rem',
  '3XL': '1.875rem',
  '4XL': '2.25rem'
};

// 间距
export const SPACING = {
  XS: '0.25rem',
  SM: '0.5rem',
  MD: '1rem',
  LG: '1.5rem',
  XL: '2rem',
  '2XL': '3rem',
  '3XL': '4rem'
};

// 社交媒体平台
export const SOCIAL_PLATFORMS = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube',
  THREADS: 'threads'
};

// 服务类型
export const SERVICE_TYPES = {
  WEB_DESIGN: 'web-design',
  MOBILE_DEVELOPMENT: 'mobile-development',
  BRANDING: 'branding',
  DIGITAL_MARKETING: 'digital-marketing',
  ECOMMERCE: 'ecommerce',
  UI_UX_DESIGN: 'ui-ux-design'
};

// 项目状态
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold'
};

// 联系表单字段
export const CONTACT_FIELDS = {
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  MESSAGE: 'message',
  SUBJECT: 'subject'
};

// 验证规则
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  MESSAGE: /^.{10,1000}$/
};

// 错误消息
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NAME: 'Please enter a valid name',
  MESSAGE_TOO_SHORT: 'Message must be at least 10 characters long',
  MESSAGE_TOO_LONG: 'Message must be less than 1000 characters'
};

// 成功消息
export const SUCCESS_MESSAGES = {
  CONTACT_SENT: 'Thank you for your message. We will get back to you soon!',
  FORM_SUBMITTED: 'Form submitted successfully!',
  DATA_SAVED: 'Data saved successfully!'
};

// 本地存储键
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  CART: 'cart'
};

// 主题
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// 语言
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  ZH: 'zh'
};

// 页面类型
export const PAGE_TYPES = {
  HOME: 'home',
  ABOUT: 'about',
  SERVICES: 'services',
  PROJECTS: 'projects',
  BLOG: 'blog',
  CONTACT: 'contact',
  DOCS: 'docs'
};

// SEO 默认值
export const SEO_DEFAULTS = {
  TITLE: APP_NAME,
  DESCRIPTION: APP_DESCRIPTION,
  KEYWORDS: 'web design, digital marketing, branding, development',
  AUTHOR: APP_NAME,
  OG_TYPE: 'website'
};

// Calendly configuration
export const CALENDLY_URL = 'https://calendly.com/decorsdigital/30min';

// Contact information
export const CONTACT_INFO = {
  email: 'info@thedecorbd.com',
  phone: '+1-212-456-7890',
  address: 'Agrabad Access Rd, Chattogram, Bangladesh',
};

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/decorsdigital',
  instagram: 'https://www.instagram.com/decorsdigital/?hl=en',
  threads: 'https://www.threads.com/@decorsdigital',
  twitter: 'https://x.com/DecorsDigital',
  youtube: 'https://www.youtube.com/@DecorsDigital',
  linkedin: 'https://www.linkedin.com/company/decorsdigital',
};

// Company information
export const COMPANY_INFO = {
  name: "Decor's Digital",
  tagline: "We create high-performing digital solutions that elevate brands and enhance conversions.",
  description: "We craft innovative digital solutions that amplify brand identity and drive meaningful results",
};
