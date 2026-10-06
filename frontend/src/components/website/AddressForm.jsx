"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { client } from "@/utils/helper";
import { toast } from "react-toastify";

export default function AddressForm({
    setShowForm,
    setAddresses,
    setSelectedAddress,
    editAddress,
    setEditAddress
}) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        mobile: "",
        pincode: "",
        addressLine: "",
        city: "",
        state: "",
        country: "India",
        isDefault: false,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editAddress) {
            setFormData({
                fullname: editAddress.fullname || "",
                mobile: editAddress.mobile || "",
                pincode: editAddress.pincode || "",
                addressLine: editAddress.addressLine || "",
                city: editAddress.city || "",
                state: editAddress.state || "",
                country: editAddress.country || "India",
                isDefault: editAddress.isDefault || false,
            });

            setErrors({});
        } else {
            setFormData({
                fullname: "",
                mobile: "",
                pincode: "",
                addressLine: "",
                city: "",
                state: "",
                country: "India",
                isDefault: false,
            });

            setErrors({});
        }
    }, [editAddress]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = type === "checkbox" ? checked : value;

        if (name === "mobile") {
            newValue = value.replace(/\D/g, "").slice(0, 10);
        }

        if (name === "pincode") {
            newValue = value.replace(/\D/g, "").slice(0, 6);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const fullname = formData.fullname.trim();
        const mobile = formData.mobile.trim();
        const pincode = formData.pincode.trim();
        const addressLine = formData.addressLine.trim();
        const city = formData.city.trim();
        const state = formData.state.trim();
        const country = formData.country.trim();

        if (!fullname) {
            newErrors.fullname = "Full name is required";
        } else if (fullname.length < 3) {
            newErrors.fullname = "Full name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s.'-]+$/.test(fullname)) {
            newErrors.fullname = "Enter a valid full name";
        }

        if (!mobile) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^[0-9]{10}$/.test(mobile)) {
            newErrors.mobile = "Enter a valid 10 digit mobile number";
        }

        if (!pincode) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^[0-9]{6}$/.test(pincode)) {
            newErrors.pincode = "Enter a valid 6 digit pincode";
        }

        if (!addressLine) {
            newErrors.addressLine = "Address is required";
        } else if (addressLine.length < 10) {
            newErrors.addressLine = "Address must be at least 10 characters";
        }

        if (!city) {
            newErrors.city = "City is required";
        } else if (city.length < 2) {
            newErrors.city = "Enter a valid city";
        }

        if (!state) {
            newErrors.state = "State is required";
        } else if (state.length < 2) {
            newErrors.state = "Enter a valid state";
        }

        if (!country) {
            newErrors.country = "Country is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            fullname: "",
            mobile: "",
            pincode: "",
            addressLine: "",
            city: "",
            state: "",
            country: "India",
            isDefault: false,
        });

        setErrors({});
    };

    const closeForm = () => {
        setShowForm(false);
        setEditAddress(null);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        try {
            setLoading(true);

            let response;

            if (editAddress) {
                response = await client.put(
                    `/user/update-address/${editAddress._id}`,
                    formData
                );
            } else {
                response = await client.post(
                    "/user/add-address",
                    formData
                );
            }

            if (response.data.success) {
                toast.success(response.data.message);

                const updatedAddresses = response.data.addresses;

                setAddresses(updatedAddresses);

                if (editAddress) {
                    setSelectedAddress?.(editAddress._id);
                } else {
                    const latestAddress =
                        updatedAddresses[updatedAddresses.length - 1];

                    if (latestAddress) {
                        setSelectedAddress?.(latestAddress._id);
                    }
                }

                setShowForm(false);
                setEditAddress(null);
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
            <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[90vh]">
                <div className="flex shrink-0 items-center justify-between border-b p-4 sm:p-5">
                    <h2 className="text-lg font-bold text-amber-900 sm:text-xl">
                        {editAddress ? "Edit Address" : "Add New Address"}
                    </h2>

                    <button
                        type="button"
                        onClick={closeForm}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="overflow-y-auto p-4 sm:p-6"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="min-w-0">
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={formData.fullname}
                                onChange={handleChange}
                                className={`w-full rounded-lg border p-3 text-sm outline-none transition focus:border-amber-700 sm:text-base ${errors.fullname
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            {errors.fullname && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.fullname}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0">
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength={10}
                                className={`w-full rounded-lg border p-3 text-sm outline-none transition focus:border-amber-700 sm:text-base ${errors.mobile
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            {errors.mobile && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.mobile}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0">
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength={6}
                                className={`w-full rounded-lg border p-3 text-sm outline-none transition focus:border-amber-700 sm:text-base ${errors.pincode
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            {errors.pincode && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.pincode}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full rounded-lg border p-3 text-sm outline-none transition focus:border-amber-700 sm:text-base ${errors.city
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            {errors.city && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.city}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0">
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full rounded-lg border p-3 text-sm outline-none transition focus:border-amber-700 sm:text-base ${errors.state
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            {errors.state && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.state}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0">
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className={`w-full rounded-lg border p-3 text-sm outline-none transition focus:border-amber-700 sm:text-base ${errors.country
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            {errors.country && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.country}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <textarea
                            rows={4}
                            name="addressLine"
                            placeholder="Full Address"
                            value={formData.addressLine}
                            onChange={handleChange}
                            className={`min-h-[110px] w-full resize-y rounded-lg border p-3 text-sm outline-none transition focus:border-amber-700 sm:text-base ${errors.addressLine
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                        />

                        {errors.addressLine && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.addressLine}
                            </p>
                        )}
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="h-4 w-4 shrink-0 accent-amber-900"
                        />

                        <span>
                            Make this default address
                        </span>
                    </label>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="w-full rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:text-base"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-amber-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-amber-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-base"
                        >
                            {loading
                                ? "Saving..."
                                : editAddress
                                    ? "Update Address"
                                    : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}