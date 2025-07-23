"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
      <button
        className="focus:outline-none"
        onClick={() => router.push("/thedecor")}
        aria-label="The Decor"
      >
        <img src="/THE DECOR DP.png" alt="The Decor" className="w-96 h-96 object-cover rounded-xl border-4 border-gray-200 hover:scale-105 transition-transform duration-200" />
      </button>
      <button
        className="focus:outline-none"
        onClick={() => router.push("/decorsdigital")}
        aria-label="Decors Digital"
      >
        <img src="/Decors Digital.jpeg" alt="Decors Digital" className="w-96 h-96 object-cover rounded-xl border-4 border-gray-200 hover:scale-105 transition-transform duration-200" />
      </button>
      <button
        className="focus:outline-none"
        onClick={() => router.push("/flydecor")}
        aria-label="Fly Decor"
      >
        <img src="/Fly Decor.jpg" alt="Fly Decor" className="w-96 h-96 object-cover rounded-xl border-4 border-gray-200 hover:scale-105 transition-transform duration-200" />
      </button>
    </main>
  );
}