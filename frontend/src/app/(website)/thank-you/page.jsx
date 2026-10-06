"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    Package,
    ShoppingBag,
    ArrowRight,
    Truck,
    CreditCard,
    CircleCheck,
} from "lucide-react";
import { client } from "@/utils/helper";

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [order, setOrder] = useState(null);
    const [orderError, setOrderError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setOrderError("Order ID not found");
                setIsLoading(false);
                return;
            }

            try {
                const response = await client.get(`order/${orderId}`);

                if (response.data?.success) {
                    setOrder(response.data.order);
                } else {
                    setOrderError(
                        response.data?.message || "Unable to fetch order"
                    );
                }
            } catch (error) {
                console.error("Thank You Order Fetch Error:", error);

                setOrderError(
                    error?.response?.data?.message ||
                    "Unable to fetch order details"
                );
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);

                setTimeout(() => {
                    setShowSuccess(true);
                }, 1050);
            }
        };

        fetchOrder();
    }, [orderId]);

    const paymentMethod =
        order?.paymentMethod === "online"
            ? "Online Payment"
            : order?.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "N/A";

    const paymentStatus =
        order?.paymentStatus === "paid"
            ? "Paid"
            : order?.paymentStatus === "pending"
                ? "Pending"
                : order?.paymentStatus === "failed"
                    ? "Failed"
                    : "N/A";

    const orderStatus =
        order?.orderStatus
            ? order.orderStatus.charAt(0).toUpperCase() +
            order.orderStatus.slice(1)
            : "Order Placed";

    return (
        <main className="min-h-screen bg-stone-50 px-4 py-10 md:py-16">

            {/* =====================================================
                LOADING SCREEN
            ===================================================== */}
            {isLoading && (
                <div className="fixed inset-0 z-[100] bg-stone-50 flex items-center justify-center">
                    <div className="text-center">
                        <div
                            className="loader-wrapper"
                            style={{
                                width: "96px",
                                height: "96px",
                                margin: "0 auto",
                                position: "relative",
                            }}
                        >
                            <div className="loader-ring" />

                            <div
                                style={{
                                    position: "absolute",
                                    inset: "0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "50%",
                                        background: "#78350f",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        animation:
                                            "loaderPulse 1.2s ease-in-out infinite",
                                    }}
                                >
                                    <Package size={22} color="white" />
                                </div>
                            </div>
                        </div>

                        <h2 className="mt-7 text-lg font-semibold text-amber-950">
                            Processing your order
                        </h2>

                        <p className="mt-2 text-sm text-stone-500">
                            Please wait a moment...
                        </p>

                        <div className="flex justify-center gap-1.5 mt-5">
                            <span className="loading-dot" />
                            <span
                                className="loading-dot"
                                style={{ animationDelay: "150ms" }}
                            />
                            <span
                                className="loading-dot"
                                style={{ animationDelay: "300ms" }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}
            <div
                className={`max-w-2xl mx-auto transition-all duration-700 ${showSuccess
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
            >
                {/* SUCCESS AREA */}
                <section className="text-center">
                    <div
                        className={`success-wrapper ${showSuccess ? "success-visible" : ""
                            }`}
                    >
                        <div className="success-glow" />

                        <div className="success-outer">
                            <div className="success-green">
                                <svg
                                    className="success-check"
                                    viewBox="0 0 52 52"
                                    width="52"
                                    height="52"
                                    fill="none"
                                >
                                    <path
                                        className="check-path"
                                        d="M14 27L22 35L39 17"
                                        stroke="white"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h1
                        className={`thank-title ${showSuccess ? "thank-title-visible" : ""
                            }`}
                    >
                        Thank You!
                    </h1>

                    <p
                        className={`thank-description ${showSuccess ? "text-visible" : ""
                            }`}
                    >
                        Your order has been placed successfully.
                    </p>

                    <p
                        className={`thank-subtitle ${showSuccess ? "text-visible" : ""
                            }`}
                    >
                        We’re getting your order ready for delivery.
                    </p>
                </section>

                {/* ORDER ID */}
                <section
                    className={`mt-9 bg-white border border-stone-200 rounded-2xl shadow-sm p-5 ${showSuccess ? "animate-card-1" : "opacity-0"
                        }`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-widest text-stone-400">
                                Order ID
                            </p>

                            <p className="mt-1 text-sm md:text-base font-semibold text-stone-800 break-all">
                                #{orderId || "N/A"}
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold whitespace-nowrap">
                            <CircleCheck size={15} />
                            Order Placed
                        </div>
                    </div>
                </section>

                {/* INFORMATION CARDS */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

                    <InfoCard
                        icon={<CreditCard size={19} />}
                        title="Payment"
                        value={paymentMethod}
                    />

                    <InfoCard
                        icon={<Package size={19} />}
                        title="Status"
                        value={orderStatus}
                    />

                    <InfoCard
                        icon={<Truck size={19} />}
                        title="Delivery"
                        value="Preparing"
                    />

                </section>

                {/* ORDER DETAILS & PROGRESS */}
                <section className="mt-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">

                    {/* ORDER PROGRESS */}
                    <h3 className="font-semibold text-amber-950">
                        Order Progress
                    </h3>

                    <div className="mt-6 flex items-center justify-between">
                        <ProgressStep
                            icon={<CircleCheck size={15} />}
                            label="Placed"
                            active
                        />

                        <ProgressLine active />

                        <ProgressStep
                            icon={<Package size={15} />}
                            label="Confirmed"
                            active={
                                order?.orderStatus === "confirmed" ||
                                order?.orderStatus === "shipped" ||
                                order?.orderStatus === "delivered"
                            }
                        />

                        <ProgressLine
                            active={
                                order?.orderStatus === "confirmed" ||
                                order?.orderStatus === "shipped" ||
                                order?.orderStatus === "delivered"
                            }
                        />

                        <ProgressStep
                            icon={<Truck size={15} />}
                            label="Shipped"
                            active={
                                order?.orderStatus === "shipped" ||
                                order?.orderStatus === "delivered"
                            }
                        />

                        <ProgressLine
                            active={
                                order?.orderStatus === "shipped" ||
                                order?.orderStatus === "delivered"
                            }
                        />

                        <ProgressStep
                            icon={<CircleCheck size={15} />}
                            label="Delivered"
                            active={order?.orderStatus === "delivered"}
                        />
                    </div>

                    {/* PAYMENT INFO */}
                    <div className="mt-8 pt-6 border-t border-stone-100">
                        <h3 className="font-semibold text-stone-800">
                            Payment Information
                        </h3>

                        <div className="mt-4 bg-stone-50 rounded-xl p-4 space-y-3">

                            <div className="flex justify-between text-sm gap-4">
                                <span className="text-stone-500">
                                    Payment Method
                                </span>

                                <span className="font-medium text-stone-800 text-right">
                                    {paymentMethod}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm gap-4">
                                <span className="text-stone-500">
                                    Payment Status
                                </span>

                                <span
                                    className={`font-medium ${order?.paymentStatus === "paid"
                                            ? "text-green-700"
                                            : order?.paymentStatus === "failed"
                                                ? "text-red-700"
                                                : "text-amber-800"
                                        }`}
                                >
                                    {paymentStatus}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* DELIVERY INFO */}
                    <div className="mt-6 pt-6 border-t border-stone-100">
                        <h3 className="font-semibold text-stone-800">
                            Delivery Information
                        </h3>

                        <div className="mt-4 bg-stone-50 rounded-xl p-4">
                            <p className="text-sm text-stone-500">
                                Your order is being prepared.
                            </p>

                            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                                You will receive your furniture at your
                                selected delivery address.
                            </p>
                        </div>
                    </div>
                </section>

                {/* BUTTONS */}
                <section className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Link
                        href="/"
                        className="flex-1 py-3.5 px-5 rounded-xl bg-amber-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-amber-800 transition shadow-sm"
                    >
                        Continue Shopping
                        <ArrowRight size={18} />
                    </Link>

                    <Link
                        href="/orders"
                        className="flex-1 py-3.5 px-5 rounded-xl bg-white border border-amber-900 text-amber-900 font-semibold flex items-center justify-center gap-2 hover:bg-amber-50 transition"
                    >
                        <ShoppingBag size={18} />
                        My Orders
                    </Link>
                </section>

                <p className="text-center text-xs text-stone-400 mt-7">
                    Thank you for choosing us for your home.
                </p>
            </div>

            {/* STYLES */}
            <style jsx global>{`
                .loader-ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 3px solid #e7e5e4;
                    border-top-color: #78350f;
                    animation: loaderRotate 1s linear infinite;
                }

                @keyframes loaderRotate {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes loaderPulse {
                    0%,
                    100% {
                        transform: scale(1);
                    }

                    50% {
                        transform: scale(1.08);
                    }
                }

                .loading-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #78350f;
                    animation: loadingBounce 0.9s infinite;
                }

                @keyframes loadingBounce {
                    0%,
                    100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-6px);
                    }
                }

                .success-wrapper {
                    position: relative;
                    width: 128px;
                    height: 128px;
                    margin-left: auto;
                    margin-right: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: scale(0.4);
                    transition:
                        opacity 0.4s ease,
                        transform 0.7s cubic-bezier(.2,.8,.2,1);
                }

                .success-wrapper.success-visible {
                    opacity: 1;
                    transform: scale(1);
                }

                .success-glow {
                    position: absolute;
                    width: 128px;
                    height: 128px;
                    border-radius: 50%;
                    background: rgba(34, 197, 94, 0.12);
                    animation: successGlow 2s ease-in-out infinite;
                }

                @keyframes successGlow {
                    0%,
                    100% {
                        transform: scale(0.92);
                        opacity: 0.5;
                    }

                    50% {
                        transform: scale(1.08);
                        opacity: 1;
                    }
                }

                .success-outer {
                    position: relative;
                    width: 104px;
                    height: 104px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #bbf7d0;
                    box-shadow:
                        0 8px 25px rgba(0, 0, 0, 0.08),
                        0 0 0 8px rgba(34, 197, 94, 0.04);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: outerCirclePop 0.7s cubic-bezier(.2,.8,.2,1)
                        forwards;
                }

                @keyframes outerCirclePop {
                    0% {
                        opacity: 0;
                        transform: scale(0.5);
                    }

                    70% {
                        opacity: 1;
                        transform: scale(1.08);
                    }

                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .success-green {
                    position: relative;
                    width: 72px;
                    height: 72px;
                    min-width: 72px;
                    min-height: 72px;
                    border-radius: 50%;
                    background: #22c55e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 18px rgba(34, 197, 94, 0.28);
                    animation: greenCirclePop 0.65s
                        cubic-bezier(.2,.8,.2,1) 0.35s both;
                }

                @keyframes greenCirclePop {
                    0% {
                        opacity: 0;
                        transform: scale(0);
                    }

                    60% {
                        opacity: 1;
                        transform: scale(1.15);
                    }

                    80% {
                        transform: scale(0.94);
                    }

                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .success-check {
                    display: block;
                    width: 52px;
                    height: 52px;
                    overflow: visible;
                    animation: checkAppear 0.45s
                        cubic-bezier(.2,.8,.2,1) 0.9s both;
                }

                .check-path {
                    stroke-dasharray: 45;
                    stroke-dashoffset: 45;
                    animation: drawCheck 0.65s
                        cubic-bezier(.65,0,.35,1) 1s forwards;
                }

                @keyframes checkAppear {
                    0% {
                        opacity: 0;
                        transform: scale(0.4) rotate(-10deg);
                    }

                    70% {
                        opacity: 1;
                        transform: scale(1.12) rotate(3deg);
                    }

                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }

                @keyframes drawCheck {
                    0% {
                        stroke-dashoffset: 45;
                    }

                    100% {
                        stroke-dashoffset: 0;
                    }
                }

                .thank-title {
                    margin-top: 28px;
                    font-size: 2.5rem;
                    line-height: 1.1;
                    font-weight: 700;
                    letter-spacing: -0.025em;
                    color: #451a03;
                    opacity: 0;
                    transform: translateY(20px) scale(0.94);
                    transition:
                        opacity 0.7s ease 0.75s,
                        transform 0.7s cubic-bezier(.2,.8,.2,1) 0.75s;
                }

                @media (min-width: 768px) {
                    .thank-title {
                        font-size: 3rem;
                    }
                }

                .thank-title-visible {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .thank-description {
                    margin-top: 12px;
                    color: #57534e;
                    font-size: 1rem;
                    opacity: 0;
                    transform: translateY(10px);
                    transition:
                        opacity 0.6s ease 1s,
                        transform 0.6s ease 1s;
                }

                @media (min-width: 768px) {
                    .thank-description {
                        font-size: 1.125rem;
                    }
                }

                .thank-subtitle {
                    margin-top: 4px;
                    color: #a8a29e;
                    font-size: 0.875rem;
                    opacity: 0;
                    transform: translateY(10px);
                    transition:
                        opacity 0.6s ease 1.15s,
                        transform 0.6s ease 1.15s;
                }

                .text-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .animate-card-1 {
                    animation: cardAppear 0.65s ease-out 1.25s both;
                }

                @keyframes cardAppear {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </main>
    );
}

function InfoCard({ icon, title, value }) {
    return (
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-900">
                {icon}
            </div>

            <p className="text-xs text-stone-400 mt-4">
                {title}
            </p>

            <p className="text-sm font-semibold text-stone-800 mt-1">
                {value}
            </p>
        </div>
    );
}

function ProgressStep({ icon, label, active = false }) {
    return (
        <div className="flex flex-col items-center flex-shrink-0">
            <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${active
                        ? "bg-amber-900 text-white"
                        : "bg-stone-100 text-stone-400"
                    }`}
            >
                {icon}
            </div>

            <span
                className={`mt-2 text-[10px] sm:text-xs whitespace-nowrap ${active
                        ? "text-amber-900 font-semibold"
                        : "text-stone-400"
                    }`}
            >
                {label}
            </span>
        </div>
    );
}

function ProgressLine({ active = false }) {
    return (
        <div
            className={`flex-1 h-0.5 mx-2 ${active ? "bg-amber-900" : "bg-stone-200"
                }`}
        />
    );
}