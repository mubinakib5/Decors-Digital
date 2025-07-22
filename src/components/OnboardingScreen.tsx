"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function OnboardingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Card fall duration + fade out
    const timer = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Cover Image */}
          <img
            src="/DD_Cover.png"
            alt="Decor's Digital Onboarding"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
          {/* Falling Card Animation */}
          <motion.img
            src="/DD_Card.png"
            alt="Decor's Digital Card"
            className="w-[32rem] h-80 object-contain drop-shadow-lg z-10"
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 12, duration: 1.2, delay: 0.3 }}
            style={{ position: "relative" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 