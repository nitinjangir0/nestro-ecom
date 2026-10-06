"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import {
    AlertTriangle,
    Loader2,
    X,
} from "lucide-react";

import { toast } from "react-toastify";
import { client } from "@/utils/helper";

export default function CancelOrderButton({ orderId }) {
    const router = useRouter();

    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    /* --------------------------------
       LOCK BODY SCROLL
    -------------------------------- */

    useEffect(() => {
        if (!showConfirm) return;

        const oldOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = oldOverflow;
        };
    }, [showConfirm]);

    /* --------------------------------
       ESCAPE
    -------------------------------- */

    useEffect(() => {
        if (!showConfirm) return;

        const handleEscape = (event) => {
            if (event.key === "Escape" && !loading) {
                setShowConfirm(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [showConfirm, loading]);

    /* --------------------------------
       CANCEL ORDER
    -------------------------------- */

    const handleCancelOrder = async () => {
        try {
            setLoading(true);

            const response = await client.patch(
                `order/cancel/${orderId}`
            );

            if (response.data?.success) {
                toast.success(
                    response.data?.message ||
                        "Order cancelled successfully"
                );

                setShowConfirm(false);

                router.refresh();
            } else {
                toast.error(
                    response.data?.message ||
                        "Unable to cancel order"
                );
            }
        } catch (error) {
            console.error(
                "Cancel Order Error:",
                error?.response?.data || error.message
            );

            toast.error(
                error?.response?.data?.message ||
                    "Something went wrong while cancelling order"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* =====================================
                CANCEL ORDER BUTTON
            ===================================== */}

            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="
                    rounded-full
                    border
                    border-red-200
                    bg-white
                    px-4
                    py-2
                    text-[11px]
                    font-medium
                    text-red-500
                    transition-all
                    duration-200
                    hover:border-red-300
                    hover:bg-red-50
                "
            >
                Cancel Order
            </button>

            {/* =====================================
                MODAL
            ===================================== */}

            {showConfirm &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            width: "100vw",
                            height: "100vh",
                            zIndex: 999999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                        }}
                    >
                        {/* =================================
                            DARK + BLUR BACKGROUND
                        ================================= */}

                        <div
                            onClick={() => {
                                if (!loading) {
                                    setShowConfirm(false);
                                }
                            }}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                background: "rgba(0, 0, 0, 0.62)",
                                backdropFilter: "blur(7px)",
                                WebkitBackdropFilter: "blur(7px)",
                            }}
                        />

                        {/* =================================
                            CENTER MODAL
                        ================================= */}

                        <div
                            role="dialog"
                            aria-modal="true"
                            style={{
                                position: "relative",
                                zIndex: 2,
                                width: "100%",
                                maxWidth: "390px",
                                flexShrink: 0,
                                background: "#ffffff",
                                borderRadius: "18px",
                                overflow: "hidden",
                                boxShadow:
                                    "0 25px 80px rgba(0,0,0,0.40)",
                            }}
                        >
                            {/* =================================
                                CLOSE
                            ================================= */}

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    setShowConfirm(false)
                                }
                                style={{
                                    position: "absolute",
                                    top: "14px",
                                    right: "14px",
                                    width: "30px",
                                    height: "30px",
                                    border: "none",
                                    borderRadius: "50%",
                                    background: "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: loading
                                        ? "not-allowed"
                                        : "pointer",
                                    color: "#8A7A70",
                                }}
                                className="
                                    hover:bg-[#F5F1EE]
                                    hover:text-[#2F241F]
                                    transition-all
                                "
                            >
                                <X size={17} />
                            </button>

                            {/* =================================
                                MODAL CONTENT
                            ================================= */}

                            <div
                                style={{
                                    padding:
                                        "30px 28px 26px",
                                }}
                            >
                                {/* WARNING ICON */}

                                <div
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        margin: "0 auto",
                                        borderRadius: "50%",
                                        background: "#FFF0F0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#EF4444",
                                    }}
                                >
                                    <AlertTriangle
                                        size={23}
                                        strokeWidth={2}
                                    />
                                </div>

                                {/* TITLE */}

                                <h3
                                    style={{
                                        marginTop: "17px",
                                        marginBottom: 0,
                                        textAlign: "center",
                                        fontSize: "17px",
                                        lineHeight: "24px",
                                        fontWeight: 600,
                                        color: "#2F241F",
                                    }}
                                >
                                    Cancel this order?
                                </h3>

                                {/* DESCRIPTION */}

                                <p
                                    style={{
                                        margin:
                                            "8px auto 0",
                                        maxWidth: "310px",
                                        textAlign: "center",
                                        fontSize: "12px",
                                        lineHeight: "18px",
                                        color: "#806F65",
                                    }}
                                >
                                    Are you sure you want to
                                    cancel this order? This
                                    action cannot be undone.
                                </p>
                            </div>

                            {/* =================================
                                BUTTON AREA
                            ================================= */}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    padding:
                                        "14px 18px 18px",
                                    background: "#FAF8F6",
                                    borderTop:
                                        "1px solid #EEE5DF",
                                }}
                            >
                                {/* KEEP ORDER */}

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        setShowConfirm(false)
                                    }
                                    style={{
                                        flex: 1,
                                        height: "42px",
                                        borderRadius: "11px",
                                        border:
                                            "1px solid #D8CDC5",
                                        background: "#FFFFFF",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: "#5B4B43",
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                    }}
                                    className="
                                        transition-all
                                        hover:bg-[#F7F2EE]
                                        hover:border-[#BFB0A7]
                                        active:scale-[0.98]
                                        disabled:opacity-50
                                    "
                                >
                                    Keep Order
                                </button>

                                {/* YES CANCEL ORDER */}

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleCancelOrder}
                                    style={{
                                        flex: 1,
                                        height: "42px",
                                        borderRadius: "11px",
                                        border: "none",
                                        background: "#EF4444",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: "#FFFFFF",
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                    }}
                                    className="
                                        transition-all
                                        hover:bg-[#DC2626]
                                        active:scale-[0.98]
                                        disabled:opacity-60
                                    "
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                            />

                                            Cancelling...
                                        </span>
                                    ) : (
                                        "Yes, Cancel Order"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}