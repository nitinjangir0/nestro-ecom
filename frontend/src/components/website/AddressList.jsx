"use client";

import React from "react";
import { MapPin, Plus } from "lucide-react";
import AddressCard from "./AddressCard";

export default function AddressList({
    addresses,
    selectedAddress,
    setSelectedAddress,
    setShowForm,
    setEditAddress,
    handleDeleteAddress,
    handleDefaultAddress,
    showSelection = true,
    showAllAddresses,
    setShowAllAddresses,
    paymentMethod,
    setPaymentMethod
}) {

    const displayAddresses = showAllAddresses
        ? addresses
        : addresses.filter(
            (address) => address._id === selectedAddress
        );

    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-bold flex items-center gap-2">
                    <MapPin size={20} />
                    Delivery Address
                </h2>

                <div className="flex gap-3">

                    {addresses.length > 1 && !showAllAddresses && (
                        <button
                            onClick={() => setShowAllAddresses(true)}
                            className="border border-amber-900 text-amber-900 px-4 py-2 rounded-lg hover:bg-amber-50 transition"
                        >
                            Change Address
                        </button>
                    )}

                    {showAllAddresses && (
                        <button
                            onClick={() => setShowAllAddresses(false)}
                            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-amber-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-800"
                    >
                        <Plus size={18} />
                        Add Address
                    </button>

                </div>

            </div>

            {addresses.length === 0 ? (

                <div className="text-center py-10">
                    <p className="text-gray-500">No Address Found</p>
                </div>

            ) : (

                <div className="space-y-4">

                    {displayAddresses.map((address) => (

                        <AddressCard
                            key={address._id}
                            address={address}
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                            setShowForm={setShowForm}
                            setEditAddress={setEditAddress}
                            handleDeleteAddress={handleDeleteAddress}
                            handleDefaultAddress={handleDefaultAddress}
                            showSelection={showAllAddresses}
                            showAllAddresses={showAllAddresses}
                            setShowAllAddresses={setShowAllAddresses}
                        />

                    ))}

                    {/* ================= Payment Method ================= */}

                    <div className="border-t pt-6 mt-6">

                        <h2 className="text-xl font-bold text-amber-900 mb-5">
                            Payment Method
                        </h2>

                        <div className="space-y-4">

                            <label
                                className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition ${paymentMethod === "cod"
                                    ? "border-amber-700 bg-amber-50"
                                    : "border-gray-200 hover:border-amber-400"
                                    }`}
                            >
                                <div className="flex items-center gap-3">

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="accent-amber-700 w-5 h-5"
                                    />

                                    <div>
                                        <h3 className="font-semibold">
                                            Cash on Delivery
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Pay when your order is delivered.
                                        </p>
                                    </div>

                                </div>

                                <span className="text-2xl">💵</span>

                            </label>

                            <label
                                className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition ${paymentMethod === "online"
                                    ? "border-amber-700 bg-amber-50"
                                    : "border-gray-200 hover:border-amber-400"
                                    }`}
                            >
                                <div className="flex items-center gap-3">

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === "online"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="accent-amber-700 w-5 h-5"
                                    />

                                    <div>
                                        <h3 className="font-semibold">
                                            Pay Online
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            UPI, Cards, Net Banking & Wallets
                                        </p>
                                    </div>

                                </div>

                                <span className="text-2xl">💳</span>

                            </label>

                        </div>

                    </div>

                </div>

            )}
        </div>
    );
}