"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

const topLabels = [
  "Framer", "Branding", "Dashboard", "Logos", "Webflow", "Slide Decks", "Mobile Apps", "Figma", "Social Media"
];
const bottomLabels = [
  "Dashboard", "Logos", "Webflow", "Slide Decks", "Mobile Apps", "Figma", "Social Media", "Framer", "Branding"
];
const mockups = [
  "/Mockup_Image.png",
  "/DD@3x.png",
  "/Mockup_Image.png",
  "/DD@3x.png",
  "/Mockup_Image.png"
];

interface MarqueeProps {
  children: ReactNode;
  direction?: "left" | "right";
  duration?: number;
}

function Marquee({ children, direction = "left", duration = 40 }: MarqueeProps) {
  // direction: "left" or "right"
  const animate = direction === "left"
    ? { x: ["0%", "-50%"] }
    : { x: ["0%", "50%"] };
  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex w-[200%]"
        animate={animate}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <div className="flex w-1/2">{children}</div>
        <div className="flex w-1/2">{children}</div>
      </motion.div>
    </div>
  );
}

export default function ProductShowcaseSection() {
  return (
    <>
      <section className="relative w-full py-16 bg-[#f3e8ff] overflow-hidden border-t border-b border-[#e9d5ff]">
        {/* Top Scrolling Text */}
        <Marquee direction="left" duration={40}>
          {topLabels.map((label, i) => (
            <span key={i} className="mx-4 md:mx-6 text-base md:text-2xl font-medium text-black/80 tracking-wide whitespace-nowrap">
              {label} <span className="mx-1 md:mx-2">•</span>
            </span>
          ))}
        </Marquee>
        {/* Product Mockups Row - Seamless Marquee */}
        <div className="my-16">
          <Marquee direction="left" duration={60}>
            {mockups.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Product Mockup"
                width={320}
                height={320}
                className="h-64 md:h-80 rounded-2xl shadow-2xl border-4 border-white bg-white object-contain mx-8"
                style={{ minWidth: 220 }}
                priority={i === 0}
              />
            ))}
          </Marquee>
        </div>
        {/* Bottom Scrolling Text */}
        <Marquee direction="right" duration={40}>
          {bottomLabels.map((label, i) => (
            <span key={i} className="mx-4 md:mx-6 text-base md:text-2xl font-medium text-black/80 tracking-wide whitespace-nowrap">
              {label} <span className="mx-1 md:mx-2">•</span>
            </span>
          ))}
        </Marquee>
      </section>
    </>
  );
} 