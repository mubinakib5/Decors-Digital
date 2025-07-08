"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const testimonials = [
  {
    name: "Jenna Carvalho",
    title: "Principal @ Guardian Estate Company",
    company: "GUARDIAN",
    logo: null,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Design Monks was a pleasure to work with. They were proactive, and efficient, and never hesitated to challenge me in my assumptions. The design they built for me was beautiful, and I would not hesitate to retain them again in the future.",
  },
  {
    name: "Alex Smith",
    title: "CEO @ TechNova",
    company: "TECHNOVA",
    logo: null,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The team at Design Monks exceeded our expectations. Their creativity and attention to detail helped us launch a product that stands out in the market.",
  },
  {
    name: "Priya Patel",
    title: "Marketing Lead @ BrightIdeas",
    company: "BRIGHTIDEAS",
    logo: null,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Working with Design Monks was seamless. They understood our vision and delivered a website that truly represents our brand.",
  },
  {
    name: "David Kim",
    title: "Founder @ Startly",
    company: "STARTLY",
    logo: null,
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    text: "Professional, responsive, and innovative. I highly recommend Design Monks for any digital project.",
  },
];

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const prev = () => {
    setDirection(-1);
    setIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  };
  const next = () => {
    setDirection(1);
    setIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  };

  // Stacking effect: show up to 3 cards, with the current on top
  const getStack = () => {
    const stack = [];
    for (let i = 0; i < Math.min(3, testimonials.length); i++) {
      const pos = (idx + i) % testimonials.length;
      stack.push({ ...testimonials[pos], stackIdx: i });
    }
    return stack.reverse(); // so the current is rendered last (on top)
  };
  const stack = getStack();

  return (
    <section className="relative w-full py-24 bg-[#faf9fb] bg-dot flex flex-col items-center">
      <span className="inline-block px-5 py-1.5 rounded-full border border-[#FF4B3E] text-[#FF4B3E] font-medium text-sm mb-6 bg-transparent">Client Stories</span>
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
        <span className="text-brand-black">Our Clients Love</span><br />
        <span className="italic font-serif text-[#FF4B3E]">to Recommend Us</span>
      </h2>
      <div className="flex justify-center items-center w-full gap-4 md:gap-10">
        {/* Left Arrow */}
        <button onClick={prev} className="w-12 h-12 rounded-full border-2 border-[#FF4B3E] bg-white text-[#FF4B3E] flex items-center justify-center shadow hover:bg-[#FF4B3E] hover:text-white transition z-20">
          <FiChevronLeft className="text-3xl" />
        </button>
        <div className="relative flex items-center justify-center w-full max-w-3xl min-h-[400px]">
          {/* Stacking Cards */}
          <AnimatePresence initial={false} custom={direction}>
            {stack.map((item, i) => {
              const isTop = i === stack.length - 1;
              // Consistent stacking: each card offset by 16px more than the one above
              const offset = 16 * (stack.length - 1 - i);
              return (
                <motion.div
                  key={item.name + idx}
                  className={`absolute left-0 top-0 w-full h-full flex ${isTop ? 'z-20' : 'z-10'}`}
                  initial={{
                    opacity: 0,
                    scale: isTop ? 0.98 : 0.96 - 0.02 * (stack.length - 1 - i),
                    y: isTop ? direction * 40 : offset,
                  }}
                  animate={{
                    opacity: 1,
                    scale: isTop ? 1 : 0.98 - 0.02 * (stack.length - 1 - i),
                    y: isTop ? 0 : offset,
                  }}
                  exit={{
                    opacity: 0,
                    scale: isTop ? 0.98 : 0.96 - 0.02 * (stack.length - 1 - i),
                    y: isTop ? -direction * 40 : offset,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 40, duration: 0.5 }}
                  style={{ pointerEvents: isTop ? 'auto' : 'none' }}
                >
                  <div className="flex w-full max-w-sm md:max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-black/10 overflow-hidden relative flex-col md:flex-row">
                    {/* Left: Photo */}
                    <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-[#e9d5ff] min-w-0 md:min-w-[260px] w-full md:w-auto">
                      <Image src={item.image} alt={item.name} width={160} height={160} className="w-20 h-20 md:w-40 md:h-40 rounded-2xl object-cover mb-2 border-4 border-white shadow-lg" />
                    </div>
                    {/* Right: Testimonial */}
                    <div className="flex-1 flex flex-col justify-center p-4 md:p-10 w-full">
                      <div className="text-2xl md:text-5xl text-[#FF4B3E] font-serif font-bold mb-2 md:mb-4">“</div>
                      <div className="text-sm md:text-xl text-black mb-4 md:mb-8">{item.text}</div>
                      <div className="flex items-center gap-2 md:gap-6 flex-wrap">
                        <div>
                          <div className="font-bold text-sm md:text-lg text-black">{item.name}</div>
                          <div className="text-xs md:text-sm text-neutral-500">{item.title}</div>
                        </div>
                        {item.logo && <Image src={item.logo} alt={item.company} width={32} height={32} className="h-8" />}
                        {!item.logo && <span className="ml-auto text-xs tracking-widest text-neutral-400 font-serif">{item.company}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {/* Right Arrow */}
        <button onClick={next} className="w-12 h-12 rounded-full border-2 border-[#FF4B3E] bg-white text-[#FF4B3E] flex items-center justify-center shadow hover:bg-[#FF4B3E] hover:text-white transition z-20">
          <FiChevronRight className="text-3xl" />
        </button>
      </div>
    </section>
  );
} 