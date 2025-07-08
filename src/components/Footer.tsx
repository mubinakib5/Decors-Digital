import Image from "next/image";
import { FaBehance, FaDribbble, FaFacebook, FaInstagram, FaLinkedin, FaLocationDot, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 pt-16 pb-4 px-4 md:px-0 mt-12 text-black">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Top: Social, Description, Newsletter */}
        <div className="w-full flex flex-col items-center gap-6">
          <p className="text-center text-lg md:text-xl font-manrope mb-2 max-w-3xl">
            Say goodbye to outdated enterprise software and welcome the smoother one. We lead you from design to product innovation to shape your path from idea to success
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 mb-2">
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl hover:bg-neutral-200 transition" aria-label="Dribbble"><FaDribbble /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl hover:bg-neutral-200 transition" aria-label="Behance"><FaBehance /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl hover:bg-neutral-200 transition" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl hover:bg-neutral-200 transition" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl hover:bg-neutral-200 transition" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl hover:bg-neutral-200 transition" aria-label="X"><FaXTwitter /></a>
          </div>
          {/* Newsletter */}
          <form className="flex flex-col md:flex-row gap-2 w-full max-w-md mt-2">
            <input type="email" required placeholder="Your email here" className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-red transition text-base" />
            <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#7b2ff2] to-[#f357a8] text-white font-semibold text-base shadow hover:from-[#f357a8] hover:to-[#7b2ff2] transition">
              Subscribe <span className="ml-1">→</span>
            </button>
          </form>
        </div>
        {/* Middle: Links & Contact */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 mt-12 mb-8 text-left">
          <div>
            <div className="font-bold mb-3 text-base md:text-lg">Important Links</div>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="#contact" className="hover:underline">Contact Us</a></li>
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#projects" className="hover:underline">Projects</a></li>
              <li><a href="#blogs" className="hover:underline">Blogs</a></li>
              <li><a href="#pricing" className="hover:underline">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-3 text-base md:text-lg">Services</div>
            <ul className="space-y-2 text-sm md:text-base">
              <li>UI/UX Design</li>
              <li>Web Design</li>
              <li>Logo & Branding</li>
              <li>Webflow Design</li>
              <li>Framer Design</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-3 text-base md:text-lg">Specialized Industry</div>
            <ul className="space-y-2 text-sm md:text-base">
              <li>Fintech Industry</li>
              <li>Healthcare & Fitness Industry</li>
              <li>Edtech Industry</li>
              <li>E-Commerce Industry</li>
              <li>Company Deck <span className="inline-block ml-1 text-xs text-brand-red">★</span></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-3 text-base md:text-lg">Contact</div>
            <ul className="space-y-2 text-sm md:text-base">
              <li className="flex items-center gap-2"><FaLocationDot className="text-brand-red" /> Dhaka, Bangladesh</li>
              <li className="flex items-center gap-2"><FaLocationDot className="text-brand-red" /> California, USA</li>
              <li className="flex items-center gap-2"><FaLocationDot className="text-brand-red" /> Dubai, UAE</li>
              <li className="flex items-center gap-2"><FaWhatsapp className="text-green-500" /> +880 1798-155521</li>
              <li className="flex items-center gap-2"><FaWhatsapp className="text-green-500" /> +17165036335</li>
            </ul>
          </div>
        </div>
        {/* Partner Badges */}
        <div className="w-full border-t border-neutral-200 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8 items-center justify-center w-full md:w-auto">
            <div className="flex flex-col items-center">
              <Image src="/file.svg" alt="Framer" width={32} height={32} className="h-8 mb-1" />
              <span className="text-xs md:text-sm font-medium">Professional Partner</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/globe.svg" alt="Webflow" width={32} height={32} className="h-8 mb-1" />
              <span className="text-xs md:text-sm font-medium">Professional Partner</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/next.svg" alt="Behance" width={32} height={32} className="h-8 mb-1" />
              <span className="text-xs md:text-sm font-medium">Top Team On Behance</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/window.svg" alt="Dribbble" width={32} height={32} className="h-8 mb-1" />
              <span className="text-xs md:text-sm font-medium">Top Team On Dribbble</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/vercel.svg" alt="Clutch" width={32} height={32} className="h-8 mb-1" />
              <span className="text-xs md:text-sm font-medium">Reviewed On <span className="text-yellow-500">★★★★★</span></span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/vercel.svg" alt="Google" width={32} height={32} className="h-8 mb-1" />
              <span className="text-xs md:text-sm font-medium">Reviewed On <span className="text-yellow-500">★★★★★</span></span>
            </div>
          </div>
        </div>
        {/* Bottom: Legal */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between mt-4 text-xs text-neutral-500 gap-2">
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Terms & Conditions</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
          <div className="text-center">© {new Date().getFullYear()}, Design Monks, All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
} 