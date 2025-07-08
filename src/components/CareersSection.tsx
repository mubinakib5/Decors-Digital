"use client";

export default function CareersSection() {
  return (
    <section className="relative w-full py-24 bg-brand-black rounded-3xl overflow-hidden flex flex-col items-center mt-12">
      {/* Top left decorative image (optional) */}
      {/* <img src="/your-decor-image.png" className="absolute top-0 left-0 w-32 h-32 object-contain z-0" alt="Decor" /> */}
      <span className="inline-block px-5 py-1.5 rounded-full border border-[#FF4B3E] text-[#FF4B3E] font-medium text-sm mb-6 bg-transparent">Openings</span>
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
        Be an <span className="italic font-serif text-[#FF4B3E]">Ace</span> like us!
      </h2>
      <div className="w-full flex justify-center items-center">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Glassy Card with Red Glow */}
          <div className="relative bg-gradient-to-br from-[#FF4B3E]/80 to-[#18181b]/90 rounded-3xl border border-[#FF4B3E] shadow-2xl px-8 py-10 md:px-16 md:py-14 flex flex-col md:flex-row items-center md:items-start gap-8 overflow-hidden group" style={{ boxShadow: '0 8px 64px 0 #FF4B3E55, 0 1.5px 0 0 #FF4B3E' }}>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:blur-none group-hover:scale-105" style={{ boxShadow: '0 0 0 0 #FF4B3E00' }} />
            {/* Outer Glow on Hover */}
            <div className="absolute -inset-8 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-0" style={{ boxShadow: '0 0 64px 32px #FF4B3E88, 0 0 128px 64px #FF4B3E55' }} />
            {/* Job Info */}
            <div className="flex-1 flex flex-col gap-4 z-10">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">Senior Product Designer</div>
              <div className="text-base md:text-lg text-neutral-200 mb-4 max-w-2xl">
                We’re looking for a skilled Senior Product Designer to lead impactful projects, craft user-centric solutions, and guide teams with clarity. You&apos;ll own the design process from start to finish, turning complex problems into intuitive experiences. If you&apos;re a Figma pro, ...
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="px-4 py-1 rounded-full bg-[#18181b] text-white text-xs font-semibold border border-[#FF4B3E]/40">UPTO BDT 100k</span>
                <span className="px-4 py-1 rounded-full bg-[#18181b] text-white text-xs font-semibold border border-[#FF4B3E]/40">1 Vacancy</span>
                <span className="px-4 py-1 rounded-full bg-[#18181b] text-white text-xs font-semibold border border-[#FF4B3E]/40">Full Time</span>
                <span className="px-4 py-1 rounded-full bg-[#18181b] text-white text-xs font-semibold border border-[#FF4B3E]/40">Remote</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 