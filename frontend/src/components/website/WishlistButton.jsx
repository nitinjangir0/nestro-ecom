"use client";

import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

import {
    addToWishlist,
    removeFromWishlist,
    checkWishlist,
} from "@/utils/api";

export default function WishlistButton({
    productId,
    onRemove,
}) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);

    // =====================================
    // CHECK WISHLIST STATUS
    // =====================================

    useEffect(() => {
        const checkStatus = async () => {
            if (!productId) return;

            const result = await checkWishlist(productId);

            if (result.success) {
                setIsWishlisted(result.isWishlisted);
            }
        };

        checkStatus();
    }, [productId]);


    // =====================================
    // WISHLIST HANDLER
    // =====================================

    const handleWishlist = async () => {
        if (loading || !productId) return;

        setLoading(true);

        try {

            // =================================
            // ADD
            // =================================

            if (!isWishlisted) {

                const result = await addToWishlist(productId);

                if (result.success) {

                    setIsWishlisted(true);

                    toast.success(
                        result.message || "Added to wishlist"
                    );

                } else {

                    toast.error(
                        result.message ||
                        "Failed to add to wishlist"
                    );

                }

                return;
            }


            // =================================
            // REMOVE
            // =================================

            const result = await removeFromWishlist(productId);

            if (result.success) {
    setIsWishlisted(false);

    if (onRemove) {
        onRemove(productId);
    }
            } else {
                toast.error(
                    result.message ||
                    "Failed to remove from wishlist"
                );
            }
        } catch (error) {
            console.error(
                "Wishlist Error:",
                error
            );
            toast.error(
                error?.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            type="button"
            onClick={handleWishlist}
            disabled={loading}
            aria-label={
                isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
            }
            className={`
                flex h-10 w-10 items-center justify-center
                rounded-full shadow-md
                transition-all duration-300
                ${
                    isWishlisted
                        ? "bg-white text-red-500"
                        : "bg-red-500 text-white hover:bg-white hover:text-gray-700"
                }
                ${
                    loading
                        ? "cursor-not-allowed opacity-60"
                        : "hover:scale-105"
                }
            `}>
            <FaHeart
                size={16}
                className={
                    loading
                        ? "animate-pulse"
                        : ""
                }
            />
        </button>
    );
}