// Navigation menu data - Updated for new sitemap
export const navigationData = {
  mainMenu: [
    { name: "The Company", href: "/", icon: "secondary-leaf" },
    { name: "Services", href: "/services", icon: "secondary-leaf" },
    { name: "Clients Diary", href: "/clients", icon: "secondary-leaf" },
    { name: "Newsletter", href: "/newsletter", icon: "secondary-leaf" },
    { name: "Career", href: "/career", icon: "secondary-leaf" },
    { name: "Contact", href: "/contact", icon: "secondary-leaf" },
  ],
  footerMenu: [
    { name: "The Company", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Clients Diary", href: "/clients" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Career", href: "/career" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
  socialLinks: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/decorsdigital",
      icon: "icon-facebook",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/decorsdigital/?hl=en",
      icon: "icon-instagram",
    },
    {
      name: "Threads",
      href: "https://www.threads.com/@decorsdigital",
      icon: "icon-threads",
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/DecorsDigital",
      icon: "icon-twitter",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@DecorsDigital",
      icon: "icon-youtube",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/decorsdigital",
      icon: "icon-linkedin",
    },
  ],
};

// 联系信息
export const contactData = {
  email: "info@thedecorbd.com",
  phone: "+880 1956 7429671",
  address: "Agrabad Access Rd, Chattogram, Bangladesh",
  mapUrl:
    "https://www.google.com/maps/dir//Agrabad+Access+Rd,+Chattogram/@22.3279141,91.7272955,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x30acd8ca45f7e88f:0xeb4cda82264c5706!2m2!1d91.8103838!2d22.3277761?entry=ttu&g_ep=EgoyMDI1MDgwNi4wIKXMDSoASAFQAw%3D%3D",
};

// 统计数据
export const statsData = [
  {
    id: 1,
    number: "1K+",
    target: 1000,
    description: "People who have launched their campaign",
  },
  {
    id: 2,
    number: "10+",
    target: 10,
    description: "Experienced professionals ready to assist",
  },
  {
    id: 3,
    number: "3k+",
    target: 3000,
    description: "Support through messages and live consultations",
  },
];

// 关于我们统计数据
export const aboutStatsData = [
  {
    id: 1,
    number: "45+",
    target: 45,
    title: "Presence in global markets",
    description:
      "Expanding reach across international regions with localized expertise and worldwide impact.",
  },
  {
    id: 2,
    number: "15M",
    target: 15,
    title: "In strategic investments",
    description:
      "Driving growth with curated partnerships and high-performing, audience-driven initiatives.",
  },
  {
    id: 3,
    number: "158+",
    target: 158,
    title: "Trusted brand collaborations",
    description:
      "Shaping industry conversations through innovation, creativity, and lasting influence.",
  },
];

// 服务数据
export const servicesData = [
  {
    id: 0,
    name: "Brand Strategy & Communication",
    description:
      "We develop comprehensive brand strategies that define your unique voice, positioning, and messaging framework. Our approach ensures consistent communication across all touchpoints, building strong brand recognition and customer loyalty.",
    image: "/assets/images/services/services-img-1.jpg",
    icon: "lucide:megaphone",
  },
  {
    id: 1,
    name: "Creative Content Production",
    description:
      "From compelling copywriting to stunning visual content, we create engaging materials that resonate with your audience. Our creative team produces high-quality content for digital platforms, print media, and multimedia campaigns.",
    image: "/assets/images/services/services-img-2.jpg",
    icon: "lucide:edit",
  },
  {
    id: 2,
    name: "Paid Marketing & Promotions",
    description:
      "Maximize your ROI with strategic paid advertising campaigns across Google Ads, Facebook, Instagram, and other platforms. We optimize campaigns for conversions, brand awareness, and customer acquisition.",
    image: "/assets/images/services/services-img-3.jpg",
    icon: "lucide:trending-up",
  },
  {
    id: 3,
    name: "Visual Design & Branding",
    description:
      "Create memorable brand identities with our comprehensive design services. From logos and brand guidelines to marketing materials and digital assets, we ensure visual consistency across all brand touchpoints.",
    image: "/assets/images/services/services-img-4.jpg",
    icon: "lucide:palette",
  },
  {
    id: 4,
    name: "Website Design & Development",
    description:
      "Build responsive, user-friendly websites that drive conversions and enhance user experience. Our development team creates custom solutions using modern technologies and best practices for optimal performance.",
    image: "/assets/images/services/services-img-1.jpg",
    icon: "lucide:code",
  },
  {
    id: 5,
    name: "Consultation/Strategy/Training",
    description:
      "Empower your team with expert guidance and strategic insights. We provide consultation services, develop comprehensive strategies, and offer training programs to enhance your marketing capabilities and business growth.",
    image: "/assets/images/services/services-img-2.jpg",
    icon: "lucide:lightbulb",
  },
  {
    id: 6,
    name: "Digital & Social Media Management",
    description:
      "Manage your digital presence with our comprehensive social media and digital marketing services. We create engaging content, manage communities, and implement strategies that build meaningful connections with your audience.",
    image: "/assets/images/services/services-img-3.jpg",
    icon: "lucide:share-2",
  },
  {
    id: 7,
    name: "SEO & AEO",
    description:
      "Improve your online visibility with our advanced SEO and Answer Engine Optimization (AEO) services. We optimize your content for search engines and AI-powered answer engines to increase organic traffic and brand discovery.",
    image: "/assets/images/services/services-img-4.jpg",
    icon: "lucide:search",
  },
];

// 服务卡片数据
export const serviceCardsData = [
  {
    id: 1,
    title: "Web Design",
    description:
      "Create stunning, responsive websites that captivate your audience and drive conversions with our modern design approach.",
    icon: "lucide:monitor",
    href: "/contact",
  },
  {
    id: 2,
    title: "Mobile Development",
    description:
      "Build powerful mobile applications for iOS and Android platforms that deliver exceptional user experiences.",
    icon: "lucide:smartphone",
    href: "/contact",
  },
  {
    id: 3,
    title: "Branding",
    description:
      "Develop compelling brand identities that resonate with your target audience and set you apart from the competition.",
    icon: "lucide:palette",
    href: "/contact",
  },
  {
    id: 4,
    title: "Digital Marketing",
    description:
      "Drive growth with strategic digital marketing campaigns including SEO, social media, and content marketing.",
    icon: "lucide:trending-up",
    href: "/contact",
  },
  {
    id: 5,
    title: "E-commerce",
    description:
      "Build robust online stores that provide seamless shopping experiences and drive sales for your business.",
    icon: "lucide:shopping-cart",
    href: "/contact",
  },
  {
    id: 6,
    title: "UI/UX Design",
    description:
      "Create intuitive user interfaces and exceptional user experiences that keep your users engaged and satisfied.",
    icon: "lucide:users",
    href: "/contact",
  },
];

// 团队数据
export const teamData = [
  {
    id: 1,
    name: "Ayman Siddique",
    position: "Chief Executive Officer",
    // Replace with your Cloudinary URL for team member 1
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932147/Ayman_lotdog.jpg",
    socialLinks: [
      {
        platform: "linkedin",
        href: "https://www.linkedin.com/in/ayman-siddiquee/",
      },
    ],
  },
  {
    id: 2,
    name: "Adittya Basak",
    position: "Project Manager",
    // Replace with your Cloudinary URL for team member 2
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932146/Adittya_mfvtnb.jpg",
    socialLinks: [
      {
        platform: "linkedin",
        href: "https://www.linkedin.com/in/adittyabasak/",
      },
    ],
  },
  {
    id: 3,
    name: "Mahtab Ahamed",
    position: "Lead Designer",
    // Replace with your Cloudinary URL for team member 3
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932966/Mahtab_ittckp.jpg",
    socialLinks: [
      {
        platform: "linkedin",
        href: "https://www.linkedin.com/in/mahtab-ahamed-447039228/",
      },
    ],
  },
  {
    id: 4,
    name: "Momenul Hoque",
    position: "Executive, Business Development & IT",
    // Replace with your Cloudinary URL for team member 4
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932148/Hoque_ofiajd.jpg",
    socialLinks: [],
  },
  {
    id: 5,
    name: "Tahrim Ibnath",
    position: "Executive, Finance & Documentation",
    // Replace with your Cloudinary URL for team member 4
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932148/Ibnath_xxtqel.jpg",
    socialLinks: [
      {
        platform: "linkedin",
        href: "https://www.linkedin.com/in/tahrim-ibnath-b23ab8347/",
      },
    ],
  },
  {
    id: 6,
    name: "Sampoorna Ganguly",
    position: "Content Developer",
    // Replace with your Cloudinary URL for team member 4
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932147/Sampoorna_i505ad.jpg",
    socialLinks: [
      {
        platform: "linkedin",
        href: "https://www.linkedin.com/in/sampoorna-ganguly-5b704324a/",
      },
    ],
  },
  {
    id: 7,
    name: "Abdullah Al Mubin",
    position: "Web Developer",
    // Replace with your Cloudinary URL for team member 4
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932147/Mubin_fsbov1.jpg",
    socialLinks: [
      {
        platform: "linkedin",
        href: "https://www.linkedin.com/in/abdullah-al-mubin-akib/",
      },
    ],
  },
  {
    id: 8,
    name: "Md. Mahmudur Rahman",
    position: "Visualizer",
    // Replace with your Cloudinary URL for team member 4
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932146/Mahmud_selvzg.jpg",
  },
  {
    id: 9,
    name: "Foysal Ahmed",
    position: "Video Editor",
    // Replace with your Cloudinary URL for team member 4
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932147/Faisal_nxhfv7.jpg",
  },
  {
    id: 10,
    name: "Nabila Tabassum",
    position: "Junior Executive, Business Development",
    // Replace with your Cloudinary URL for team member 4
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932146/Nabila_fhnqzb.jpg",
    socialLinks: [
      {
        platform: "linkedin",
        href: "https://www.linkedin.com/in/nabila-tabassum-1058392a1/",
      },
    ],
  },
  {
    id: 11,
    name: "Mosiur Rahman",
    position: "Junior Executive, Operations",
    // Replace with your Cloudinary URL for team member 4
    image:
      "https://res.cloudinary.com/dcjnspfoe/image/upload/v1754932147/Mosiur_okjk3k.jpg",
    socialLinks: [
      {
        platform: "linkedin",
        href: "https://www.linkedin.com/in/mosiur-rahaman-1b933a300/",
      },
    ],
  },
];

// 项目数据
export const projectsData = [
  {
    id: 1,
    title: "Snapclear",
    image: "/assets/images/portfolio/portfolio-img-1.jpg",
    tags: ["UX Strategy", "UI Design"],
    href: "/projects-detail",
  },
  {
    id: 2,
    title: "Amber Bottle",
    image: "/assets/images/portfolio/portfolio-img-2.jpg",
    tags: ["Web development", "Digital design"],
    href: "/projects-detail",
  },
  {
    id: 3,
    title: "Pixelforge",
    image: "/assets/images/portfolio/portfolio-img-3.jpg",
    tags: ["UI/UX design", "Web development"],
    href: "/projects-detail",
  },
  {
    id: 4,
    title: "BioTrack LIMS",
    image: "/assets/images/portfolio/portfolio-img-4.jpg",
    tags: ["Brand identity", "Digital design"],
    href: "/projects-detail",
  },
  {
    id: 5,
    title: "Amber Bottle",
    image: "/assets/images/portfolio/portfolio-img-5.jpg",
    tags: ["Photography", "Studio"],
    href: "/projects-detail",
  },
  {
    id: 6,
    title: "Digital Magazine",
    image: "/assets/images/portfolio/portfolio-img-6.jpg",
    tags: ["Digital design", "Web development"],
    href: "/projects-detail",
  },
];

// 博客数据
export const blogData = [
  {
    id: 1,
    slug: "a-campaign-that-connects",
    title: "A campaign that connects",
    date: "Dec 24, 2025",
    image: "/assets/images/resources/resources-1.jpg",
    description:
      "In a world where standing still means falling behind, we knew it was time for a bold transformation..",
    content:
      "At Studiova, we're always evolving, and our latest brand redesign is a bold step forward. This transformation reflects our commitment to innovation and growth, both in how we look and how we connect with you.",
    fullContent: `
      Blogger outreach campaigns are strategic efforts by businesses to collaborate with influential bloggers, aiming to promote products, services, or content to a broader audience. This form of influencer marketing leverages the blogger's established credibility and reach within a specific niche.
      
      Key Steps to Launch a Successful Blogger Outreach Campaign:
      
      1. Define Your Goals:
      Clearly outline what you aim to achieve, such as increasing brand awareness, driving website traffic, or boosting product sales.
      
      2. Identify Relevant Bloggers:
      Research and compile a list of bloggers whose audience aligns with your target demographic. Utilize tools like BuzzSumo to discover key influencers in your industry.
      
      Engage Authentically:
      Prior to outreach, engage with the bloggers' content by commenting on posts or sharing their articles. This establishes a genuine connection and familiarity.
      
      Craft Personalized Outreach Messages: Develop tailored emails that acknowledge the blogger's work and propose a mutually beneficial collaboration. Avoid generic templates to increase response rates.
    `,
  },
  {
    id: 2,
    slug: "breaking-boundaries-brand-redesign",
    title: "An breaking boundaries our latest brand redesign",
    date: "Dec 24, 2025",
    image: "/assets/images/resources/resources-2.jpg",
    description:
      "Exploring the transformative journey of our brand evolution and the strategic thinking behind our new identity.",
    content:
      "Our brand redesign represents more than just a visual update—it's a reflection of our evolution as a company and our commitment to staying ahead of industry trends.",
    fullContent: `
      Brand redesign is a strategic process that involves rethinking and updating a company's visual identity, messaging, and overall brand positioning. This comprehensive approach ensures that the brand remains relevant and competitive in an ever-changing market landscape.
      
      The Process of Brand Redesign:
      
      1. Research and Analysis:
      Understanding the current market position, competitor analysis, and identifying opportunities for improvement.
      
      2. Strategy Development:
      Creating a clear vision for the new brand identity and how it will differentiate from competitors.
      
      3. Design and Implementation:
      Developing the visual elements, messaging, and ensuring consistency across all touchpoints.
    `,
  },
  {
    id: 3,
    slug: "recognized-for-design",
    title: "Recognized for design",
    date: "Dec 24, 2025",
    image: "/assets/images/resources/resources-3.jpg",
    description:
      "Celebrating our achievements in design excellence and the recognition we've received from the industry.",
    content:
      "Being recognized for our design work is a testament to our team's creativity, dedication, and commitment to delivering exceptional results for our clients.",
    fullContent: `
      Design recognition is not just about awards—it's about creating meaningful experiences that resonate with users and drive business results. Our approach to design combines creativity with strategic thinking to deliver solutions that make a difference.
      
      What Makes Great Design:
      
      1. User-Centered Approach:
      Understanding user needs and creating solutions that address real problems.
      
      2. Innovation and Creativity:
      Pushing boundaries and exploring new possibilities while maintaining usability.
      
      3. Strategic Thinking:
      Aligning design decisions with business objectives and user goals.
    `,
  },
  {
    id: 4,
    slug: "modern-lens-perspectives",
    title: "The Modern Lens Perspectives on Culture & Trends",
    date: "Dec 24, 2025",
    image: "/assets/images/services/services-img-1.jpg",
    description:
      "Exploring contemporary perspectives on culture, trends, and their impact on design and business.",
    content:
      "Understanding cultural trends and their influence on design is crucial for creating relevant and impactful solutions that connect with today's audiences.",
    fullContent: `
      Culture and trends shape how we perceive and interact with the world around us. In design, understanding these influences helps us create solutions that are not only visually appealing but also culturally relevant and meaningful.
      
      Key Trends Shaping Design:
      
      1. Digital Transformation:
      The rapid adoption of digital technologies and their impact on user expectations.
      
      2. Sustainability:
      Growing awareness of environmental issues and the demand for sustainable design solutions.
      
      3. Personalization:
      The expectation for tailored experiences that meet individual needs and preferences.
    `,
  },
];

// FAQ 数据
export const faqData = [
  {
    id: 1,
    question: "What services does your agency offer?",
    answer:
      "We offer comprehensive digital services including web design, development, branding, digital marketing, SEO optimization, and ongoing maintenance. Our team specializes in creating custom solutions tailored to your business needs.",
  },
  {
    id: 2,
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary depending on complexity. Simple websites typically take 2-4 weeks, while complex applications can take 8-12 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the process.",
  },
  {
    id: 3,
    question: "Do you offer custom designs, or do you use templates?",
    answer:
      "We create 100% custom designs tailored to your brand and business objectives. While we may use frameworks for development efficiency, every design is unique and crafted specifically for your project requirements.",
  },
  {
    id: 4,
    question: "What's the cost of a project?",
    answer:
      "Project costs depend on scope, complexity, and requirements. We offer transparent pricing with detailed proposals. Our projects typically range from $3,000 for basic websites to $25,000+ for complex applications. Contact us for a custom quote.",
  },
  {
    id: 5,
    question: "Do you provide ongoing support after project completion?",
    answer:
      "Yes, we provide post-launch support to ensure smooth implementation and offer ongoing maintenance packages for clients needing regular updates or technical assistance.",
  },
];

// 文档数据
export const docsData = [
  {
    id: 1,
    title: "Getting Started",
    description:
      "Learn the basics and get up and running with our platform quickly.",
    icon: "lucide:book-open",
    href: "#getting-started",
  },
  {
    id: 2,
    title: "Configuration",
    description:
      "Configure your project settings and customize the platform to your needs.",
    icon: "lucide:settings",
    href: "#configuration",
  },
  {
    id: 3,
    title: "API Reference",
    description:
      "Complete API documentation with examples and integration guides.",
    icon: "lucide:code",
    href: "#api-reference",
  },
  {
    id: 4,
    title: "Components",
    description:
      "Explore our UI components and learn how to use them effectively.",
    icon: "lucide:palette",
    href: "#components",
  },
  {
    id: 5,
    title: "Performance",
    description:
      "Optimize your application performance with our best practices guide.",
    icon: "lucide:zap",
    href: "#performance",
  },
  {
    id: 6,
    title: "Troubleshooting",
    description:
      "Common issues and solutions to help you resolve problems quickly.",
    icon: "lucide:help-circle",
    href: "#troubleshooting",
  },
];

// 页面配置数据
export const pageConfig = {
  home: {
    title: "Decor's Digital",
    description:
      "We create high-performing digital solutions that elevate brands and enhance conversions.",
  },
  about: {
    title: "About us",
    description:
      "We craft innovative digital solutions that amplify brand identity and drive meaningful results",
  },
  services: {
    title: "Our Services",
    description:
      "Discover our comprehensive services designed to elevate your digital presence",
  },
  projects: {
    title: "Projects",
    description:
      "A showcase of creativity, strategy, and results explore the projects that define us.",
  },
  blog: {
    title: "Blog",
    description:
      "Excited to begin something amazing? Get in touch—we'd love to connect with you!",
  },
  contact: {
    title: "Contact",
    description:
      "Ready to start something great? Reach out we'd love to hear from you.",
  },
  docs: {
    title: "Documentation",
    description:
      "Comprehensive guides and documentation to help you get the most out of our platform.",
  },
};

// 横幅背景图片
export const bannerImages = {
  home: "/assets/images/backgrounds/banner-video.mp4",
  about: "/assets/images/backgrounds/aboutus-banner.jpg",
  services: "/assets/images/backgrounds/aboutus-banner.jpg",
  projects: "/assets/images/backgrounds/projects-banner.jpg",
  blog: "/assets/images/backgrounds/blog-banner.jpg",
  contact: "/assets/images/backgrounds/contact-banner.jpg",
  docs: "/assets/images/backgrounds/docs-banner.jpg",
  privacy: "/assets/images/backgrounds/privacy-banner.jpg",
  terms: "/assets/images/backgrounds/terms-banner.jpg",
};
