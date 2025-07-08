"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    title: "UI/UX Design",
    color: "bg-[#18181b]/80 backdrop-blur-md border border-white/10",
    content: (
      <>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
          UI/UX <span className="italic font-serif">Design</span>
        </h3>
        <div className="w-24 h-1 bg-[#FF4B3E] rounded mb-4"></div>
        <p className="text-base md:text-lg text-neutral-300 mb-6 max-w-lg">
          UI/UX Design, App Design, Website Design, Dashboard Design, Wireframing & Prototyping, Interaction Design, and Product Design.
        </p>
        <a href="#services" className="inline-flex items-center gap-2 text-[#FF4B3E] font-semibold hover:underline transition">
          See More
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </>
    ),
    image: "/Mockup_Image.png",
    phone: "/DD@3x.png",
  },
  {
    title: "Web Development",
    color: "bg-[#18181b]/80 backdrop-blur-md border border-white/10",
    content: (
      <>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
          Web <span className="italic font-serif">Development</span>
        </h3>
        <div className="w-24 h-1 bg-[#FF4B3E] rounded mb-4"></div>
        <p className="text-base md:text-lg text-neutral-300 mb-6 max-w-lg">
          Frontend Development, Backend Development, Full Stack Solutions, Mobile App Development, Custom Web Applications, API Integration.
        </p>
        <a href="#services" className="inline-flex items-center gap-2 text-[#FF4B3E] font-semibold hover:underline transition">
          See More
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </>
    ),
    image: "/Mockup_Image.png",
    phone: "/DD@3x.png",
  },
];

const CARD_HEIGHT = 420;
const GLIMPSE = 56;

export default function WhatWeDoSection() {
  return (
    <section className="relative w-full flex flex-col items-center py-24 bg-[#141414]">
      <div className="max-w-7xl w-full mx-auto px-4 flex flex-col items-center">
        {/* Section Heading */}
        <button className="inline-block px-5 py-1.5 rounded-full border border-[#FF4B3E] text-[#FF4B3E] font-medium text-sm mb-6 bg-transparent hover:bg-[#FF4B3E20] transition">What We Do</button>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
          We Design <span className="italic font-serif">Brands</span> That <span className="italic font-serif">Speak</span> To Audiences
        </h2>
        {/* Stacking Cards Hybrid */}
        <div className="relative flex flex-col items-center w-full max-w-6xl mx-auto" style={{ minHeight: 2 * CARD_HEIGHT + 100 }}>
          {[...services].reverse().map((service, revIdx) => {
            const idx = services.length - 1 - revIdx;
            return (
              <div
                key={service.title}
                style={{
                  position: 'sticky',
                  top: revIdx * GLIMPSE,
                  zIndex: 1 + revIdx, // bottom card lowest, top card highest
                  marginBottom: 32,
                  height: CARD_HEIGHT,
                  transition: 'box-shadow 0.3s',
                  boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
                }}
                className={`w-full ${service.color} rounded-3xl px-16 py-16 overflow-hidden flex flex-col md:flex-row items-stretch backdrop-blur`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, delay: 0.1 + idx * 0.2 }}
                  className="flex-1 flex flex-col justify-center"
                >
                  {service.content}
                </motion.div>
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="relative flex items-end">
                    {/* Laptop Mockup */}
                    <div className="w-96 h-56 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#E3F0FF] to-[#B3D8FF] mr-4">
                      <Image src={service.image} alt="Laptop Mockup" width={384} height={224} className="w-full h-full object-contain" />
                    </div>
                    {/* Phone Mockup, overlapping */}
                    <div className="absolute -right-20 bottom-0 w-48 h-72 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white bg-gradient-to-br from-[#FFD6D6] to-[#FF4B3E]">
                      <Image src={service.phone} alt="Phone Mockup" width={192} height={288} className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Book A Call Button */}
      <div className="w-full flex justify-center mt-12">
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-transform z-20 text-brand-white bg-brand-red border-2 relative overflow-hidden group"
        >
          <span className="relative z-10">Book a call</span>
          <span className="absolute inset-0 rounded-xl pointer-events-none shimmer-stroke" />
        </motion.a>
      </div>
    </section>
  );
} 