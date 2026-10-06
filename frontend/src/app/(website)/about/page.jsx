'use client'
import React from 'react'
import {
  Leaf,
  Gem,
  Heart,
} from "lucide-react";
export default function AboutPage() {
  const stats = [
    {
      value: '12K+',
      label: 'Homes transformed',
    },
    {
      value: '280+',
      label: 'Curated products',
    },
    {
      value: '8',
      label: 'Showrooms across India',
    },
    {
      value: '4.9★',
      label: 'Average rating',
    },
  ]

  return (
    <div className="bg-[#f7f4f1] px-2 py-2">
      {/* Hero Section */}
      <section className="bg-[#2d190f] rounded-[28px] h-[250px] flex items-center justify-between px-16 overflow-hidden">
        
        {/* Left Content */}
        <div className="max-w-[620px]">
          <h1 className="text-white pt-7 text-[34px] leading-[1.1] tracking-[-2px]">
            Furniture crafted with{' '}
            <span className="italic text-[#d7c5b6]">
              purpose
            </span>
          </h1>

          <p className="text-[#b7a89a] text-[14px] leading-[1.8] mt-3">
            Founded in 2018, Nestro was born from a belief that beautiful
            furniture shouldn't be a luxury. We work directly with master
            craftsmen across India and Scandinavia to bring you pieces that
            are honest in material, thoughtful in design, and built to
            outlast trends.
          </p>
        </div>

        {/* Sofa Illustration */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-[250px] h-[150px] opacity-75">
            
            {/* Main Base */}
            <div className="absolute bottom-8 left-8 w-48 h-24 bg-[#8d7156] rounded-xl"></div>

            {/* Back */}
            <div className="absolute bottom-20 left-8 w-48 h-16 bg-[#9f8468] rounded-xl"></div>

            {/* Left Arm */}
            <div className="absolute bottom-8 left-0 w-8 h-28 bg-[#8d7156] rounded-xl"></div>

            {/* Right Arm */}
            <div className="absolute bottom-8 right-0 w-8 h-28 bg-[#8d7156] rounded-xl"></div>

            {/* Left Cushion */}
            <div className="absolute top-5 left-10 w-20 h-14 bg-[#bda185] rounded-xl opacity-60"></div>

            {/* Right Cushion */}
            <div className="absolute top-5 right-10 w-20 h-14 bg-[#bda185] rounded-xl opacity-60"></div>

            {/* Legs */}
            <div className="absolute bottom-0 left-4 w-3 h-10 bg-[#6d523f] rounded"></div>
            <div className="absolute bottom-0 right-4 w-3 h-10 bg-[#6d523f] rounded"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-9 bg-white border border-[#e8dfd6] rounded-[24px] py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          
          {stats.map((item, index) => (
            <div key={index} className="text-center">
              <h2 className="text-[#9b6a39] text-[24px] leading-none">
                {item.value}
              </h2>

              <p className="text-[#6b7280] text-[10px] mt-1">
                {item.label}
              </p>
            </div>
          ))}

          
        </div>
      </section>
      {/* Values Section */}
<section className="mt-20">
  <p className="text-[10px] tracking-[3px] uppercase text-[#9b6a39]">
    What Drives Us
  </p>

  <h2 className="text-[28px] text-[#111827] mb-5">
    Our Values
  </h2>

  <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className=" w-[380px] h-[180px] bg-white border border-[#e7ddd3] rounded-[24px] p-6">
      <Leaf size={28} className="text-[#9b6a39] mb-4" />

      <h3 className="text-[14px] text-[#111827] mb-2">
        Sustainable Craft
      </h3>

      <p className="text-gray-500 text-[10px] leading-4">
        We source responsibly — FSC-certified woods, natural fibres, and
        local artisans. Furniture that's good for your home and the
        planet.
      </p>
    </div>

    <div className=" w-[380px] h-[180px] bg-white border border-[#e7ddd3] rounded-[24px] p-6">
      <Gem size={28} className="text-[#9b6a39] mb-4" />

      <h3 className="text-[14px] text-[#111827] mb-2">
        Uncompromising Quality
      </h3>

      <p className="text-gray-500 text-[10px] leading-4">
        Every piece passes a 23-point quality check before it reaches your
        home. We back it with a 5-year warranty.
      </p>
    </div>

    <div className=" w-[380px] h-[180px] bg-white border border-[#e7ddd3] rounded-[24px] p-6">
      <Heart size={28} className="text-[#9b6a39] mb-4" />

      <h3 className="text-[14px] text-[#111827] mb-2">
        Design with Soul
      </h3>

      <p className="text-gray-500 text-[10px] leading-4">
        We don't chase trends. We design furniture that ages gracefully
        and belongs in every chapter of your life.
      </p>
    </div>
  </div>
</section>

{/* Team Section */}
<section className="mt-16">
  <p className="text-[10px] tracking-[3px] uppercase text-[#9b6a39] ">
    The People Behind Nestro
  </p>

  <h2 className="text-[24px] text-[#111827] mb-8">
    Our Team
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      {
        initials: "AK",
        name: "Aarav Kumar",
        role: "Founder & CEO",
      },
      {
        initials: "SM",
        name: "Sanya Mehta",
        role: "Head of Design",
      },
      {
        initials: "VR",
        name: "Vikram Rao",
        role: "Chief Craftsman",
      },
      {
        initials: "PJ",
        name: "Preet Joshi",
        role: "Customer Experience",
      },
    ].map((member, index) => (
      <div
        key={index}
        className="bg-white border border-[#e7ddd3] rounded-[24px] overflow-hidden"
      >
        <div className=" w-[292px] h-[120px] bg-[#efebe6] flex items-center justify-center">
          <span className="text-[32px] text-[#9b6a39]">
            {member.initials}
          </span>
        </div>

        <div className="p-6">
          <h3 className="text-[12px] text-[#111827]">
            {member.name}
          </h3>

          <p className="text-gray-500 text-[10px]"> 
            {member.role}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>
    </div>
  )
}