"use client";

import { addToCart } from "@/redux/features/cartSlice";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { client } from "@/utils/helper";
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
            // Backend cart mein add karo
            const response = await client.post(
                "cart/add-to-cart",
                {
                    productId: product._id,
                    qty: 1,
                }
            );

            if (!response.data.success) {
                toast.error(
                    response.data.message || "Unable to add product"
                );

                return;
            }

            // Redux + localStorage update
            dispatcher(addToCart(cartProduct));

            toast.success("Product added to cart");

        } catch (error) {
            console.error("Add to Cart Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to add product to cart"
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