"use client";

import React from "react";
import {Search,Bell,ChevronDown,Menu,} from "lucide-react";


export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between border-b border-slate-100 bg-white px-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:px-7">
      {/* LEFT */}

      <div className="flex items-center gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-[15px] font-bold text-slate-800 sm:text-base">
            Admin Dashboard
          </h2>

          <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">
            Manage your Nestro store
          </p>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-2 sm:gap-4">
        {/* SEARCH */}

        <div className="relative hidden w-[220px] md:block lg:w-[280px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search here..."
            className="h-10 w-full rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-4 text-xs text-slate-600 outline-none transition placeholder:text-slate-400 focus:border-[#C9D3F7] focus:bg-white focus:ring-4 focus:ring-[#304CB2]/5"
          />
        </div>

        {/* NOTIFICATION */}

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-[#304CB2]">
          <Bell className="h-[19px] w-[19px]" />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* PROFILE */}

        <button className="flex items-center gap-2 border-l border-slate-100 pl-3 sm:gap-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#304CB2] text-xs font-bold text-white ring-4 ring-[#EEF2FF]">
            A
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-bold text-slate-700">
              Admin
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Administrator
            </p>
          </div>

          <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}