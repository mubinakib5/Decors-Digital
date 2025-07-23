"use client";
import Navbar from "@/components/Navbar";
import OnboardingScreen from "@/components/OnboardingScreen";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function DecorsDigital() {
  const secondSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToSecond = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <OnboardingScreen />
      <header>
        <Navbar />
      </header>
      <main className="bg-white">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen w-screen min-w-0 overflow-hidden bg-[#e8dede] bg-[url('/DD_Hero.png')] bg-cover bg-center bg-no-repeat">
          {/* Hero Content - Centered Logo with Swing Animation */}
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
              className="text-center"
            >
              <Image
                src="/DD_Hero_Logo@3x.png"
                alt="Decor's Digital Logo"
                width={400}
                height={400}
                className="w-auto h-auto max-w-md md:max-w-lg lg:max-w-xl hero-logo-responsive"
                priority
              />
            </motion.div>
            {/* Down Arrow Button */}
            <button
              onClick={handleScrollToSecond}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transition-colors z-20"
              aria-label="Scroll to next section"
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </section>
        {/* ...后续所有原 main 标签内内容... */}
      </main>
    </>
  );
} 