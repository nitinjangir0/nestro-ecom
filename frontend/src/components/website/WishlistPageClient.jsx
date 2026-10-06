"use client";

import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

import {
    getWishlist,
    removeFromWishlist,
} from "@/utils/api";

import ProductCard from "@/components/website/ProductCard";

export default function WishlistPageClient({ user }) {

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);


    // =====================================
    // FETCH WISHLIST
    // =====================================

    const fetchWishlist = async () => {

        try {

            const result = await getWishlist();

            if (result.success) {

                setWishlist(
                    result.wishlist || []
                );

            } else {

                toast.error(
                    result.message ||
                    "Failed to load wishlist"
                );

            }

        } catch (error) {

            console.error(
                "Wishlist Fetch Error:",
                error
            );

            toast.error(
                "Failed to load wishlist"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // INITIAL LOAD
    // =====================================

    useEffect(() => {

        fetchWishlist();

    }, []);


    // =====================================
    // REMOVE FROM WISHLIST
    // =====================================

    const handleRemove = async (productId) => {

        try {

            const result =
                await removeFromWishlist(productId);


            if (result.success) {

                // IMPORTANT
                // API success ke baad
                // turant local state update

                setWishlist((prevWishlist) =>
                    prevWishlist.filter(
                        (product) =>
                            product._id !== productId
                    )
                );

                toast.info(
                    "Removed from wishlist"
                );

            } else {

                toast.error(
                    result.message ||
                    "Failed to remove product"
                );

            }

        } catch (error) {

            console.error(
                "Remove Wishlist Error:",
                error
            );

            toast.error(
                "Something went wrong"
            );

        }
    };


    // =====================================
    // LOADING UI
    // =====================================

    if (loading) {

        return (
            <div className="min-h-screen bg-[#FAF8F6]">

                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

                    <div className="mb-8">

                        <div className="mb-2 h-3 w-28 animate-pulse rounded bg-gray-200" />

                        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

                        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />

                    </div>


                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">

                        {Array.from({
                            length: 8,
                        }).map((_, index) => (

                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                            >

                                <div className="h-[300px] animate-pulse bg-gray-200" />

                                <div className="space-y-3 p-5">

                                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

                                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                                    <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        );
    }


    // =====================================
    // EMPTY WISHLIST
    // =====================================

    if (wishlist.length === 0) {

        return (
            <div className="min-h-screen bg-[#FAF8F6]">

                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

                    {/* Header */}

                    <div className="mb-8">

                        <div className="mb-2 flex items-center gap-2">

                            <span className="h-[2px] w-7 bg-[#788864]" />

                            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#788864]">
                                Your Favorites
                            </span>

                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-[#2d2d2d] md:text-3xl">
                            My Wishlist
                        </h1>

                    </div>


                    {/* Empty Card */}

                    <div className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 text-center shadow-sm">

                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">

                            <FaHeart
                                size={28}
                                className="text-red-400"
                            />

                        </div>


                        <h2 className="text-xl font-semibold text-[#2d2d2d]">
                            Your wishlist is empty
                        </h2>


                        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Looks like you haven't saved anything yet.
                            Browse our products and add your favorites
                            to your wishlist.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================
    // WISHLIST UI
    // =====================================

    return (
        <div className="min-h-screen bg-[#FAF8F6]">

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="mb-8 flex items-end justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-2">

                            <span className="h-[2px] w-7 bg-[#788864]" />

                            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#788864]">
                                Your Favorites
                            </span>

                        </div>


                        <h1 className="text-2xl font-semibold tracking-tight text-[#2d2d2d] md:text-3xl">
                            My Wishlist
                        </h1>


                        <p className="mt-1 text-sm text-gray-500">
                            Save your favorite products and shop them
                            whenever you want.
                        </p>

                    </div>


                    {/* Count */}

                    <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm sm:flex">

                        <FaHeart
                            size={13}
                            className="text-red-500"
                        />

                        <span className="text-sm font-medium text-gray-700">
                            {wishlist.length}{" "}
                            {wishlist.length === 1
                                ? "Item"
                                : "Items"}
                        </span>

                    </div>

                </div>


                {/* ================================= */}
                {/* PRODUCT GRID */}
                {/* ================================= */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">

                    {wishlist.map((product) => (

                        <ProductCard
                            key={product._id}
                            product={product}
                            user={user}
                            onWishlistRemove={handleRemove}
                        />

                    ))}

                </div>

            </div>

        </div>
    );
}