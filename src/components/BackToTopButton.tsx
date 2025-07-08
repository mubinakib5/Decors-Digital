"use client";
import { FiArrowUp } from 'react-icons/fi';

export default function BackToTopButton() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-neutral-800 transition"
      aria-label="Back to Top"
    >
      <FiArrowUp className="text-2xl" />
    </button>
  );
} 