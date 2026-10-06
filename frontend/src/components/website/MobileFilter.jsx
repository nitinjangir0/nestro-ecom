"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import FilterSection from "./FilterSection";
import PriceFilter from "./PriceFilter";

export default function MobileFilter({ rooms, categories }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-[#e6ddd4] bg-white px-4 py-2 text-[12px] font-medium text-[#374151] transition hover:bg-[#f8f5f1] md:hidden"
            >
                <SlidersHorizontal size={15} />
                Filters
            </button>

            {/* Mobile Filter Drawer */}
            {open && (
                <div className="fixed inset-0 z-[99999] md:hidden">

                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-[380px] flex-col bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-[#e8e1db] bg-white px-5 py-4">
                            <h2 className="text-lg font-semibold text-[#3b3028]">
                                Filters
                            </h2>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close filters"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6ddd4] text-gray-600 transition hover:bg-[#f8f5f1]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="min-h-0 flex-1 overflow-y-auto p-5">

                            <div className="space-y-8">

                                <FilterSection
                                    title="Room Type"
                                    data={rooms}
                                    queryKey="roomtype"
                                />

                                <FilterSection
                                    title="Category"
                                    data={categories}
                                    queryKey="category"
                                />

                                <PriceFilter />

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}