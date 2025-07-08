"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto py-20 px-4">
      {/* Hero/Story Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-20 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-white mb-6">
          Our Story
        </h1>
        <p className="text-lg md:text-2xl text-brand-silver max-w-2xl mx-auto">
          Decor&apos;s Digital was born from a passion for creativity and a drive to help brands tell their stories in unforgettable ways. We believe in the power of design, strategy, and technology to inspire, engage, and transform businesses.
        </p>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Creativity",
              desc: "We push boundaries and think outside the box to deliver unique solutions.",
              icon: "🎨",
            },
            {
              title: "Collaboration",
              desc: "We believe the best results come from working closely with our clients and each other.",
              icon: "🤝",
            },
            {
              title: "Excellence",
              desc: "We strive for perfection in every project, big or small.",
              icon: "🏆",
            },
          ].map((v) => (
            <motion.div
              key={v.title}
              whileHover={{ scale: 1.05 }}
              className="bg-brand-charcoal/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl border border-brand-charcoal"
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <div className="text-xl font-semibold text-brand-white mb-2">{v.title.replace("'", "&apos;")}</div>
              <div className="text-brand-silver">{v.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-8 text-center">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            {
              name: "Mubin Akib",
              role: "Founder & Creative Director",
              img: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Sara Lee",
              role: "Lead Designer",
              img: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
              name: "David Kim",
              role: "Brand Strategist",
              img: "https://randomuser.me/api/portraits/men/65.jpg",
            },
            {
              name: "Emily Chen",
              role: "UI/UX Specialist",
              img: "https://randomuser.me/api/portraits/women/68.jpg",
            },
            {
              name: "Alex Smith",
              role: "Web Developer",
              img: "https://randomuser.me/api/portraits/men/43.jpg",
            },
            {
              name: "Priya Patel",
              role: "Marketing Lead",
              img: "https://randomuser.me/api/portraits/women/65.jpg",
            },
          ].map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ scale: 1.05 }}
              className="bg-brand-charcoal/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl border border-brand-charcoal group"
            >
              <Image src={member.img} alt={member.name} width={96} height={96} className="w-24 h-24 rounded-full object-cover border-4 border-brand-redAccent mb-4 shadow-lg group-hover:scale-110 transition-transform" />
              <div className="text-brand-white font-semibold text-lg mb-1">{member.name}</div>
              <div className="text-brand-silver text-sm mb-2">{member.role}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
} 