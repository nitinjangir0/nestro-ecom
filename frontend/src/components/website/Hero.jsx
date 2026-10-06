'use client'
import React from 'react'
import Link from 'next/link'; // Next.js Link इम्पोर्ट किया

export default function Hero() {
  return (
    <div>  
      {/* ================= HERO SECTION ================= */}
      <section className="w-full bg-[#2A2019] text-[#F9F8F6] rounded-[24px] p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between h-95 relative overflow-hidden">
        {/* लेफ्ट साइड: टेक्स्ट कंटेंट */}
        <div className="max-w-xl space-y-2 z-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#A3704C] font-semibold block">
            Summer Collection 2026
          </span>
          <h1 className="text-4xl sm:text-2xl md:text-[46px] font-serif font-medium tracking-tight leading-[1.15]">
            Where Comfort <br />
            Meets <span className="italic font-light text-[#C49A78]">Craft</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#FFFFFF80] font-light max-w-sm leading-relaxed">
            Scandinavian-inspired furniture for modern living. <br />
            Curated pieces that endure seasons.
          </p>
          {/* बटन्स */}
          <div className="flex items-center space-x-4 pt-4">
            <Link href="/store" className="bg-[#8C5A3C] hover:bg-[#73492F] text-white text-xs font-semibold px-6 py-3 rounded-md transition duration-300 flex items-center space-x-2">
              <span>Shop Collection</span>
              <span>&rarr;</span>
            </Link>
            <button className="border border-neutral-600 hover:border-neutral-400 text-white text-xs font-semibold px-6 py-3 rounded-md transition duration-300 bg-black/10 backdrop-blur-sm">
              View Lookbook
            </button>
          </div>
        </div>

        {/* राइट साइड: सोफा ट्रांसपेरेंट ग्राफिक */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-6 md:mt-0 z-10 select-none">
          <div className="relative w-[340px] h-[180px] flex items-center justify-center">
            <div className="absolute left-[34px] top-[15px] w-[110px] h-[55px] bg-white/[0.06] border border-white/10 rounded-[14px] z-10" />
            <div className="absolute right-[34px] top-[15px] w-[110px] h-[55px] bg-white/[0.06] border border-white/10 rounded-[14px] z-10" />
            <div className="absolute left-[14px] top-[26px] w-[26px] h-[105px] bg-white/[0.04] border border-white/5 rounded-[12px] z-10" />
            <div className="absolute right-[14px] top-[26px] w-[26px] h-[105px] bg-white/[0.04] border border-white/5 rounded-[12px] z-10" />
            <div className="absolute top-[42px] w-[284px] h-[92px] bg-white/[0.07] border border-white/10 rounded-[20px] z-20 backdrop-blur-[1px]" />
            <div className="absolute left-[12px] top-[66px] w-[28px] h-[72px] bg-white/[0.05] border border-white/10 rounded-[12px] z-30" />
            <div className="absolute right-[12px] top-[66px] w-[28px] h-[72px] bg-white/[0.05] border border-white/10 rounded-[12px] z-30" />
            <div className="absolute bottom-[34px] w-[220px] h-[10px] bg-white/[0.03] border-t border-white/5 z-0" />
          </div>
          <div className="w-[260px]  bg-black/15 rounded-full blur-[4px] mt-3 mix-blend-multiply" />
        </div>
      </section></div>
  )
}
