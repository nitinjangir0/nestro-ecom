import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/utils/serverapi";
import CancelOrderButton from "@/components/website/CancelOrderButton";
import {
    ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, Package, CreditCard, XCircle,
    IndianRupee,
} from "lucide-react";
export default async function OrderDetailsPage({ params }) {
    const { orderId } = await params;
    const response = await getOrderById(orderId);
    if (!response.success || !response.data) {
        redirect("/orders");
    }
    const order = response.data;
    const orderDate = new Date(
        order.createdAt
    ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const getStatusStyle = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-50 text-green-700";
            case "shipped":
                return "bg-blue-50 text-blue-700";
            case "cancelled":
                return "bg-red-50 text-red-600";
            case "confirmed":
                return "bg-purple-50 text-purple-700";
            default:
                return "bg-[#F5E8DD] text-[#A66A43]";
        }
    };
    const statusSteps = [
        {
            key: "placed",
            label: "Order Placed",
        },
        {
            key: "confirmed",
            label: "Confirmed",
        },
        {
            key: "shipped",
            label: "Shipped",
        },
        {
            key: "delivered",
            label: "Delivered",
        },
    ];
    const statusIndex = statusSteps.findIndex(
        (item) => item.key === order.orderStatus
    );
    return (
        <section className="min-h-screen bg-[#FAF8F6] py-2">
            <div className="mx-auto max-w-2xl px-2">
                {/* =========================
                    BACK
                ========================= */}
                <Link
                    href="/orders"
                    className="mb-2 inline-flex items-center gap-2 text-sm text-[#756155] transition hover:text-[#A66A43]"
                >
                    <ArrowLeft size={17} />
                    Back to Orders
                </Link>
                {/* =========================
                    HEADER
                ========================= */}
                <div className="mb-3 rounded-xl bg-white px-2.5 py-2.5 shadow-[0_5px_20px_rgba(166,106,67,0.07)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-[#9A8475]">
                                Order ID
                            </p>
                            <h1 className="mt-1 text-lg font-semibold text-[#2F221B]">
                                #{order._id.slice(-8).toUpperCase()}
                            </h1>
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8A7667]">
                                <CalendarDays size={13} />
                                Placed on {orderDate}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">

                            <span
                                className={`rounded-full px-2 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                                    order.orderStatus
                                )}`}
                            >
                                {order.orderStatus}
                            </span>

                            {(order.orderStatus === "placed" ||
                                order.orderStatus === "confirmed") && (
                                    <CancelOrderButton
                                        orderId={order._id.toString()}
                                    />
                                )}

                        </div>

                    </div>

                </div>


                {/* =========================
                    ORDER TRACKING
                ========================= */}

                {order.orderStatus !== "cancelled" && (

                    <div className="mb-3 rounded-2xl bg-white px-2.5 py-3 shadow-[0_5px_20px_rgba(166,106,67,0.07)]">
                        <h2 className="mb-3 text-sm font-semibold text-[#2F221B]">
                            Order Status
                        </h2>
                        <div className="flex items-start justify-between">
                            {statusSteps.map((step, index) => {
                                const completed =
                                    statusIndex >= index;
                                return (
                                    <div
                                        key={step.key}
                                        className="relative flex flex-1 flex-col items-center"
                                    >
                                        {/* LINE */}
                                        {index <
                                            statusSteps.length - 1 && (
                                                <div
                                                    className={`absolute left-1/2 top-4 h-[2px] w-full
                                                ${statusIndex >
                                                            index
                                                            ? "bg-[#A66A43]"
                                                            : "bg-[#E9DDD5]"
                                                        }`}
                                                />

                                            )}
                                        {/* ICON */}
                                        <div
                                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full
                                            ${completed
                                                    ? "bg-[#A66A43] text-white"
                                                    : "bg-[#F3E7DD] text-[#A58E7E]"
                                                }`}
                                        >
                                            {completed ? (
                                                <CheckCircle2 size={17} />
                                            ) : (
                                                <Clock3 size={16} />
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-center text-[8px]
                                            ${completed
                                                    ? "font-medium text-[#A66A43]"
                                                    : "text-[#9A8475]"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* =========================
                    CANCELLED
                ========================= */}
                {order.orderStatus === "cancelled" && (
                    <div className="mb-2 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-2.5 py-2">
                        <XCircle
                            size={22}
                            className="text-red-500"
                        />
                        <div>
                            <p className="text-sm font-medium text-red-700">
                                This order has been cancelled.
                            </p>

                            <p className="mt-0.5 text-xs text-red-500">
                                Please contact support if you need help.
                            </p>
                        </div>
                    </div>
                )}
                {/* =========================
                    MAIN GRID
                ========================= */}
                <div className="grid gap-5 lg:grid-cols-[1fr_250px]">
                    {/* =========================
                        PRODUCTS
                    ========================= */}
                    <div className="rounded-2xl bg-white shadow-[0_5px_20px_rgba(166,106,67,0.07)]">
                        <div className="border-b border-[#F3E7DD] px-2.5 py-2">
                            <div className="flex items-center gap-2">
                                <Package
                                    size={17}
                                    className="text-[#A66A43]"
                                />
                                <h2 className="text-sm font-semibold text-[#2F221B]">
                                    Order Items
                                </h2>
                            </div>
                        </div>
                        <div className="divide-y divide-[#F3E7DD]">
                            {order.items?.map((item, index) => {
                                const product = item.product_id;
                                return (
                                    <div
                                        key={index}
                                        className="flex gap-4 px-2.5 py-2"
                                    >
                                        {/* IMAGE */}
                                        {product?.thumbnail ? (
                                            <img
                                                src={product.thumbnail}
                                                alt={
                                                    product.name ||
                                                    "Product"
                                                }
                                                className="h-20 w-20 shrink-0 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F8F3EF]">
                                                <Package
                                                    size={24}
                                                    className="text-[#A66A43]"
                                                />
                                            </div>
                                        )}
                                        {/* DETAILS */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-medium text-[#2F221B]">
                                                {product?.name ||
                                                    "Product"}
                                            </h3>
                                            <p className="mt-1 text-xs text-[#8A7667]">
                                                Quantity: {item.qty}
                                            </p>
                                            <p className="mt-2 text-xs text-[#756155]">
                                                ₹
                                                {item.price.toLocaleString(
                                                    "en-IN"
                                                )}
                                                {" "}×{" "}
                                                {item.qty}
                                            </p>
                                        </div>
                                        {/* ITEM TOTAL */}
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-[#2F221B]">
                                                ₹
                                                {item.total.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* TOTAL */}
                        <div className="border-t border-[#F3E7DD] px-2.5 py-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#756155]">
                                    Total Amount
                                </span>
                                <div className="flex items-center gap-1">
                                    <IndianRupee size={16} />
                                    <span className="text-lg font-semibold text-[#2F221B]">
                                        {order.totalAmount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* =========================
                        RIGHT SIDE
                    ========================= */}
                    <div className="space-y-3">
                        {/* SHIPPING ADDRESS */}
                        <div className="rounded-2xl bg-white shadow-[0_5px_20px_rgba(166,106,67,0.07)]">
                            <div className="border-b border-[#F3E7DD] px-2.5 py-2">
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={15}
                                        className="text-[#A66A43]"
                                    />
                                    <h2 className="text-sm font-semibold text-[#2F221B]">
                                        Delivery Address
                                    </h2>
                                </div>
                            </div>
                            <div className="px-2.5 py-2">
                                <p className="text-sm font-medium text-[#2F221B]">
                                    {order.shippingAddress?.fullName}
                                </p>
                                <p className="mt-2 text-xs leading-5 text-[#756155]">
                                    {order.shippingAddress?.addressLine}
                                    <br />
                                    {order.shippingAddress?.city},{" "}
                                    {order.shippingAddress?.state}
                                    <br />
                                    {order.shippingAddress?.pincode}
                                    <br />
                                    {order.shippingAddress?.country}
                                </p>
                                <p className="mt-2 text-xs text-[#756155]">
                                    Mobile:{" "}
                                    <span className="font-medium">
                                        {order.shippingAddress?.mobile}
                                    </span>
                                </p>
                            </div>
                        </div>
                        {/* PAYMENT */}
                        <div className="rounded-2xl bg-white shadow-[0_5px_20px_rgba(166,106,67,0.07)]">
                            <div className="border-b border-[#F3E7DD] px-2.5 py-2">
                                <div className="flex items-center gap-2">
                                    <CreditCard
                                        size={17}
                                        className="text-[#A66A43]"
                                    />
                                    <h2 className="text-sm font-semibold text-[#2F221B]">
                                        Payment
                                    </h2>
                                </div>
                            </div>
                            <div className="space-y-3 px-5 py-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#8A7667]">
                                        Method
                                    </span>
                                    <span className="font-medium uppercase text-[#2F221B]">
                                        {order.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#8A7667]">
                                        Payment Status
                                    </span>
                                    <span className="font-medium capitalize text-[#A66A43]">
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-[#F3E7DD] pt-3 text-sm">
                                    <span className="font-medium text-[#756155]">
                                        Total
                                    </span>
                                    <span className="font-semibold text-[#2F221B]">
                                        ₹
                                        {order.totalAmount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}