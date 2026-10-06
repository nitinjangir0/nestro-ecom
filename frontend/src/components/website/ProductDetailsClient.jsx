
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronRight, Check, Minus, Plus, ShieldCheck, Star, Truck, RotateCcw, Zap, } from "lucide-react";

import CartButton from "./CartButton";
import { addToCart } from "@/redux/features/cartSlice";
import { useDispatch } from "react-redux";
import { client } from "@/utils/helper";
import WishlistButton from "./WishlistButton";

function removeHtmlTags(value = "") {
    return String(value)
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export default function ProductDetailsClient({ product, user }) {
    const router = useRouter();
    const dispatcher = useDispatch();

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const images = useMemo(() => {
        const productImages = Array.isArray(product?.images)
            ? product.images.filter(Boolean)
            : [];

        const allImages = [
            product?.thumbnail,
            ...productImages,
        ].filter(Boolean);

        return [...new Set(allImages)];
    }, [product]);

    const currentImage =
        images[selectedImage] ||
        images[0] ||
        "/images/product-placeholder.png";

    const originalPrice = Number(product?.originalPrice || 0);

    const salePrice = Number(
        product?.salePrice || product?.price || 0
    );

    const stock = Number(product?.stock || 0);

    const isOutOfStock = stock <= 0;

    const discount =
        originalPrice > salePrice && originalPrice > 0
            ? Math.round(
                ((originalPrice - salePrice) / originalPrice) * 100
            )
            : 0;

    const description =
        removeHtmlTags(product?.description) ||
        "Premium quality furniture designed to make your space more comfortable and stylish.";

    const productForCart = {
        ...product,
        salePrice,
        originalPrice,
        discount,
        thumbnail: product?.thumbnail || currentImage,
    };

    const increaseQuantity = () => {
        if (!isOutOfStock && quantity < stock) {
            setQuantity((previous) => previous + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((previous) => previous - 1);
        }
    };

    const previousImage = () => {
        setSelectedImage((previous) =>
            previous === 0 ? images.length - 1 : previous - 1
        );
    };

    const nextImage = () => {
        setSelectedImage((previous) =>
            previous === images.length - 1 ? 0 : previous + 1
        );
    };

    const handleBuyNow = async () => {
        if (isOutOfStock) {
            toast.error("This product is currently out of stock.");
            return;
        }

        const cartProduct = {
            id: product._id,
            name: product.name,
            salePrice,
            originalPrice,
            discount,
            thumbnail: product.thumbnail || currentImage,
            qty: quantity,
        };

        try {
            // Guest user
            if (!user) {
                dispatcher(addToCart(cartProduct));

                toast.success("Product added to cart");

                router.push("/checkout");
                return;
            }

            // Logged-in user
            const response = await client.post(
                "cart/add-to-cart",
                {
                    productId: product._id,
                    qty: quantity,
                }
            );

            if (!response.data.success) {
                toast.error(
                    response.data.message || "Please add to cart"
                );
                return;
            }

            // Redux + localStorage update
            dispatcher(addToCart(cartProduct));

            toast.success("Product added to cart");

            router.push("/checkout");

        } catch (error) {
            console.error("Buy Now Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Please add to cart"
            );
        }
    };
    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <Link
                    href="/"
                    className="transition-colors hover:text-[#788864]"
                >
                    Home
                </Link>
                <ChevronRight size={13} />
                <Link
                    href="/store"
                    className="transition-colors hover:text-[#788864]"
                >
                    Store
                </Link>
                <ChevronRight size={13} />
                <span className="max-w-[250px] truncate text-gray-700">
                    {product?.name}
                </span>
            </div>
            {/* Main Compact Layout */}
            <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">

                {/* LEFT PRODUCT CARD */}

                <div className="rounded-2xl bg-white p-2 shadow-sm">
                    {/* Product Card */}
                    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">

                        {/* Image + Action Buttons Container */}
                        <div className="relative">

                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-t-2xl bg-[#f8f7f4]">

                                {/* Best Seller Badge */}
                                {product.bestSeller && (
                                    <div className="absolute left-4 top-4 z-10">
                                        <span className="inline-block rounded-full bg-[#788864] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-sm">
                                            Best Seller
                                        </span>
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {product.originalPrice > product.salePrice && (
                                    <div className="absolute left-4 top-12 z-10 mt-1">
                                        <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm">
                                            {Math.round(
                                                ((product.originalPrice - product.salePrice) /
                                                    product.originalPrice) *
                                                100
                                            )}
                                            % OFF
                                        </span>
                                    </div>
                                )}

                                {/* Product Image */}
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="h-[270px] w-full object-contain p-4 transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                            </div>

                            {/* Action Buttons (Wishlist & Cart stacked cleanly) */}
                            <div className="absolute right-4 top-4 z-20 flex flex-col gap-2.5">
                                <div className="rounded-full bg-white/80 p-1 backdrop-blur-md shadow-sm transition-transform hover:scale-105">
                                    <WishlistButton productId={product._id} />
                                </div>
                                <div className="rounded-full bg-white/80 p-1 backdrop-blur-md shadow-sm transition-transform hover:scale-105">
                                    <CartButton product={product} user={user} />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Product Name and Price */}
                    <div className="mt-2">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                            {product.categoryId?.name || "Furniture"}
                        </p>

                        <h2 className="mt-1 line-clamp-2 text-base font-semibold text-gray-800">
                            {product.name}
                        </h2>

                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xl font-bold text-[#788864]">
                                ₹{product.salePrice}
                            </span>

                            {product.originalPrice > product.salePrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{product.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Secure Benefits - Single Line */}
                    <div className="mt-1 flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
                        <div className="flex min-w-0 items-center gap-1.5">
                            <Truck
                                className="shrink-0 text-[#788864]"
                                size={15}
                            />
                            <span className="truncate text-[10px] text-gray-500">
                                Fast Delivery
                            </span>
                        </div>
                        <div className="flex min-w-0 items-center gap-1.5">
                            <ShieldCheck
                                className="shrink-0 text-[#788864]"
                                size={15}
                            />
                            <span className="truncate text-[10px] text-gray-500">
                                Secure Payment
                            </span>
                        </div>
                        <div className="flex min-w-0 items-center gap-1.5">
                            <RotateCcw
                                className="shrink-0 text-[#788864]"
                                size={15}
                            />

                            <span className="truncate text-[10px] text-gray-500">
                                Easy Returns
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Product Details */}

                <div className="min-w-0 lg:col-span-2">
                    <div className="rounded-xl  bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#788864]">
                            {product?.categoryId?.name ||
                                product?.category?.name ||
                                "Furniture"}
                        </p>

                        <h1 className="mt-2 text-2xl font-bold leading-tight text-[#292b27] sm:text-3xl">
                            {product?.name}
                        </h1>

                        <div className="mt-3 flex items-center gap-2">
                            <span className="flex items-center gap-1 rounded-md bg-[#788864] px-4 py-1 text-xs font-bold text-white">
                                4.8
                                <Star
                                    size={12}
                                    fill="currentColor"
                                />
                            </span>

                            <span className="text-xs text-gray-500">
                                Premium quality furniture
                            </span>
                        </div>

                        <div className="my-3 h-px bg-[#eee9e2]" />

                        <h3 className="mb-2 text-sm font-bold text-gray-800">
                            Product Description
                        </h3>

                        <p className="text-sm leading-6 text-gray-600">
                            {description}
                        </p>

                        <div className="my-4 h-px bg-[#eee9e2]" />

                        {/* Price Details */}

                        {/* PRODUCT PRICE */}

                        <div className="flex flex-wrap items-end gap-3">
                            {/* Actual Sale Price */}
                            <span className="text-3xl font-bold text-[#788864]">
                                ₹{Number(product.salePrice || 0).toLocaleString("en-IN")}
                            </span>

                            {/* Original Price + Saving */}
                            {Number(product.originalPrice || 0) >
                                Number(product.salePrice || 0) && (
                                    <>
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                                        </span>

                                        <span className="text-xs font-bold text-red-500">
                                            Save ₹
                                            {(
                                                Number(product.originalPrice) -
                                                Number(product.salePrice)
                                            ).toLocaleString("en-IN")}
                                        </span>
                                    </>
                                )}
                        </div>

                        {/* Stock */}
                        <div className="mt-3">
                            {isOutOfStock ? (
                                <span className="text-sm font-semibold text-red-500">
                                    Currently unavailable
                                </span>
                            ) : stock <= 5 ? (
                                <span className="text-sm font-semibold text-orange-600">
                                    Only {stock} items left in stock
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-sm font-semibold text-[#788864]">
                                    <Check size={16} />
                                    In stock and ready to ship
                                </span>
                            )}
                        </div>

                        <div className="my-5 h-px bg-[#eee9e2]" />

                        {/* Quantity and Buy Now */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="mb-2 text-sm font-semibold text-gray-800">
                                    Quantity
                                </p>

                                <div className="flex items-center rounded-lg border border-[#dcd6cd]">
                                    <button
                                        type="button"
                                        onClick={decreaseQuantity}
                                        disabled={
                                            quantity <= 1 ||
                                            isOutOfStock
                                        }
                                        className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-[#f5f3ef] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Minus size={15} />
                                    </button>

                                    <span className="flex h-10 min-w-11 items-center justify-center border-x border-[#dcd6cd] text-sm font-semibold text-gray-800">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={increaseQuantity}
                                        disabled={
                                            quantity >= stock ||
                                            isOutOfStock
                                        }
                                        className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-[#f5f3ef] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Plus size={15} />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={isOutOfStock}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#788864] px-4 text-sm font-bold text-white transition hover:bg-[#657451] disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-[190px]"
                            >
                                <Zap size={17} />
                                Buy Now
                            </button>
                        </div>

                        {/* Delivery Box */}
                        <div className="mt-3 rounded-lg bg-[#f8f7f4] p-3">
                            <div className="flex items-start gap-3">
                                <Truck
                                    size={20}
                                    className="mt-0.5 shrink-0 text-[#788864]"
                                />

                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">
                                        Delivery Information
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Enter your address during checkout
                                        to check delivery availability and
                                        estimated delivery time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Specifications */}
                    <div className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-bold text-[#292b27]">
                            Product Details
                        </h2>

                        <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <div className="flex justify-between gap-4 border-b border-[#eee9e2] pb-3">
                                <span className="text-gray-500">
                                    Product Name
                                </span>

                                <span className="text-right font-medium text-gray-800">
                                    {product?.name || "N/A"}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4 border-b border-[#eee9e2] pb-3">
                                <span className="text-gray-500">
                                    Category
                                </span>

                                <span className="text-right font-medium text-gray-800">
                                    {product?.categoryId?.name ||
                                        product?.category?.name ||
                                        "Furniture"}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4 border-b border-[#eee9e2] pb-3">
                                <span className="text-gray-500">
                                    Availability
                                </span>

                                <span className="text-right font-medium text-gray-800">
                                    {isOutOfStock
                                        ? "Out of stock"
                                        : "In stock"}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4 border-b border-[#eee9e2] pb-3">
                                <span className="text-gray-500">
                                    Product Status
                                </span>

                                <span className="text-right font-medium text-gray-800">
                                    {product?.status
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}