"use client";

import { client } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        otp: "",
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

    // =========================
    // SEND OTP
    // =========================
    async function sendOtpHandler(e) {
        e.preventDefault();

        if (!formData.email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const response = await client.post(
                "user/forgot-password",
                {
                    email: formData.email,
                }
            );

            if (response.data.success) {
                toast.success(
                    response.data.message || "OTP sent successfully"
                );

                setStep(2);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to send OTP"
            );
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // VERIFY OTP
    // =========================
    async function verifyOtpHandler(e) {
        e.preventDefault();

        if (!formData.otp) {
            toast.error("Please enter OTP");
            return;
        }

        try {
            setLoading(true);

            const response = await client.post(
                "user/verify-forgot-password-otp",
                {
                    email: formData.email,
                    otp: formData.otp,
                }
            );

            if (response.data.success) {
                toast.success(
                    response.data.message || "OTP verified successfully"
                );

                setStep(3);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Invalid or expired OTP"
            );
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // RESET PASSWORD
    // =========================
    async function resetPasswordHandler(e) {
        e.preventDefault();

        if (!formData.password || !formData.confirmPassword) {
            toast.error("Please enter both passwords");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await client.post(
                "user/reset-password",
                {
                    email: formData.email,
                    otp: formData.otp,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }
            );

            if (response.data.success) {
                toast.success(
                    response.data.message ||
                    "Password reset successfully"
                );

                setFormData({
                    email: "",
                    otp: "",
                    password: "",
                    confirmPassword: "",
                });

                setTimeout(() => {
                    router.push("/");
                }, 1000);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to reset password"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f5f1] px-5">

            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow">

                {/* ================= HEADER ================= */}

                <h2 className="text-3xl font-semibold">
                    {step === 1 && "Forgot password"}
                    {step === 2 && "Verify OTP"}
                    {step === 3 && "Create new password"}
                </h2>

                <p className="text-gray-500 mt-2 mb-10">
                    {step === 1 &&
                        "Enter your email address and we'll send you an OTP."}

                    {step === 2 &&
                        `Enter the OTP sent to ${formData.email}.`}

                    {step === 3 &&
                        "Create a new password for your account."}
                </p>


                {/* ================= STEP 1 ================= */}

                {step === 1 && (
                    <form onSubmit={sendOtpHandler}>

                        <label className="text-gray-600">
                            Email address
                        </label>

                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="rahul@email.com"
                            className="w-full mt-2 mb-6 px-5 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#93633e]"
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-[#93633e] text-white py-4 rounded-xl hover:bg-[#7b5030] disabled:opacity-50"
                        >
                            {loading
                                ? "Sending OTP..."
                                : "Send OTP"}
                        </button>

                    </form>
                )}


                {/* ================= STEP 2 ================= */}

                {step === 2 && (
                    <form onSubmit={verifyOtpHandler}>

                        <label className="text-gray-600">
                            Enter OTP
                        </label>

                        <input
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter 6 digit OTP"
                            className="w-full mt-2 mb-6 px-5 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#93633e]"
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-[#93633e] text-white py-4 rounded-xl hover:bg-[#7b5030] disabled:opacity-50"
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full mt-4 text-[#93633e]"
                        >
                            Change email
                        </button>

                    </form>
                )}


                {/* ================= STEP 3 ================= */}

                {step === 3 && (
                    <form onSubmit={resetPasswordHandler}>

                        {/* Password */}

                        <label className="text-gray-600">
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


                        <button
                            disabled={loading}
                            className="w-full mt-6 bg-[#93633e] text-white py-4 rounded-xl hover:bg-[#7b5030] disabled:opacity-50"
                        >
                            {loading
                                ? "Updating password..."
                                : "Reset password"}
                        </button>

                    </form>
                )}


                {/* ================= BACK TO LOGIN ================= */}

                <div className="text-center mt-8 text-gray-500">

                    Remember your password?

                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="text-[#93633e] ml-2"
                    >
                        Sign in
                    </button>

                </div>

            </div>
        </div>
    );
}