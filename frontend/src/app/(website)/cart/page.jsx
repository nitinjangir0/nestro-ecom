"use client";

import {
    removeFromcart,
    increaseQuantity,
    decreaseQuantity,
} from "@/redux/features/cartSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { client } from "@/utils/helper";

export default function CartPage() {
    const cart = useSelector((store) => store.cart);
    const dispatcher = useDispatch();
    const router = useRouter();

    const [checkoutLoading, setCheckoutLoading] = useState(false);

    async function handleCheckout() {
        if (!cart?.items?.length) {
            return;
        }

        try {
            setCheckoutLoading(true);

            // Check whether user is logged in
            await client.get("user/profile");

            // User is logged in
            router.push("/checkout");
        } catch (error) {
            // User is not logged in
            if (typeof window !== "undefined") {
                sessionStorage.setItem(
                    "loginRedirect",
                    "/checkout"
                );
            }

            router.push("/login");
        } finally {
            setCheckoutLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-3 sm:px-5">

                <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-8">
                    Shopping Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-5">

                        {cart?.items?.length > 0 ? (
                            cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="
                                        bg-white
                                        rounded-xl
                                        shadow
                                        p-3
                                        sm:p-5
                                        flex
                                        gap-3
                                        sm:gap-5
                                        min-w-0
                                    "
                                >

                                    {/* Product Image */}
                                    <img
                                        src={item.thumbnail}
                                        alt={item.name}
                                        className="
                                            w-24
                                            h-24
                                            sm:w-32
                                            sm:h-32
                                            object-cover
                                            rounded-lg
                                            shrink-0
                                        "
                                    />

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">

                                        <h2
                                            className="
                                                text-base
                                                sm:text-xl
                                                font-semibold
                                                break-words
                                            "
                                        >
                                            {item.name}
                                        </h2>

                                        <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">
                                            Premium quality product
                                        </p>

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                sm:flex-row
                                                sm:justify-between
                                                sm:items-center
                                                gap-3
                                                sm:gap-0
                                                mt-3
                                                sm:mt-5
                                            "
                                        >

                                            {/* Quantity */}
                                            <div className="flex items-center gap-3">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatcher(
                                                            decreaseQuantity({
                                                                id: item.id,
                                                            })
                                                        )
                                                    }
                                                    className="
                                                        border
                                                        w-8
                                                        h-8
                                                        sm:w-auto
                                                        sm:h-auto
                                                        sm:px-3
                                                        sm:py-1
                                                        rounded
                                                        cursor-pointer
                                                        hover:bg-gray-100
                                                        flex
                                                        items-center
                                                        justify-center
                                                    "
                                                >
                                                    -
                                                </button>

                                                <span className="min-w-5 text-center">
                                                    {item.qty}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatcher(
                                                            increaseQuantity({
                                                                id: item.id,
                                                            })
                                                        )
                                                    }
                                                    className="
                                                        border
                                                        w-8
                                                        h-8
                                                        sm:w-auto
                                                        sm:h-auto
                                                        sm:px-3
                                                        sm:py-1
                                                        rounded
                                                        cursor-pointer
                                                        hover:bg-gray-100
                                                        flex
                                                        items-center
                                                        justify-center
                                                    "
                                                >
                                                    +
                                                </button>

                                            </div>

                                            {/* Price */}
                                            <h3 className="text-base sm:text-xl font-bold">
                                                ₹
                                                {Number(
                                                    item.salePrice
                                                ).toLocaleString("en-IN")}
                                            </h3>

                                        </div>

                                    </div>

                                    {/* Remove */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatcher(
                                                removeFromcart({
                                                    id: item.id,
                                                })
                                            )
                                        }
                                        className="
                                            text-red-500
                                            font-medium
                                            cursor-pointer
                                            h-fit
                                            text-xs
                                            sm:text-base
                                            shrink-0
                                        "
                                    >
                                        Remove
                                    </button>

                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow p-8 sm:p-10 text-center">
                                <h2 className="text-lg sm:text-xl font-semibold">
                                    Your cart is empty
                                </h2>

                                <p className="text-gray-500 text-sm sm:text-base mt-2">
                                    Add some products to continue.
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Order Summary */}
                    <div
                        className="
                            bg-white
                            shadow
                            rounded-xl
                            p-4
                            sm:p-6
                            h-fit
                            lg:sticky
                            lg:top-5
                        "
                    >

                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                            Order Summary
                        </h2>

                        <div className="space-y-3 sm:space-y-4 text-gray-600">

                            {/* Subtotal */}
                            <div className="flex justify-between items-center gap-4">
                                <span>
                                    Subtotal
                                </span>

                                <span className="text-right">
                                    ₹{" "}
                                    {Number(
                                        cart.original_total
                                    ).toLocaleString("en-IN")}
                                </span>
                            </div>

                            {/* Saving */}
                            <div className="flex justify-between items-center gap-4">
                                <span>
                                    Saving
                                </span>

                                <span className="text-right">
                                    ₹{" "}
                                    {Number(
                                        cart.original_total -
                                        cart.final_total
                                    ).toLocaleString("en-IN")}
                                </span>
                            </div>

                            {/* Total */}
                            <div className="border-t pt-4 flex justify-between items-center gap-4 text-black">
                                <span className="font-bold">
                                    Total
                                </span>

                                <span className="font-bold text-lg sm:text-xl">
                                    ₹{" "}
                                    {Number(
                                        cart.final_total
                                    ).toLocaleString("en-IN")}
                                </span>
                            </div>

                        </div>

                        {/* Checkout */}
                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={
                                checkoutLoading ||
                                !cart?.items?.length
                            }
                            className={`
                                mt-5
                                sm:mt-6
                                w-full
                                py-3
                                rounded-lg
                                transition
                                text-sm
                                sm:text-base
                                ${
                                    cart?.items?.length &&
                                    !checkoutLoading
                                        ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }
                            `}
                        >
                            {checkoutLoading
                                ? "Checking..."
                                : "Checkout"}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
} 