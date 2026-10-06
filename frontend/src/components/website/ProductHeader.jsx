"use client";

import { useRouter, useSearchParams } from "next/navigation";
import MobileFilter from "./MobileFilter";

export default function ProductHeader({ rooms, categories, total }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ==============================
    // Sort Products
    // ==============================
    function applyFilter(value) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.set("sort", value);
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    }

    // ==============================
    // Remove Selected Filter
    // ==============================
    function removeFilter(queryKey, slug) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        const values = params.get(queryKey)
            ? params.get(queryKey).split(",")
            : [];

        const updatedValues = values.filter(
            (item) => item !== slug
        );

        if (updatedValues.length > 0) {
            params.set(
                queryKey,
                updatedValues.join(",")
            );
        } else {
            params.delete(queryKey);
        }

        params.set("page", "1");

        router.push(`?${params.toString()}`);
    }

    // ==============================
    // Selected Room Filters
    // ==============================
    const roomtypeSlugs =
        searchParams.get("roomtype")?.split(",") || [];

    // ==============================
    // Selected Category Filters
    // ==============================
    const categorySlugs =
        searchParams.get("category")?.split(",") || [];

    const selectedRooms = rooms.filter((room) =>
        roomtypeSlugs.includes(room.slug)
    );

    const selectedCategories = categories.filter(
        (category) =>
            categorySlugs.includes(category.slug)
    );

    return (
        <div
            className="
                mb-8
                flex
                items-center
                justify-between
                rounded-3xl
                border
                border-[#e6ddd4]
                bg-white
                px-6
                py-2

                max-md:flex-col
                max-md:items-start
                max-md:gap-4
            "
        >
            {/* ================================= */}
            {/* PRODUCT COUNT */}
            {/* ================================= */}

            <h2 className="text-[18px] font-semibold text-black">
                {total}

                <span className="ml-2 text-[18px] font-normal text-[#6b7280]">
                    products found
                </span>
            </h2>

            {/* ================================= */}
            {/* RIGHT SIDE */}
            {/* ================================= */}

            <div
                className="
                    flex
                    items-center
                    gap-4

                    max-md:w-full
                    max-md:flex-wrap
                "
            >
                {/* ================================= */}
                {/* MOBILE FILTER */}
                {/* ONLY BELOW 768px */}
                {/* ================================= */}

                <div className="hidden max-[767px]:block">
                    <MobileFilter
                        rooms={rooms}
                        categories={categories}
                    />
                </div>

                {/* ================================= */}
                {/* SELECTED ROOM FILTERS */}
                {/* ================================= */}

                {selectedRooms.map((room) => (
                    <div
                        key={room._id}
                        onClick={() =>
                            removeFilter(
                                "roomtype",
                                room.slug
                            )
                        }
                        className="
                            cursor-pointer
                            rounded-full
                            bg-[#f6f1eb]
                            px-4
                            py-2
                            text-[12px]
                            text-[#94663f]
                        "
                    >
                        {room.name} ×
                    </div>
                ))}

                {/* ================================= */}
                {/* SELECTED CATEGORY FILTERS */}
                {/* ================================= */}

                {selectedCategories.map((category) => (
                    <div
                        key={category._id}
                        onClick={() =>
                            removeFilter(
                                "category",
                                category.slug
                            )
                        }
                        className="
                            cursor-pointer
                            rounded-full
                            bg-[#f6f1eb]
                            px-4
                            py-2
                            text-[12px]
                            text-[#94663f]
                        "
                    >
                        {category.name} ×
                    </div>
                ))}

                {/* ================================= */}
                {/* SORT */}
                {/* ================================= */}

                <select
                    value={
                        searchParams.get("sort") || "asc"
                    }
                    onChange={(e) =>
                        applyFilter(e.target.value)
                    }
                    className="
                        rounded-xl
                        border
                        border-[#e6ddd4]
                        px-5
                        py-2
                        text-[12px]
                        text-[#374151]
                        outline-none
                    "
                >
                    <option value="asc">
                        Price: Low To High
                    </option>

                    <option value="desc">
                        Price: High To Low
                    </option>

                    <option value="createdAt">
                        Newest
                    </option>
                </select>
            </div>
        </div>
    );
}