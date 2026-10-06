"use client";

import { FaEye } from "react-icons/fa";
import Link from "next/link";
import CartButton from "./CartButton";
import WishlistButton from "./WishlistButton";

export default function ProductCard({
    product,
    user,
    onWishlistRemove,
}) {

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl">

            {/* ================================= */}
            {/* IMAGE */}
            {/* ================================= */}

            <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-[#f8f7f4]">

                {/* Best Seller */}

                {product.bestSeller && (
                    <div className="absolute left-4 top-6 z-10">

                        <span className="rounded-full bg-[#788864] px-3 py-1 text-[10px] font-bold text-white">
                            Best Seller
                        </span>

                    </div>
                )}


                {/* Discount */}

                {product.originalPrice > product.salePrice && (
                    <div className="absolute bottom-2 left-4 z-10">

                        <span className="rounded-full bg-red-500 px-2 py-1 text-[9px] font-bold text-white">

                            -
                            {Math.round(
                                (
                                    (product.originalPrice -
                                        product.salePrice) /
                                    product.originalPrice
                                ) * 100
                            )}
                            % OFF

                        </span>

                    </div>
                )}


                {/* Product Image */}

                <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />


                {/* ================================= */}
                {/* FLOATING BUTTONS */}
                {/* ================================= */}

                <div className="absolute right-4 top-4 flex translate-x-10 flex-col gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 max-sm:translate-x-0 max-sm:opacity-100">

                    {/* Wishlist */}

                    <WishlistButton
                        productId={product._id}
                        onRemove={onWishlistRemove}
                    />


                    {/* View */}

                    <Link
                        href={`/product/${product.slug}`}
                        aria-label={`View ${product.name} details`}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-all hover:bg-[#788864] hover:text-white"
                    >
                        <FaEye size={16} />
                    </Link>

                </div>


                {/* ================================= */}
                {/* CART */}
                {/* ================================= */}

                <div className="absolute bottom-2 right-4">

                    <CartButton
                        product={product}
                        user={user}
                    />

                </div>

            </div>


            {/* ================================= */}
            {/* PRODUCT CONTENT */}
            {/* ================================= */}

            <div className="p-5">

                {/* Category */}

                <p className="text-xs uppercase text-gray-400">
                    {product.categoryId?.name}
                </p>


                {/* Name */}

                <h3 className="truncate text-lg font-semibold text-gray-800">
                    {product.name}
                </h3>


                {/* Price */}

                <div className="mt-3 flex justify-between">

                    <div>

                        <p className="text-xl font-bold text-[#788864]">
                            ₹{product.salePrice}
                        </p>


                        {product.originalPrice >
                            product.salePrice && (
                                <p className="text-xs text-gray-400 line-through">
                                    ₹{product.originalPrice}
                                </p>
                            )}

                    </div>

                </div>

            </div>

        </div>
    );
}