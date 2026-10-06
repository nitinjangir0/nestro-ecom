"use client";

import { client } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
    const router = useRouter();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function changePasswordHandler(e) {
        e.preventDefault();

        if (
            !formData.currentPassword ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            toast.error("Please fill all fields");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.currentPassword === formData.password) {
            toast.error(
                "New password must be different from current password"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await client.put(
                "user/change-password",
                formData
            );

            if (response.data.success) {
                toast.success(
                    response.data.message ||
                    "Password changed successfully"
                );

                setFormData({
                    currentPassword: "",
                    password: "",
                    confirmPassword: "",
                });

                setTimeout(() => {
                    router.push("/profile");
                }, 1000);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to change password"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f5f1] px-5">

            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow">

                <h2 className="text-3xl font-semibold text-[#2F221B]">
                    Change password
                </h2>

                <p className="text-gray-500 mt-2 mb-10">
                    Update your password to keep your account secure.
                </p>

                <form onSubmit={changePasswordHandler}>

                    {/* Current Password */}

                    <label className="text-gray-600">
                        Current password
                    </label>

                    <div className="relative">

                        <input
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            type={
                                showCurrentPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="••••••••"
                            className="w-full mt-2 px-5 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#93633e]"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrentPassword(
                                    !showCurrentPassword
                                )
                            }
                            className="absolute right-5 top-5"
                        >
                            👁
                        </button>

                    </div>


                    {/* New Password */}

                    <label className="text-gray-600 block mt-6">
                        New password
                    </label>

                    <div className="relative">

                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="••••••••"
                            className="w-full mt-2 px-5 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#93633e]"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className="absolute right-5 top-5"
                        >
                            👁
                        </button>

                    </div>


                    {/* Confirm Password */}

                    <label className="text-gray-600 block mt-6">
                        Confirm password
                    </label>

                    <div className="relative">

                        <input
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="••••••••"
                            className="w-full mt-2 px-5 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#93633e]"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            className="absolute right-5 top-5"
                        >
                            👁
                        </button>

                    </div>


                    <div className="mt-3 text-left">
                        <button
                            type="button"
                            onClick={() => router.push("/forgot-password")}
                            className="cursor-pointer text-sm text-[#93633e] hover:text-[#7b5030] transition-colors"
                        >
                            Forgot your password?
                        </button>
                    </div>


                    {/* Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-[#93633e] text-white py-4 rounded-xl hover:bg-[#7b5030] disabled:opacity-50"
                    >
                        {loading
                            ? "Updating password..."
                            : "Change password"}
                    </button>

                </form>



                {/* Back */}

                <div className="text-center mt-5">

                    <button
                        type="button"
                        onClick={() => router.push("/profile")}
                        className="text-gray-500 hover:text-[#93633e]"
                    >
                        ← Back to profile
                    </button>

                </div>

            </div>

        </div>
    );
}