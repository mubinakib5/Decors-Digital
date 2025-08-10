# Decor's Digital - Next.js Website

一个现代化的数字营销和网站开发公司网站，使用 Next.js 13+ App Router 构建。

## 🚀 特性

- **现代化技术栈**: Next.js 13+ App Router, React 18, Bootstrap 5
- **响应式设计**: 完全响应式，支持所有设备
- **性能优化**: 图片优化、代码分割、静态生成
- **SEO 友好**: 元数据优化、结构化数据
- **可访问性**: WCAG 2.1 兼容
- **动画效果**: AOS (Animate On Scroll) 库
- **组件化架构**: 可重用的 UI 组件
- **数据驱动**: 集中式数据管理

## 📁 项目结构

```
app/
├── components/          # 可重用组件
│   ├── ui/             # UI 组件
│   │   ├── Button.js
│   │   ├── PageBanner.js
│   │   ├── ServiceCard.js
│   │   ├── TeamCard.js
│   │   ├── ProjectCard.js
│   │   ├── BlogCard.js
│   │   ├── DocCard.js
│   │   └── ScrollToTop.js
│   ├── Header.js       # 导航头部
│   ├── Footer.js       # 页脚
│   ├── BannerSection.js
│   ├── ServicesSection.js
│   ├── FaqSection.js
│   └── ...
├── data/               # 数据文件
│   └── index.js        # 所有静态数据
├── utils/              # 工具函数
│   └── helpers.js      # 通用工具函数
├── constants/          # 常量定义
│   └── index.js        # 应用常量
├── (pages)/            # 页面组件
│   ├── page.js         # 首页
│   ├── about-us/
│   ├── services/
│   ├── projects/
│   ├── blog/
│   ├── contact/
│   └── ...
└── layout.js           # 根布局
```

## 🛠️ 技术栈

- **框架**: Next.js 13+ (App Router)
- **语言**: JavaScript/JSX
- **样式**: Bootstrap 5 + 自定义 CSS
- **图标**: Iconify
- **动画**: AOS (Animate On Scroll)
- **字体**: Google Fonts
- **图片**: Next.js Image 组件
- **部署**: Vercel (推荐)

## 📦 安装和运行

### 前提条件

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发环境

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 启动生产服务器

```bash
npm start
# 或
yarn start
```

## 🎨 组件使用

### Button 组件

```jsx
import Button from '../components/ui/Button';

// 基础按钮
<Button>Click me</Button>

// 带图标的按钮
<Button icon="lucide:arrow-right" iconPosition="right">
  Next
</Button>

// 链接按钮
<Button href="/contact" variant="dark">
  Contact Us
</Button>
```

### PageBanner 组件

```jsx
import PageBanner from '../components/ui/PageBanner';

<PageBanner
  title="About Us"
  description="Learn more about our company"
  backgroundImage="/assets/images/banner.jpg"
/>
```

### ServiceCard 组件

```jsx
import ServiceCard from '../components/ui/ServiceCard';

<ServiceCard
  title="Web Design"
  description="Create stunning websites"
  icon="lucide:monitor"
  href="/contact"
/>
```

## 📊 数据管理

所有静态数据都集中在 `app/data/index.js` 文件中：

```javascript
// 导航数据
export const navigationData = {
  mainMenu: [...],
  footerMenu: [...],
  socialLinks: [...]
};

// 服务数据
export const servicesData = [...];

// 团队数据
export const teamData = [...];

// 项目数据
export const projectsData = [...];
```

## 🎯 自定义配置

### 修改颜色主题

在 `app/constants/index.js` 中修改颜色常量：

```javascript
export const COLORS = {
  PRIMARY: '#your-primary-color',
  SECONDARY: '#your-secondary-color',
  // ...
};
```

### 添加新页面

1. 在 `app/` 目录下创建新文件夹
2. 添加 `page.js` 文件
3. 在 `app/data/index.js` 中添加页面配置
4. 在导航数据中添加链接

### 添加新组件

1. 在 `app/components/ui/` 目录下创建组件文件
2. 遵循现有的组件命名约定
3. 添加适当的 PropTypes 或 TypeScript 类型
4. 在 README 中更新文档

## 🔧 工具函数

项目包含多个实用工具函数：

```javascript
import { 
  formatDate, 
  truncateText, 
  debounce, 
  validateEmail 
} from '../utils/helpers';

// 格式化日期
const formattedDate = formatDate('2024-01-01');

// 截断文本
const shortText = truncateText('Long text...', 100);

// 防抖函数
const debouncedSearch = debounce(searchFunction, 300);

// 验证邮箱
const isValidEmail = validateEmail('test@example.com');
```

## 📱 响应式设计

项目使用 Bootstrap 5 的响应式网格系统：

- **移动设备**: < 768px
- **平板设备**: 768px - 1024px  
- **桌面设备**: > 1024px

## 🚀 部署

### Vercel (推荐)

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署

### 其他平台

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 📈 性能优化

- **图片优化**: 使用 Next.js Image 组件
- **代码分割**: 自动代码分割
- **静态生成**: 预渲染静态页面
- **缓存**: 浏览器和 CDN 缓存
- **压缩**: 自动压缩 CSS 和 JavaScript

## 🔍 SEO 优化

- 元数据优化
- 结构化数据
- 语义化 HTML
- 图片 alt 属性
- 页面标题和描述

## ♿ 可访问性

- 键盘导航支持
- 屏幕阅读器兼容
- 高对比度支持
- ARIA 标签
- 语义化 HTML

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系

- 网站: [https://decorsdigital.com](https://decorsdigital.com)
- 邮箱: info@thedecorbd.com
- 地址: Agrabad Access Rd, Chattogram, Bangladesh

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Bootstrap](https://getbootstrap.com/) - CSS 框架
- [Iconify](https://iconify.design/) - 图标库
- [AOS](https://michalsnik.github.io/aos/) - 滚动动画库
