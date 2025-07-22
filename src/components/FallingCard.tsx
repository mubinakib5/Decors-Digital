"use client";
import { motion } from "framer-motion";

export default function FallingCard() {
  return (
    <div className="relative w-full flex justify-center items-start h-96">
      {/* 卡片动画 */}
      <motion.img
        src="/DD_Card.png"
        alt="Decor's Digital Card"
        className="w-64 h-40 object-contain drop-shadow-lg z-10"
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 60, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 12, duration: 1.2 }}
      />
      {/* 烟雾动画 */}
      <motion.div
        className="absolute left-1/2 top-[110px] -translate-x-1/2 w-40 h-20 pointer-events-none z-0"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 0.7, y: 0, scale: 1 }}
        transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
        style={{ filter: "blur(12px)" }}
      >
        <div className="w-full h-full bg-gradient-to-t from-gray-400/60 via-white/40 to-transparent rounded-full" />
      </motion.div>
    </div>
  );
} 