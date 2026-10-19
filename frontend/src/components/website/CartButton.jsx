"use client";

import { addToCart } from "@/redux/features/cartSlice";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function CartButton({ product, user }) {
    const dispatcher = useDispatch();

    async function cartHandler() {

        const cartProduct = {
            id: product._id,
            name: product.name,
            salePrice: product.salePrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            thumbnail: product.thumbnail,
            qty: 1,
        };

        try {

            // Guest user
            // Sirf Redux + localStorage
            if (!user) {
                dispatcher(addToCart(cartProduct));

                toast.success("Product added to cart");

                return;
            }

            // Logged-in user
            const response = await fetch("/api/cart/add-to-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
                cache: "no-store",
                body: JSON.stringify({
                    productId: product._id,
                    qty: 1,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to add product");
            }

            // Redux + localStorage update
            dispatcher(addToCart(cartProduct));

            toast.success("Product added to cart");

        }  catch (error) {
            console.error("Add to Cart Error:", error);

            toast.error(
                error.message || "Unable to add product to cart"
            );
        }
    }

    return (
        <>
            {product.stock ? (
                <button
                    type="button"
                    onClick={cartHandler}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2d2d2d] text-white transition-all duration-300 hover:scale-110 hover:bg-black"
                >
                    <FaPlus size={12} />
                </button>
            ) : (
                <span className="rounded-full bg-red-50 px-3 py-2 text-sm font-medium text-red-500">
                    Out of Stock
                </span>
            )}
        </>
    );
}