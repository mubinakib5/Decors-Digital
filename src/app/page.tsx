"use client";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import BackToTopButton from '../components/BackToTopButton';
import CareersSection from '../components/CareersSection';
import ComparisonTableSection from '../components/ComparisonTableSection';
import ProductShowcaseSection from '../components/ProductShowcaseSection';
import TestimonialsSection from '../components/TestimonialsSection';
import WhatWeDoSection from "../components/WhatWeDoSection";
import WhyChooseUsSection from '../components/WhyChooseUsSection';

export default function Home() {
  // State to track if hero section is in view
  const [heroInView, setHeroInView] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  // For video grow animation
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [videoSectionTop, setVideoSectionTop] = useState(0);
  const [videoSectionHeight, setVideoSectionHeight] = useState(1);

  const [windowHeight, setWindowHeight] = useState(1080); // default fallback
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);
    }
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setHeroInView(rect.bottom > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!videoSectionRef.current) return;
    const rect = videoSectionRef.current.getBoundingClientRect();
    setVideoSectionTop(rect.top + window.scrollY);
    setVideoSectionHeight(rect.height);
    const handleResize = () => {
      if (!videoSectionRef.current) return;
      const rect = videoSectionRef.current.getBoundingClientRect();
      setVideoSectionTop(rect.top + window.scrollY);
      setVideoSectionHeight(rect.height);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation: scale from 1 to 1.5 as user scrolls through the section
  const start = videoSectionTop - windowHeight;
  const end = videoSectionTop + videoSectionHeight - windowHeight;
  const videoWidth = useTransform(scrollY, [start, end], ['40vw', '100vw']);
  const videoHeight = useTransform(scrollY, [start, end], ['30vw', '100vh']);
  const videoScale = useTransform(scrollY, [start, end], [0.6, 1]);
  const videoBorderRadius = useTransform(scrollY, [start, end], [24, 0]);

  // Handler for under construction pages
  function handleUnderConstruction(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    alert('This page is under construction. Thanks for being with us!');
  }

  return (
    <>
      {/* HERO SECTION - designmonks style */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center min-h-[90vh] pt-8 pb-8 bg-brand-black overflow-hidden text-center">
        {/* Subtle red glow at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-64 bg-gradient-to-t from-brand-red/60 to-transparent blur-2xl opacity-70 z-0" />
        {/* Floating device mockups - replaced with provided images, slow bounce */}
        <motion.div
          className="hidden md:block absolute left-[-60px] top-24 w-80 rotate-[-10deg] drop-shadow-2xl z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          <Image src="/Mockup_Image.png" alt="Floating mockup 1" width={320} height={220} className="w-full h-auto" priority />
        </motion.div>
        <motion.div
          className="hidden md:block absolute right-[-40px] top-40 w-64 rotate-[12deg] drop-shadow-2xl z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: [0, 18, 0] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          <Image src="/DD@3x.png" alt="Floating mockup 2" width={256} height={180} className="w-full h-auto" priority />
        </motion.div>
        {/* Badges and ratings */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex flex-col items-center gap-2 z-20 mt-8">
          <span className="text-brand-white/80 font-semibold text-lg">Leading Advertising Agency</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xl md:text-2xl" />
              ))}
            </span>
            <span className="text-brand-white font-bold text-lg md:text-xl ml-2">4.9</span>
            <span className="text-brand-silver text-base">/ 5.0</span>
          </div>
        </motion.div>
        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="text-4xl md:text-6xl font-extrabold text-brand-white mb-4 leading-tight z-20 mt-8">
          We design products that <span className="italic font-serif text-brand-redAccent">Drive Results</span>
        </motion.h1>
        {/* Policy badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="flex items-center justify-center gap-2 bg-brand-charcoal/80 border border-brand-charcoal rounded-full px-6 py-2 text-brand-white/90 text-sm font-medium mb-6 z-20">
          <span>Bangladesh-Based LLC <span className="ml-1 align-middle" role="img" aria-label="Bangladesh flag">🇧🇩</span></span>
          <span className="mx-2">•</span>
          <span>100% Refund Policy</span>
        </motion.div>
        {/* CTA Button - animated border using CSS only */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-transform z-20 mb-8 text-brand-white bg-brand-red border-2 relative overflow-hidden group"
          onClick={() => setShowModal(true)}
        >
          <span className="relative z-10">Book a call</span>
          <span className="absolute inset-0 rounded-xl pointer-events-none shimmer-stroke" />
        </motion.button>
        {/* Client logos - two animated rows, centered */}
        <div className="w-full max-w-4xl mx-auto mt-4 flex flex-col gap-2 items-center">
          {/* Top row: left to right */}
          <div className="w-full flex justify-center relative overflow-hidden">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            >
              {[
                "Lendiview", "Likely", "GrowAffiliate", "BizPhix", "homerun", "CPG Synergy"
              ].map((logo) => (
                <span key={logo} className="text-brand-white/80 text-lg font-semibold px-4 py-2 bg-brand-charcoal/40 rounded-lg shadow-sm inline-block">
                  {logo}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                "Lendiview", "Likely", "GrowAffiliate", "BizPhix", "homerun", "CPG Synergy"
              ].map((logo) => (
                <span key={logo + "-dup"} className="text-brand-white/80 text-lg font-semibold px-4 py-2 bg-brand-charcoal/40 rounded-lg shadow-sm inline-block">
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>
          {/* Bottom row: right to left */}
          <div className="w-full flex justify-center relative overflow-hidden opacity-60">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            >
              {[
                "edvive", "Affine", "AKIJ SHIPPING", "SKILLOPHY", "Alpine Empower", "CPG Synergy"
              ].map((logo) => (
                <span key={logo + "-dup"} className="text-brand-white/80 text-lg font-semibold px-4 py-2 bg-brand-charcoal/40 rounded-lg shadow-sm inline-block">
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
        {/* Bottom nav bar - mobile redesign */}
        <div className="hidden md:flex fixed bottom-16 left-1/2 -translate-x-1/2 z-30 bg-brand-black/90 border border-brand-red rounded-xl gap-4 px-8 py-4 shadow-2xl backdrop-blur mb-4">
          {[
            { label: "Work", href: "#work", underConstruction: true },
            { label: "Services", href: "#services", underConstruction: true },
            { label: "Start a Project", href: "#contact", active: true, underConstruction: false },
            { label: "Pricing", href: "#pricing", underConstruction: true },
            { label: "More", href: "#more", underConstruction: true },
          ].map((item) => (
            item.label === "Start a Project" ? (
              <button
                key={item.label}
                type="button"
                onClick={() => setShowModal(true)}
                className={`px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-colors relative overflow-hidden
                  ${heroInView ? "border-2 border-brand-red text-brand-white bg-transparent" : "bg-brand-red text-brand-white border-2 border-brand-red"}`}
                style={{ minWidth: 180, textAlign: 'center' }}
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 rounded-xl pointer-events-none shimmer-stroke" />
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={item.underConstruction ? handleUnderConstruction : undefined}
                className={`px-6 py-3 rounded-xl font-semibold text-base transition-colors relative overflow-hidden
                  ${item.active ? "text-brand-white bg-transparent" : "text-brand-silver hover:text-brand-white"}`}
              >
                {item.label}
              </a>
            )
          ))}
        </div>
        {/* Mobile Bottom Navbar - new style */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex items-end justify-center pointer-events-auto">
          <div className="relative w-full flex items-end justify-center">
            {/* White border/glow at top */}
            <div className="absolute -top-2 left-0 w-full h-3 bg-gradient-to-t from-white/80 to-transparent rounded-t-3xl blur-sm z-0" />
            {/* Navbar background */}
            <div className="w-full bg-brand-black/90 border-t border-white/20 flex items-center justify-between px-2 py-2 rounded-t-3xl shadow-2xl z-10">
              {/* Work */}
              <a href="#work" onClick={handleUnderConstruction} className="flex-1 flex flex-col items-center text-brand-silver text-xs py-2">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
                Work
              </a>
              {/* Services */}
              <a href="#services" onClick={handleUnderConstruction} className="flex-1 flex flex-col items-center text-brand-silver text-xs py-2">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /><circle cx="12" cy="12" r="5" /></svg>
                Services
              </a>
              {/* Center Home Button - raised and glowing */}
              <div className="flex-1 flex flex-col items-center relative z-20">
                <a href="#home" className="relative -top-6 flex items-center justify-center">
                  <span className="absolute w-16 h-16 bg-white rounded-full blur-xl opacity-80"></span>
                  <span className="absolute w-16 h-16 border-4 border-white rounded-full"></span>
                  <img src="/DD@3x.png" alt="Home" className="w-14 h-14 rounded-full border-4 border-white shadow-lg bg-black z-10" />
                </a>
              </div>
              {/* Pricing */}
              <a href="#pricing" onClick={handleUnderConstruction} className="flex-1 flex flex-col items-center text-brand-silver text-xs py-2">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><circle cx="12" cy="12" r="10" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">$</text></svg>
                Pricing
              </a>
              {/* More */}
              <a href="#more" onClick={handleUnderConstruction} className="flex-1 flex flex-col items-center text-brand-silver text-xs py-2">
                {/* Hamburger icon */}
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
                More
              </a>
            </div>
          </div>
        </nav>
      </section>

      {/* Book a Call Modal Section */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative bg-white/90 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 md:mx-0 flex flex-col md:flex-row overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-2xl text-brand-black"
                aria-label="Close"
              >
                ×
              </button>
              {/* Left: Info */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-2">Tell Us Your Amazing <span className="italic font-serif text-brand-redAccent">Project Here</span></h2>
                <ul className="mb-6 mt-4 space-y-2 text-base text-brand-black/80">
                  <li className="flex items-center gap-2"><span className="text-brand-red">✔</span> Expect a response from us within 24 hours</li>
                  <li className="flex items-center gap-2"><span className="text-brand-red">✔</span> We’re happy to sign an NDA upon request.</li>
                  <li className="flex items-center gap-2"><span className="text-brand-red">✔</span> Get access to a team of dedicated product specialists.</li>
                </ul>
                <Image src="/Mockup_Image.png" alt="Project Example" width={320} height={220} className="rounded-2xl shadow-lg w-full max-w-xs mt-4" />
              </div>
              {/* Right: Form */}
              <form className="flex-1 p-8 flex flex-col gap-5 bg-white/80">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block font-semibold mb-1 text-left text-black">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-red transition text-base" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-left text-black">Your Email</label>
                    <input type="email" placeholder="yourmail@gmail.com" className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-red transition text-base" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-left text-black">Whatsapp Number <span className="text-xs text-neutral-400">(Optional)</span></label>
                    <input type="text" placeholder="1 123 1234567" className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-red transition text-base" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-left text-black">Project Budget</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['Less than $2K', '$2K - $5K', '$5K - $10K', '$10K - $20K', '$20K - $50K', 'More than $50K'].map((b) => (
                        <button type="button" key={b} className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-brand-black font-medium hover:bg-brand-red hover:text-white transition text-sm md:text-base">
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-left text-black">Project Details</label>
                    <textarea placeholder="I want to redesign my website.." className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-red transition text-base min-h-[80px]" />
                  </div>
                </div>
                <button type="submit" className="mt-2 px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-transform z-20 text-white bg-gradient-to-r from-[#7b2ff2] to-[#f357a8] hover:from-[#f357a8] hover:to-[#7b2ff2] border-2 border-brand-red flex items-center justify-center gap-2">
                  Let&apos;s Connect <span>→</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Industry Wins Section (only section) --- */}
      <section className="relative w-full flex flex-col items-center py-24 bg-white">
        <div className="max-w-5xl w-full mx-auto px-4">
          {/* Headline */}
          <div className="mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-[#FF4B3E] font-medium text-sm mb-3">Industry Wins</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
              Proven Success In<br />
              <span className="italic font-serif text-3xl md:text-4xl text-neutral-700">Every Industry</span>
            </h2>
          </div>
          {/* Glassy Project Card(s) with stacking animation */}
          <StackingCards />
          {/* CTA: See All Projects */}
          <div className="flex justify-center mt-10">
            <a href="#projects" className="inline-block px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-transform animated-border">See All Projects</a>
          </div>
        </div>
      </section>

      {/* --- What Sets Us Apart: Texts + Full Video Section --- */}
      <section ref={videoSectionRef} className="relative w-full flex flex-col items-center bg-white" style={{ minHeight: '300vh' }}>
        <div className="max-w-6xl w-full mx-auto px-4 flex flex-col items-center pt-24">
          {/* Badge and Headline */}
          <div className="mb-10 text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-[#FF4B3E] font-medium text-sm mb-3">What Sets Us Apart</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
              Why Us? Because Your <span className="italic font-serif">Growth Is Our Mission</span>
            </h2>
            <p className="text-lg text-neutral-600">See the difference thoughtful design makes.<br />Our works highlight the dedication we bring to every client partnership.</p>
          </div>
        </div>
        {/* Sticky Video Grow Animation */}
        <div className="sticky top-0 flex justify-center items-center w-full h-screen z-20 pointer-events-none">
          <motion.div
            style={{
              width: videoWidth,
              height: videoHeight,
              scale: videoScale,
              borderRadius: videoBorderRadius,
              background: 'linear-gradient(to bottom right, #000, #1a093e)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            className="video-grow-hero"
          >
            {/* Custom Play Button Overlay */}
            <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/90 shadow-lg flex items-center justify-center border-4 border-white">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="24" fill="#A259FF" />
                    <polygon points="20,16 34,24 20,32" fill="white" />
                  </svg>
                </div>
                <span className="absolute w-32 text-center text-xs font-semibold text-neutral-700 tracking-widest top-full left-1/2 -translate-x-1/2 mt-2">WATCH VIDEO</span>
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- What We Do Section --- */}
      <WhatWeDoSection />
      {/* Why Choose Us Section */}
      <WhyChooseUsSection />
      {/* Product Showcase Section */}
      <ProductShowcaseSection />
      {/* Comparison Table Section */}
      <ComparisonTableSection />
      {/* Testimonials Section */}
      <TestimonialsSection />
      {/* Careers Section */}
      <CareersSection />
      {/* FAQ Section */}
      <FAQSection />
      {/* Consultation Section */}
      <ConsultationSection />
      <BackToTopButton />
    </>
  );
}

function ConsultationSection() {
  return (
    <section className="w-full flex justify-center py-16 bg-transparent">
      <div className="relative flex flex-col md:flex-row items-center bg-brand-black rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full px-8 py-12 md:py-20">
        {/* Left: Content */}
        <div className="flex-1 flex flex-col items-start z-10">
          <span className="inline-block px-5 py-1.5 rounded-full border border-brand-red text-brand-red font-medium text-sm mb-6 bg-transparent">Claim a Free Consultation, with Us!</span>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-white mb-4">Your Brand Deserves the <span className="italic font-serif text-brand-redAccent">Next Level!</span></h2>
          <p className="text-lg text-brand-silver mb-6 max-w-md">Get expert advice and a custom strategy session worth $799 at no cost</p>
          {/* Avatars */}
          <div className="flex items-center mb-8">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar1" className="w-10 h-10 rounded-full border-2 border-brand-white -ml-0" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar2" className="w-10 h-10 rounded-full border-2 border-brand-white -ml-3" />
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="avatar3" className="w-10 h-10 rounded-full border-2 border-brand-white -ml-3" />
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="avatar4" className="w-10 h-10 rounded-full border-2 border-brand-white -ml-3" />
            <span className="ml-3 text-brand-white font-semibold text-lg bg-brand-black/60 px-3 py-1 rounded-full border border-brand-white">25+</span>
          </div>
          {/* CTA Button */}
          <a href="#contact" className="inline-block px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-transform z-20 text-brand-white bg-brand-red hover:bg-brand-redAccent border-2 border-brand-red">Let&apos;s Talk →</a>
        </div>
        {/* Right: Device Mockups */}
        <div className="flex-1 flex items-center justify-center relative mt-10 md:mt-0">
          <img src="/Mockup_Image.png" alt="Laptop" className="w-96 md:w-[420px] rounded-2xl shadow-2xl rotate-[-8deg] z-10" style={{ marginRight: '-60px' }} />
          <img src="/DD@3x.png" alt="Phone" className="w-32 md:w-40 rounded-2xl shadow-2xl absolute right-0 bottom-0 rotate-6 z-20" />
        </div>
        {/* Glow Overlay */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: '0 0 120px 40px #E5393533, 0 0 0 2px #fff0' }} />
      </div>
    </section>
  );
}

/* Add this to your global CSS (e.g., globals.css) to hide the scrollbar: */
/*
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
*/

function StackingCards() {
  const cards = [
    {
      title: "Travel",
      color: "bg-[#BFCBFF]",
      content: (
        <>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-black">Easy Booking for Dream Trips</h3>
          <p className="mb-6 text-base md:text-lg text-neutral-700 max-w-md">Triply is a hassle-free &amp; effective tour solution for travelers. It&apos;s an all-inclusive booking and planning website that helps people make their dream trips easier.</p>
          <div className="flex gap-8 mb-6">
            <div>
              <div className="text-2xl font-bold text-black">40+</div>
              <div className="text-sm text-neutral-500">Pages in Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">36%</div>
              <div className="text-sm text-neutral-500">Retention Growth</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#AEBBFF] rounded-xl px-4 py-2 w-fit shadow mb-4">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Shubho Al-Faraque" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-sm text-black">Shubho Al-Faraque</div>
              <div className="text-xs text-neutral-500">Triply CEO</div>
            </div>
            <button className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </>
      ),
      image: "/Mockup_Image.png",
    },
    {
      title: "Restaurant",
      color: "bg-[#FFD6D6]",
      content: (
        <>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-black">Transform Your Dining</h3>
          <p className="mb-6 text-base md:text-lg text-neutral-700 max-w-md">At Plate, we bring you a handpicked selection of premium restaurants that offer not just meals, but memorable dining experiences, you&apos;ll cherish.</p>
          <div className="flex gap-8 mb-6">
            <div>
              <div className="text-2xl font-bold text-black">10X Business</div>
              <div className="text-sm text-neutral-500">Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">8 Week</div>
              <div className="text-sm text-neutral-500">Project Duration</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#FFBDBD] rounded-xl px-4 py-2 w-fit shadow mb-4">
            <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="Neil Saidi" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-sm text-black">Neil Saidi</div>
              <div className="text-xs text-neutral-500">Plate CEO</div>
            </div>
            <button className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </>
      ),
      image: "/Mockup_Image.png",
    },
    {
      title: "SaaS",
      color: "bg-[#FFE7A0]",
      content: (
        <>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-black">Reducing Carbon Footprints</h3>
          <p className="mb-6 text-base md:text-lg text-neutral-700 max-w-md">Yenex is a smart and sustainable energy platform. It empowers users with distributed energy solutions to reduce carbon footprints effortlessly.</p>
          <div className="flex gap-8 mb-6">
            <div>
              <div className="text-2xl font-bold text-black">$5M+</div>
              <div className="text-sm text-neutral-500">Revenue Increase</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">40%</div>
              <div className="text-sm text-neutral-500">Customer Acquisition</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#FFE099] rounded-xl px-4 py-2 w-fit shadow mb-4">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Ted Nash" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-sm text-black">Ted Nash</div>
              <div className="text-xs text-neutral-500">Yenex CEO</div>
            </div>
            <button className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </>
      ),
      image: "/Mockup_Image.png",
    },
    {
      title: "Healthcare",
      color: "bg-[#B6F6FF]",
      content: (
        <>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-black">Revolutionize Fitness Goals</h3>
          <p className="mb-6 text-base md:text-lg text-neutral-700 max-w-md">Fitmate transforms fitness in Australia with flexible gym access, personalized schedules, and AI-driven insights to solve common workout limitations.</p>
          <div className="flex gap-8 mb-6">
            <div>
              <div className="text-2xl font-bold text-black">$338K</div>
              <div className="text-sm text-neutral-500">Funding Raised</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">Mobile App</div>
              <div className="text-sm text-neutral-500">Work Scope</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#7CF7E6] rounded-xl px-4 py-2 w-fit shadow mb-4">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Shubho Al-Faraque" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-sm text-black">Shubho Al-Faraque</div>
              <div className="text-xs text-neutral-500">Zantrik CEO</div>
            </div>
            <button className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </>
      ),
      image: "/Mockup_Image.png",
    },
  ];

  // Card height and sticky offset
  const CARD_HEIGHT = 400;
  const GLIMPSE = 56;

  return (
    <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto" style={{ minHeight: 600 }}>
      {cards.map((card, idx) => (
        <div
          key={card.title}
          style={{
            position: 'sticky',
            top: idx * GLIMPSE,
            zIndex: idx + 1,
            marginBottom: 24,
            height: CARD_HEIGHT,
            transition: 'box-shadow 0.3s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          className={`w-full ${card.color} rounded-3xl px-8 py-8 md:py-12 overflow-hidden flex flex-row items-stretch`}
        >
          <div className="flex-1 flex flex-col justify-center">
            <div className="font-serif italic text-lg md:text-xl mb-2 pt-4 text-black">{card.title}</div>
            {card.content}
          </div>
          {card.image && (
            <div className="hidden md:flex flex-1 items-center justify-center">
              <img src={card.image} alt="Project Mockup" className="w-full max-w-xs md:max-w-sm rounded-2xl shadow-lg border border-white/30" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the difference between a website and a web application?",
      answer: "A website is a collection of static pages, while a web application is a dynamic platform that allows users to interact with data and perform actions. Websites are typically used for information display, while web applications are designed for data manipulation and user interaction.",
    },
    {
      question: "How long does it take to build a website?",
      answer: "The timeline for website development varies greatly depending on the project's complexity, features, and the development team's efficiency. A basic brochure website can take 2-4 weeks, while a complex e-commerce site or enterprise application can take several months.",
    },
    {
      question: "Do you offer maintenance and support for websites?",
      answer: "Yes, we provide ongoing maintenance and support services to ensure your website is always up-to-date, secure, and performing optimally. This includes regular updates, security checks, and technical support.",
    },
    {
      question: "Can you help me with SEO optimization?",
      answer: "Absolutely! We incorporate SEO best practices into every website we build, including keyword research, on-page optimization, and technical SEO. We also provide ongoing SEO audits and strategies to improve your website's visibility in search engines.",
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is transparent and based on the scope of the project. We offer fixed-price quotes for standard projects and hourly rates for custom development. We also provide detailed breakdowns of costs and can accommodate various budgets.",
    },
    {
      question: "How do you ensure website security?",
      answer: "We employ multiple layers of security measures, including SSL certificates, secure coding practices, regular security audits, and monitoring. We also provide ongoing security updates and patches to protect your website from vulnerabilities.",
    },
  ];

  return (
    <section className="relative w-full flex flex-col items-center py-24 bg-white">
      <div className="max-w-5xl w-full mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-[#FF4B3E] font-medium text-sm mb-3">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
            Frequently Asked <span className="italic font-serif">Questions</span>
          </h2>
          <p className="text-lg text-neutral-600">We&apos;ve compiled a list of questions we frequently receive. If you have any other questions, feel free to <a href="#contact" className="text-brand-red underline">contact us</a>.</p>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 mb-4 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-black mb-2">{faq.question}</h3>
                <span className="text-brand-red text-3xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="text-lg text-neutral-700 mt-4">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
