"use client";

import { useState } from "react";
import Link from "next/link";

import { Package, CalendarDays, IndianRupee, ChevronRight, ShoppingBag, } from "lucide-react";

export default function OrdersList({ orders = [] }) {
    const [showAll, setShowAll] = useState(false);
    const visibleOrders = showAll ? orders : orders.slice(0, 3);

    if (orders.length === 0) {

        return (
            <div className="rounded-xl bg-white px-4 py-6 text-center shadow-[0_5px_20px_rgba(166,106,67,0.07)]">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F5E8DD]">
                    <ShoppingBag
                        size={24}
                        className="text-[#A66A43]"
                    />
                </div>
                <h2 className="mt-4 text-base font-semibold text-[#2F221B]">
                    No orders yet
                </h2>
                <p className="mt-1 text-xs text-[#8A7667]">
                    You haven't placed any orders yet.
                </p>
                <Link
                    href="/store"
                    className="mt-5 inline-flex rounded-lg bg-[#A66A43] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#8F5937]"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* ORDERS */}
            <div className="space-y-3">
                {visibleOrders.map((order) => {
                    const orderDate = new Date(
                        order.createdAt
                    ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    });

                    return (
                        <div
                            key={order._id}
                            className="rounded-2xl bg-white shadow-[0_4px_18px_rgba(166,106,67,0.07)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_7px_22px_rgba(166,106,67,0.11)]"
                        >
                            {/* TOP */}
                            <div className="flex items-center justify-between border-b border-[#F3E7DD] px-2 py-0.5">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wide text-[#9A8475]">
                                            Order ID
                                        </p>
                                        <p className="mt-0.5 text-xs font-semibold text-[#2F221B]">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="hidden h-5 w-px bg-[#EDE0D7] sm:block" />
                                    <div className="flex items-center gap-0.5 text-xs text-[#756155]">
                                        <CalendarDays size={13} />
                                        {orderDate}
                                    </div>
                                </div>
                                {/* STATUS */}
                                <span
                                    className={`inline-flex items-center justify-center rounded-full text-[10px] font-medium capitalize
                                       ${order.orderStatus === "placed"
                                            ? "bg-[#F5E8DD] px-3 py-1.5 text-[#A66A43]"
                                            : order.orderStatus === "delivered"
                                                ? "bg-green-50 px-2 py-1 text-green-700"
                                                : order.orderStatus === "cancelled"
                                                    ? "bg-red-50 px-2 py-1 text-red-600"
                                                    : order.orderStatus === "shipped"
                                                        ? "bg-blue-50 px-2 py-1 text-blue-700"
                                                        : "bg-[#F5E8DD] px-2 py-1 text-[#A66A43]"
                                        }`}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>


                            {/* CONTENT */}

                            <div className="flex items-center justify-between gap-2 px-2 py-1.5">

                                {/* PRODUCT */}

                                <div className="flex min-w-0 items-center gap-4">

                                    {order.items?.[0]?.product_id?.thumbnail ? (

                                        <img
                                            src={
                                                order.items[0]
                                                    .product_id
                                                    .thumbnail
                                            }
                                            alt={
                                                order.items[0]
                                                    .product_id
                                                    .name ||
                                                "Product"
                                            }
                                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F8F3EF]">

                                            <Package
                                                size={18}
                                                className="text-[#A66A43]"
                                            />

                                        </div>

                                    )}


                                    <div className="min-w-0">

                                        <h3 className="truncate text-sm font-medium text-[#2F221B]">
                                            {order.items?.[0]?.product_id?.name ||
                                                "Product"}
                                        </h3>


                                        <p className="mt-1 text-xs text-[#8A7667]">

                                            {order.items?.length > 1
                                                ? `+ ${order.items.length - 1} more item${order.items.length - 1 > 1 ? "s" : ""}`
                                                : `${order.items?.[0]?.qty || 1} item`
                                            }

                                        </p>

                                    </div>

                                </div>


                                {/* RIGHT */}

                                <div className="flex shrink-0 items-center gap-4">

                                    {/* TOTAL */}

                                    <div className="hidden items-center gap-1 sm:flex">

                                        <IndianRupee
                                            size={14}
                                            className="text-[#756155]"
                                        />

                                        <span className="text-sm font-semibold text-[#2F221B]">
                                            {order.totalAmount.toLocaleString("en-IN")}
                                        </span>

                                    </div>


                                    {/* VIEW */}

                                    <Link
                                        href={`/orders/${order._id}`}
                                        className="group flex items-center gap-1 rounded-lg border border-[#E4D3C7] px-3 py-2 text-xs font-medium text-[#A66A43] transition-all hover:border-[#A66A43] hover:bg-[#F8F3EF]"
                                    >
                                        View Orders

                                        <ChevronRight
                                            size={14}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />

                                    </Link>

                                </div>

                            </div>


                            {/* MOBILE TOTAL */}

                            <div className="flex items-center justify-between border-t border-[#F3E7DD] px-4 py-2.5 sm:hidden">

                                <span className="text-[11px] text-[#8A7667]">
                                    Total Amount
                                </span>

                                <div className="flex items-center gap-1">

                                    <IndianRupee size={12} />

                                    <span className="text-xs font-semibold text-[#2F221B]">
                                        {order.totalAmount.toLocaleString("en-IN")}
                                    </span>

                                </div>

                            </div>

                        </div>
                    );

                })}

            </div>


            {/* VIEW MORE */}

            {orders.length > 3 && (

                <div className="mt-1 flex justify-center">

                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#DCC5B5] bg-white px-5 py-2.5 text-xs font-medium text-[#A66A43] shadow-sm transition-all duration-300 hover:bg-[#F5E8DD]"
                    >
                        {showAll
                            ? "Show Less"
                            : `View More Orders (${orders.length - 3})`
                        }

                        <ChevronRight
                            size={14}
                            className={`transition-transform ${showAll ? "-rotate-90" : "rotate-90"
                                }`}
                        />

                    </button>

                </div>

            )}

        </div>
    );
}