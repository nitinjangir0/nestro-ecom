
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#1A130E] text-[#F9F8F6] px-8 py-5 md:px-12 md:py-10 -mt-10 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-5">
        {/* Brand Section */}
        <div className="md:col-span-5 space-y-4">
          <Link
            href="/"
            className="inline-block text-xl font-serif tracking-[0.15em] uppercase text-white transition hover:text-[#A3704C]"
          >
            NESTRO.
          </Link>

          <p className="text-xs text-[#FFFFFF80] font-light max-w-sm leading-relaxed">
            Curated furniture for thoughtful homes. Crafted with intention,
            made to endure.
          </p>

          {/* Newsletter */}
          <form
            onSubmit={handleSubscribe}
            className="flex items-center w-full max-w-sm border border-white/10 rounded-md overflow-hidden bg-white/[0.02]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full min-w-0 bg-transparent px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-[#8C5A3C] hover:bg-[#73492F] text-white text-xs px-5 py-2.5 transition whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          {/* Developer Credit */}
          <p className="text-[11px] leading-relaxed text-[#FFFFFF80] font-light">
            Designed & developed by{" "}
            <span className="text-[#A3704C] hover:text-white transition">
              Nitin Jangir
            </span>
            <br />
            Frontend Developer
          </p>
        </div>

        {/* Links Section */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 md:pl-8">
          {/* Company */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#A3704C]">
              Company
            </h4>

            <ul className="space-y-2 text-xs text-[#FFFFFF80] font-light">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition"
                >
                  Our Story
                </Link>
              </li>

              <li>
                <Link
                  href="/store"
                  className="hover:text-white transition"
                >
                  Shop Furniture
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="hover:text-white transition"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#A3704C]">
              Support
            </h4>

            <ul className="space-y-2 text-xs text-[#FFFFFF80] font-light">
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white transition"
                >
                  My Cart
                </Link>
              </li>

              <li>
                <Link
                  href="/wishlist"
                  className="hover:text-white transition"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  href="/checkout"
                  className="hover:text-white transition"
                >
                  Checkout
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="space-y-3.5 col-span-2 sm:col-span-1">
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#A3704C]">
              Follow Us
            </h4>

            <ul className="space-y-2 text-xs text-[#FFFFFF80] font-light mb-4">
              <li>
                <a
                  href="https://www.instagram.com/nitin_jangir1604"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  Instagram
                </a>
              </li>

              <li>
                <a
                  href="https://www.linkedin.com/in/nitin-jangir-b261a9398"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  LinkedIn
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/nitinjangir0"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  GitHub
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/nitin_jangir1604"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[#A3704C] hover:text-white hover:border-white/30 transition"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect
                    width="20"
                    height="20"
                    x="2"
                    y="2"
                    rx="5"
                    ry="5"
                  />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/nitin-jangir-b261a9398"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[#A3704C] hover:text-white hover:border-white/30 transition"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 11v6M8 8v.01M12 17v-6m0 3a3 3 0 016 0v3" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/nitinjangir0"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[#A3704C] hover:text-white hover:border-white/30 transition"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 22v-4a4.8 4.8 0 00-1-3.5c3.3 0 6.7-1.6 6.7-7A5.4 5.4 0 0019.3 4 5 5 0 0019.2.5S17.8 0 15 1.8a13.4 13.4 0 00-6 0C6.2 0 4.8.5 4.8.5A5 5 0 004.7 4 5.4 5.4 0 003.3 7.5c0 5.4 3.4 7 6.7 7A4.8 4.8 0 009 18v4" />
                  <path d="M9 18c-4.5 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
        <div>© {new Date().getFullYear()} Nestro. All rights reserved.</div>

        <div className="flex space-x-4">
          <Link
            href="/"
            className="hover:text-[#FFFFFF80] transition"
          >
            Privacy
          </Link>

          <span>·</span>

          <Link
            href="/"
            className="hover:text-[#FFFFFF80] transition"
          >
            Terms
          </Link>

          <span>·</span>

          <Link
            href="/"
            className="hover:text-[#FFFFFF80] transition"
          >
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}