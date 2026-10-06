"use client";

import React, { useState, useRef, useEffect } from "react";
import {Star,MoreVertical} from "lucide-react";
import { client } from "@/utils/helper";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function AddressCard({
    address,
    selectedAddress,
    setSelectedAddress,
    setShowForm,
    setEditAddress,
    handleDeleteAddress,
    handleDefaultAddress,
    showSelection = true,
    showAllAddresses,
    setShowAllAddresses
}) {

    const [openDelete, setOpenDelete] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(e) {

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    const deleteAddress = async () => {

        try {

            const response = await client.delete(
                `/user/delete-address/${address._id}`
            );

            if (response.data.success) {

                toast.success(response.data.message);

                handleDeleteAddress?.(
                    response.data.addresses
                );

                setOpenDelete(false);

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };
    return (
    <>

        <div
            className={`border rounded-xl p-5 flex gap-4 transition relative

            ${showSelection ? "cursor-pointer" : ""}

            ${
                showSelection
                    ? selectedAddress === address._id
                        ? "border-amber-900 bg-amber-50"
                        : "border-gray-200"
                    : address.isDefault
                    ? "border-amber-200 bg-amber-50"
                    : "border-gray-200 hover:border-amber-200"
            }`}
        >

            {showSelection && (
                <input
                    type="radio"
                    checked={selectedAddress === address._id}
                    onChange={() => {
                        setSelectedAddress(address._id);
                        setShowAllAddresses?.(false);
                    }}
                    className="mt-1"
                />
            )}

            <div className="flex-1">

                <div className="flex justify-between items-start">

                    <div>

                        <h3 className="font-semibold">
                            {address.fullname}
                        </h3>

                        <p className="text-sm">
                            {address.mobile}
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        {address.isDefault && (
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span>Default</span>
                            </div>
                        )}

                        <div className="relative" ref={menuRef}>

                            <button
                                type="button"
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {menuOpen && (

                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">

                                    {!showSelection && (
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => {
                                                setShowAllAddresses?.(true);
                                                setMenuOpen(false);
                                            }}
                                        >
                                            Change Address
                                        </button>
                                    )}

                                    {!address.isDefault && (
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => {
                                                handleDefaultAddress?.(
                                                    address._id
                                                );
                                                setMenuOpen(false);
                                            }}
                                        >
                                            Make Default
                                        </button>
                                    )}

                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setEditAddress?.(address);
                                            setShowForm?.(true);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                            setOpenDelete(true);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        Delete
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

                <p className="mt-3 text-gray-600">
                    {address.addressLine}
                </p>

                <p className="text-gray-700">
                    {address.city}, {address.state} - {address.pincode}
                </p>

            </div>

        </div>

        <ConfirmModal
            open={openDelete}
            title="Delete Address"
            message="Are you sure you want to delete this address?"
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={deleteAddress}
            onCancel={() => setOpenDelete(false)}
        />

    </>
);
}