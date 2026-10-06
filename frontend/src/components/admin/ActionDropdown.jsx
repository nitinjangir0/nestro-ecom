"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import {
  HiOutlineDotsHorizontal, 
  HiOutlinePencilAlt,
} from "react-icons/hi";
import DeleteBtn from "./DeleteBtn";

export default function ActionDropdown({ id, module }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-black hover:bg-black hover:text-white ${
          open ? "bg-black text-white border-black" : ""
        }`}
      >
        Actions
        <HiOutlineDotsHorizontal className="text-base" />
      </button>

      {/* DROPDOWN */}
      <div
        className={`absolute right-0 top-12 z-50 w-48 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.10)] transition-all duration-200 ${
          open
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0"
        }`}>

        {/* EDIT */}
      <Link href={`/admin/${module}/edit/${id}`}>
          <button className="flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <HiOutlinePencilAlt className="text-sm" />
            </div>
            Edit
          </button>
        </Link>

        <div className="mx-4 h-px bg-gray-100" />

        <div className="mx-4 h-px bg-gray-100" />

<button
  onClick={() => {
    window.dispatchEvent(
      new CustomEvent("open-product-details", {
        detail: { id }
      })
    );
    setOpen(false);
  }}
  className="flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 text-left"
>
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
    👁️
  </div>
  View Details
</button>

<div className="mx-4 h-px bg-gray-100" />

        {/* DELETE */}
        <DeleteBtn path={`${module}/delete/${id}`} />
      </div>
    </div>
  );
}