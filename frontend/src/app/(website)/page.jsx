import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import Hero from '@/components/website/Hero';
import { fetchCategory, fetchProduct } from "@/utils/api";
import Slider from '@/components/website/Slider';
import CategorySection from '@/components/website/CategorySection';
import { getProfile } from "@/utils/serverapi";

export const dynamic = "force-dynamic";

export default async function HomePage() {

  const [products, categories, getMe] = await Promise.all([
    fetchProduct({ status: true }),
    fetchCategory({ status: true }),
    getProfile(),
  ]);

  console.log(
    "HOME PRODUCTS:",
    JSON.stringify(products, null, 2)
  );

  console.log(
    "HOME CATEGORIES:",
    JSON.stringify(categories, null, 2)
  );

  console.log(
    "HOME PROFILE:",
    JSON.stringify(getMe, null, 2)
  );

  const user = getMe?.success
    ? getMe.data
    : null;

  const featuredProduct =
    products?.data?.find(
      (product) =>
        product?.featured === true &&
        product?.status === true
    ) || null;

  const justLandedProducts =
    products?.data
      ?.filter(
        (product) =>
          product?.newArrival === true &&
          product?.status === true
      )
      ?.slice(0, 2) || [];

  return (
    <div className="w-full space-y-7">

      <Hero />

      <CategorySection categories={categories?.data || []} />

      <Slider
        products={products?.data || []}
        user={user}
      />

      <section className="w-full space-y-4 pt-2">

        {/* Heading + View All */}
        <div className="flex items-end justify-between gap-4 border-b border-neutral-100 pb-2">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#A3704C] block">
              New Arrivals
            </span>

            <h2 className="text-2xl sm:text-2xl font-serif text-[#1E1E1E]">
              Just Landed
            </h2>
          </div>

          <Link
            href="/store"
            className="text-xs text-[#8C5A3C] hover:text-[#73492F] underline underline-offset-4 transition cursor-pointer whitespace-nowrap"
          >
            View all
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* =========================
              1. DYNAMIC FEATURED PRODUCT
          ========================= */}

          {featuredProduct ? (
            <Link
              href={`/product/${featuredProduct.slug}`}
              className="lg:col-span-5 bg-[#2A2019] text-[#F9F8F6] rounded-[20px] p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[380px] h-auto lg:h-[380px] relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition duration-300 cursor-pointer"
            >

              {/* PRODUCT DETAILS */}

              <div className="space-y-1.5 z-10">

                <span className="text-[9px] tracking-wider uppercase text-[#C49A78] block">
                  Featured
                </span>

                <h3 className="text-xl sm:text-xl font-serif leading-tight max-w-[260px]">
                  {featuredProduct.name}
                </h3>

                <p className="text-[11px] text-[#FFFFFF80] font-light max-w-[280px] line-clamp-2">
                  {featuredProduct.shortDescription ||
                    featuredProduct.description ||
                    "Premium furniture designed for modern living."}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">

                  <p className="text-lg text-[#C49A78]">
                    ₹{Number(
                      featuredProduct.salePrice || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  {featuredProduct.originalPrice &&
                    Number(featuredProduct.originalPrice) >
                    Number(featuredProduct.salePrice) && (
                      <p className="text-[11px] text-white/40 line-through">
                        ₹{Number(
                          featuredProduct.originalPrice
                        ).toLocaleString("en-IN")}
                      </p>
                    )}

                </div>

              </div>

              {/* PRODUCT IMAGE */}

              <div className="absolute inset-x-4 sm:inset-x-8 top-[125px] bottom-[65px] flex items-center justify-center">

                {featuredProduct.thumbnail ? (
                  <div className="relative w-[190px] h-[145px] sm:w-[230px] sm:h-[170px] group-hover:scale-105 transition duration-500">

                    <Image
                      src={featuredProduct.thumbnail}
                      alt={featuredProduct.name}
                      fill
                      sizes="(max-width: 640px) 190px, 230px"
                      className="object-contain drop-shadow-xl"
                    />

                  </div>
                ) : (
                  <div className="w-48 h-32 bg-white/[0.06] rounded-xl border border-white/10" />
                )}

              </div>

              {/* BUTTON */}

              <div className="z-10 self-start">

                <span className="inline-block bg-[#8C5A3C] hover:bg-[#73492F] text-white text-[11px] px-4 py-2 rounded-md transition bg-opacity-90 backdrop-blur-sm">
                  View in Store
                </span>

              </div>

            </Link>
          ) : (
            <div className="lg:col-span-5 bg-[#2A2019] text-[#F9F8F6] rounded-[20px] p-5 sm:p-8 min-h-[380px] h-auto lg:h-[380px] flex items-center justify-center">

              <p className="text-sm text-white/50 text-center">
                No featured product available
              </p>

            </div>
          )}

          {/* =========================
              2. VERTICAL PRODUCT CARDS
          ========================= */}

          <div className="lg:col-span-4 flex flex-col justify-between gap-4">

            {justLandedProducts[0] && (
              <Link
                href={`/product/${justLandedProducts[0].slug}`}
                className="bg-white border border-neutral-200 rounded-[16px] overflow-hidden flex flex-col h-[182px] shadow-sm hover:shadow-md transition duration-300 group"
              >

                <div className="bg-[#F4EFEA] h-[128px] sm:h-[132px] relative w-full flex items-center justify-center overflow-hidden">

                  {justLandedProducts[0].thumbnail && (
                    <Image
                      src={justLandedProducts[0].thumbnail}
                      alt={justLandedProducts[0].name}
                      width={200}
                      height={90}
                      sizes="150px"
                      className="w-full max-w-[140px] h-[80%] object-contain group-hover:scale-105 transition duration-300 drop-shadow-sm"
                    />
                  )}

                </div>

                <div className="p-2 bg-white flex justify-between items-end h-[54px] gap-2">

                  <div className="space-y-0.5 min-w-0">

                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block truncate">
                      {justLandedProducts[0].categoryId?.name ||
                        "Furniture"}
                    </span>

                    <h4 className="text-xs text-[#1E1E1E] line-clamp-1">
                      {justLandedProducts[0].name}
                    </h4>

                    <div className="text-[#8C5A3C] text-[10px]">
                      ★★★★★
                    </div>

                  </div>

                  <span className="text-xs text-[#1E1E1E] whitespace-nowrap shrink-0">
                    ₹{Number(
                      justLandedProducts[0].salePrice || 0
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

              </Link>
            )}

            {justLandedProducts[1] && (
              <Link
                href={`/product/${justLandedProducts[1].slug}`}
                className="bg-white border border-neutral-200 rounded-[16px] overflow-hidden flex flex-col h-[182px] shadow-sm hover:shadow-md transition duration-300 group cursor-pointer"
              >

                {/* Real Product Image */}

                <div className="bg-[#F4EFEA] h-[112px] sm:h-[128px] relative w-full flex items-center justify-center overflow-hidden">

                  {justLandedProducts[1].thumbnail && (
                    <Image
                      src={justLandedProducts[1].thumbnail}
                      alt={justLandedProducts[1].name}
                      width={200}
                      height={90}
                      sizes="150px"
                      className="w-full max-w-[140px] h-[80%] object-contain group-hover:scale-105 transition duration-300 drop-shadow-sm"
                    />
                  )}

                </div>

                {/* Real Product Details */}

                <div className="p-3 bg-white flex justify-between items-end h-[70px] gap-2">

                  <div className="space-y-0.5 min-w-0">

                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block truncate">
                      {justLandedProducts[1].categoryId?.name ||
                        justLandedProducts[1].category?.name ||
                        "Furniture"}
                    </span>

                    <h4 className="text-xs text-[#1E1E1E] line-clamp-1">
                      {justLandedProducts[1].name}
                    </h4>

                    <div className="flex text-[#8C5A3C] pt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="text-[10px]"
                        >
                          ★
                        </span>
                      ))}
                    </div>

                  </div>

                  <span className="text-xs text-[#1E1E1E] whitespace-nowrap shrink-0">
                    ₹{Number(
                      justLandedProducts[1].salePrice || 0
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

              </Link>
            )}

          </div>

          {/* =========================
              3. OFFER CARDS
          ========================= */}

          <div className="lg:col-span-3 flex flex-col justify-between gap-4">

            <div className="bg-[#F4EFEA] border border-neutral-100 rounded-[16px] p-4 sm:p-5 flex flex-col justify-between min-h-[182px] h-auto lg:h-[182px]">

              <div className="space-y-1">

                <span className="text-[9px] tracking-wider uppercase text-[#A3704C] block">
                  Offer
                </span>

                <h4 className="text-sm text-[#1E1E1E]">
                  First order 15% off
                </h4>

                <p className="text-[11px] text-gray-500 font-light">
                  Use code{" "}
                  <span className="font-mono text-[#8C5A3C]">
                    Nestro15
                  </span>{" "}
                  at checkout
                </p>

              </div>

              <div>

                <Link
                  href="/store"
                  className="inline-block bg-[#8C5A3C] hover:bg-[#73492F] text-white text-[11px] px-4 py-2 rounded-md transition text-center cursor-pointer"
                >
                  Shop Now
                </Link>

              </div>

            </div>

            <div className="bg-white border border-neutral-200 rounded-[16px] p-4 sm:p-5 flex flex-col justify-between min-h-[182px] h-auto lg:h-[182px] shadow-[0_2px_15px_rgba(0,0,0,0.01)]">

              <div className="space-y-1">

                <span className="text-[9px] tracking-wider uppercase text-gray-400 block">
                  Free Delivery
                </span>

                <h4 className="text-sm text-[#1E1E1E]">
                  On orders above ₹50,000
                </h4>

                <p className="text-[11px] text-gray-400 font-light leading-snug">
                  White glove service. Assembly included.
                </p>

              </div>

              <div className="text-[#8C5A3C] opacity-80">

                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          FEATURES RIBBON
      ========================= */}

      <section className="w-full bg-white border border-neutral-200 rounded-[20px] overflow-hidden mt-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 md:divide-x divide-neutral-200">

          {/* Features here... (Static content, no interaction needed) */}

        </div>

      </section>

      {/* ... (Remaining code continues the same) ... */}

      {/* Subscribe Button */}

      <button className="bg-[#8C5A3C] hover:bg-[#73492F] text-white text-xs px-6 py-2.5 rounded-md transition whitespace-nowrap cursor-pointer">
        Subscribe
      </button>

    </div>
  );
}