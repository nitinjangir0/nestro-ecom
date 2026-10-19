
"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRazorpay } from "react-razorpay";
import { emptyCart } from "@/redux/features/cartSlice";

import AddressList from "./AddressList";
import AddressForm from "./AddressForm";

export default function Checkout({ user }) {
    const { error, isLoading, Razorpay } = useRazorpay();
    const router = useRouter();
    const dispatch = useDispatch();

    const finalTotal = useSelector(
        (state) => state.cart.final_total
    );

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const [editAddress, setEditAddress] = useState(null);

    const [addresses, setAddresses] = useState(
        user?.addresses || []
    );

    const [selectedAddress, setSelectedAddress] = useState(
        user?.addresses?.find((item) => item.isDefault)?._id ||
        user?.addresses?.[0]?._id ||
        ""
    );

    const [showForm, setShowForm] = useState(false);

    const [showAllAddresses, setShowAllAddresses] =
        useState(false);

    const [paymentMethod, setPaymentMethod] = useState("cod");

    async function orderHandler() {
        if (!selectedAddress) {
            toast.error("Please select an address");
            return;
        }

        if (!cartItems || cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const selectedAddressData = addresses.find(
            (item) =>
                item._id?.toString() === selectedAddress?.toString()
        );

        if (!selectedAddressData) {
            toast.error("Selected address not found");
            return;
        }

        try {
            const shippingAddress = {
                fullName:
                    selectedAddressData.fullName ||
                    selectedAddressData.fullname ||
                    "",
                mobile: selectedAddressData.mobile || "",
                pincode: selectedAddressData.pincode || "",
                addressLine: selectedAddressData.addressLine || "",
                city: selectedAddressData.city || "",
                state: selectedAddressData.state || "",
                country: selectedAddressData.country || "India",
            };

            if (!shippingAddress.fullName) {
                toast.error("Address name is missing");
                return;
            }

            if (!shippingAddress.mobile) {
                toast.error("Mobile number is missing");
                return;
            }

            if (!shippingAddress.pincode) {
                toast.error("Pincode is missing");
                return;
            }

            if (!shippingAddress.addressLine) {
                toast.error("Address is missing");
                return;
            }

            if (!shippingAddress.city) {
                toast.error("City is missing");
                return;
            }

            if (!shippingAddress.state) {
                toast.error("State is missing");
                return;
            }

            const response = await fetch("/api/order/place", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
                cache: "no-store",
                body: JSON.stringify({
                    shippingAddress,
                    paymentMethod,
                }),
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.success) {
                throw new Error(
                    responseData.message || "Unable to place order"
                );
            }

            // COD
            if (paymentMethod === "cod") {
                dispatch(emptyCart());

                if (typeof window !== "undefined") {
                    localStorage.removeItem("cart");
                }

                toast.success(
                    responseData.message || "Order placed successfully"
                );

                router.push(
                    `/thank-you?orderId=${responseData.orderId}`
                );

                return;
            }

            // ONLINE PAYMENT - RAZORPAY
            if (paymentMethod === "online") {
                if (!Razorpay) {
                    toast.error(
                        error?.message || "Payment gateway is not ready"
                    );
                    return;
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_API_Key,
                    currency: "INR",
                    amount: responseData.razorpay_amount,
                    name: "Nextro Pvt Ltd",
                    description: "Test Transaction",
                    order_id: responseData.razorpay_order_id,

                    handler: async (razorpayResponse) => {
                        try {
                            const verifyResponse = await fetch(
                                "/api/order/verify",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    credentials: "same-origin",
                                    cache: "no-store",
                                    body: JSON.stringify(razorpayResponse),
                                }
                            );

                            const verifyData =
                                await verifyResponse.json();

                            if (
                                verifyResponse.ok &&
                                verifyData?.success
                            ) {
                                dispatch(emptyCart());

                                if (typeof window !== "undefined") {
                                    localStorage.removeItem("cart");
                                }

                                toast.success(
                                    "Payment successful and order confirmed"
                                );

                                router.push(
                                    `/thank-you?orderId=${responseData.orderId}`
                                );
                            } else {
                                toast.error(
                                    verifyData?.message ||
                                    "Payment verification failed"
                                );
                            }
                        } catch (verificationError) {
                            console.error(
                                "Payment Verification Error:",
                                verificationError
                            );

                            toast.error(
                                verificationError?.message ||
                                "Payment verification failed"
                            );
                        }
                    },

                    prefill: {
                        name: user?.name || "john",
                        email: user?.email || "john.doe@gmail.com",
                        contact: 9602861467,
                    },

                    theme: {
                        color: "#F37254",
                    },
                };

                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();

                return;
            }

            toast.error("Invalid payment method");
        } catch (error) {
            console.error("Place Order Error:", error);

            toast.error(
                error?.message || "Internal Server Error"
            );
        }
    }

    const handleDeleteAddress = (updatedAddresses) => {
        setAddresses(updatedAddresses);

        const exist = updatedAddresses.find(
            (item) =>
                item._id?.toString() === selectedAddress?.toString()
        );

        if (!exist) {
            const defaultAddress = updatedAddresses.find(
                (item) => item.isDefault
            );

            setSelectedAddress(
                defaultAddress?._id ||
                updatedAddresses[0]?._id ||
                ""
            );
        }
    };

    const handleDefaultAddress = async (id) => {
        try {
            const response = await fetch(
                `/api/user/addresses/${id}?action=default`,
                {
                    method: "PUT",
                    credentials: "same-origin",
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            toast.success(data.message);

            setAddresses(data.addresses);
            setShowAllAddresses(false);

            const defaultAddress = data.addresses.find(
                (item) => item.isDefault
            );

            if (defaultAddress) {
                setSelectedAddress(defaultAddress._id);
            }
        } catch (error) {
            console.error("Default Address Error:", error);

            toast.error(
                error?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className="bg-stone-50 min-h-screen py-5 sm:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                {/* HEADER */}
                <h1
                    className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-amber-900
                        mb-5
                        sm:mb-8
                    "
                >
                    Checkout
                </h1>

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-3
                        gap-5
                        sm:gap-8
                    "
                >
                    {/* ADDRESS SECTION */}
                    <div className="lg:col-span-2 min-w-0">
                        <AddressList
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                            setShowForm={setShowForm}
                            setEditAddress={setEditAddress}
                            handleDeleteAddress={handleDeleteAddress}
                            handleDefaultAddress={handleDefaultAddress}
                            showAllAddresses={showAllAddresses}
                            setShowAllAddresses={setShowAllAddresses}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />

                        {showForm && (
                            <AddressForm
                                setShowForm={setShowForm}
                                setAddresses={setAddresses}
                                setSelectedAddress={setSelectedAddress}
                                editAddress={editAddress}
                                setEditAddress={setEditAddress}
                            />
                        )}
                    </div>

                    {/* ORDER SUMMARY */}
                    <div
                        className="
                            bg-white
                            rounded-xl
                            sm:rounded-2xl
                            shadow-sm
                            border
                            p-4
                            sm:p-6
                            h-fit
                            lg:sticky
                            lg:top-5
                        "
                    >
                        <h2
                            className="
                                text-lg
                                sm:text-xl
                                font-bold
                                text-amber-900
                                mb-4
                                sm:mb-6
                            "
                        >
                            Order Summary
                        </h2>

                        <div className="space-y-3 sm:space-y-4">
                            {/* SUBTOTAL */}
                            <div
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    gap-4
                                    text-sm
                                "
                            >
                                <span>Subtotal</span>

                                <span className="font-medium">
                                    ₹
                                    {Number(finalTotal).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            {/* SHIPPING */}
                            <div
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    gap-4
                                    text-sm
                                "
                            >
                                <span>Shipping</span>

                                <span
                                    className="
                                        text-green-600
                                        font-semibold
                                    "
                                >
                                    FREE
                                </span>
                            </div>

                            <hr />

                            {/* TOTAL */}
                            <div
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    gap-4
                                    text-base
                                    sm:text-lg
                                    font-bold
                                "
                            >
                                <span>Total</span>

                                <span className="text-amber-900">
                                    ₹
                                    {Number(finalTotal).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* PLACE ORDER BUTTON */}
                        <button
                            type="button"
                            onClick={orderHandler}
                            disabled={
                                !selectedAddress ||
                                !cartItems.length ||
                                isLoading
                            }
                            className={`
                                w-full
                                mt-5
                                sm:mt-6
                                py-3
                                rounded-xl
                                font-semibold
                                text-sm
                                sm:text-base
                                transition
                                ${
                                    selectedAddress && cartItems.length
                                        ? `
                                            bg-amber-900
                                            text-white
                                            hover:bg-amber-800
                                        `
                                        : `
                                            bg-gray-300
                                            text-gray-500
                                            cursor-not-allowed
                                        `
                                }
                            `}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
