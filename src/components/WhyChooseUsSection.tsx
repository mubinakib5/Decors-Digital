"use client";

import { motion } from 'framer-motion';
import { FiDollarSign, FiHeadphones, FiInfo, FiPieChart, FiStar, FiUser } from 'react-icons/fi';

const features = [
  {
    icon: <FiInfo className="text-5xl text-indigo-400 mb-4" />,
    title: 'Unlimited Revisions',
    desc: "We're committed to your satisfaction with unlimited revisions at every step. Our mission is to make your vision come to life exactly as you imagine.",
  },
  {
    icon: <FiUser className="text-5xl text-indigo-400 mb-4" />,
    title: 'Lifetime Support',
    desc: "With our lifetime support, you’re never alone. We’ll be there for you at every stage with necessary guidance and assistance whenever you need it.",
  },
  {
    icon: <FiDollarSign className="text-5xl text-indigo-400 mb-4" />,
    title: 'Personalised Plans',
    desc: "Get top-quality service without breaking the bank. Our rates are designed to fit your budget so that you can get the best value for your investment.",
  },
  {
    icon: <FiPieChart className="text-5xl text-indigo-400 mb-4" />,
    title: 'Custom Design Solutions',
    desc: "Our easy payment options are completely flexible. So, you can invest in your business at your own pace.",
  },
  {
    icon: <FiStar className="text-5xl text-indigo-400 mb-4" />,
    title: '24/7 Customer Support',
    desc: "Benefit from the expertise of our carefully chosen resources that are always available to make your journey smooth and your business a success with outstanding results.",
  },
  {
    icon: <FiHeadphones className="text-5xl text-indigo-400 mb-4" />,
    title: 'Dedicated Assistance',
    desc: "Our team is always ready to help you with any queries or issues, ensuring a seamless experience from start to finish.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative w-full flex flex-col items-center py-24 bg-white bg-dot text-black">
      <div className="max-w-6xl w-full mx-auto px-4 flex flex-col items-center">
        <span className="inline-block px-5 py-1.5 rounded-full border border-green-400 text-green-600 font-medium text-sm mb-6 bg-transparent">Why Choose Us</span>
        <h2 className="text-2xl md:text-5xl font-bold text-black mb-4 text-center">
          We <span className="italic font-serif">Design</span> for the <span className="italic font-serif">Future</span> to<br />
          Drive Today’s <span className="italic font-serif">Success</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full mt-8 md:mt-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl bg-white/70 backdrop-blur-md border border-black/10 shadow-lg p-4 md:p-8 flex flex-col items-center md:items-start hover:shadow-2xl transition min-h-[180px] md:min-h-[220px]"
            >
              <div className="w-full flex justify-center items-center mb-4">
                <span className="block md:hidden">{f.icon && f.icon.type && f.icon.type({ className: 'text-3xl text-indigo-400' })}</span>
                <span className="hidden md:block">{f.icon}</span>
              </div>
              <div className="text-lg md:text-2xl font-bold mb-2 w-full text-center md:text-left">{f.title}</div>
              <div className="text-sm md:text-base text-neutral-700 w-full text-center md:text-left">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 