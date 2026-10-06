"use client";

import { client } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function loginHandler(e) {
        e.preventDefault();

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            // Login
            const response = await client.post(
                "user/login",
                {
                    email,
                    password,
                }
            );

            console.log("Login Response:", response.data);

            if (!response.data.success) {
                toast.error(
                    response.data.message ||
                    "Unable to login"
                );
                return;
            }

            /*
             * -----------------------------------------
             * LOGIN SUCCESS
             * -----------------------------------------
             */

            // Get saved redirect path
            let redirectPath = "/";

            if (typeof window !== "undefined") {
                const savedRedirect =
                    sessionStorage.getItem(
                        "loginRedirect"
                    );

                if (savedRedirect) {
                    redirectPath = savedRedirect;
                }
            }

            /*
             * -----------------------------------------
             * SYNC GUEST CART
             * -----------------------------------------
             */

            try {
                if (typeof window !== "undefined") {
                    const savedCart =
                        localStorage.getItem("cart");

                    if (savedCart) {
                        const parsedCart =
                            JSON.parse(savedCart);

                        const localCartItems =
                            parsedCart?.items || [];

                        if (localCartItems.length > 0) {
                            const syncResponse =
                                await client.post(
                                    "cart/sync-cart",
                                    {
                                        localCart:
                                            JSON.stringify(
                                                localCartItems
                                            ),
                                    }
                                );

                            console.log(
                                "Cart Sync Response:",
                                syncResponse.data
                            );
                        }
                    }
                }
            } catch (cartError) {
                console.error(
                    "Cart Sync Error:",
                    cartError
                );

                /*
                 * Cart sync fail hone par login
                 * fail nahi karenge.
                 */
            }

            /*
             * -----------------------------------------
             * REMOVE SAVED REDIRECT
             * -----------------------------------------
             */

            if (typeof window !== "undefined") {
                sessionStorage.removeItem(
                    "loginRedirect"
                );
            }

            toast.success(
                response.data.message ||
                "Login successful"
            );

            /*
             * -----------------------------------------
             * FINAL REDIRECT
             * -----------------------------------------
             */

            router.push(redirectPath);

        } catch (error) {
            console.log(
                "Login Error:",
                error
            );

            /*
             * Account doesn't exist
             */
            if (error.response?.status === 404) {
                toast.error(
                    "Account not found. Redirecting to register..."
                );

                setTimeout(() => {
                    router.push("/register");
                }, 1200);

                return;
            }

            /*
             * Wrong password / other login error
             */
            toast.error(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f5f1] px-5 py-10">

            <form
                onSubmit={loginHandler}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-[#eee7e0]"
            >

                <h2 className="text-3xl font-semibold text-gray-900">
                    Welcome back
                </h2>

                <p className="text-gray-500 mt-2 mb-10">
                    Sign in to your Nestro account to continue.
                </p>

                {/* Email */}
                <label
                    htmlFor="email"
                    className="text-gray-600 text-sm font-medium"
                >
                    Email address
                </label>

                <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="rahul@email.com"
                    autoComplete="email"
                    className="w-full mt-2 mb-6 px-5 py-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#93633e] focus:border-[#93633e]"
                />

                {/* Password */}
                <label
                    htmlFor="password"
                    className="text-gray-600 text-sm font-medium"
                >
                    Password
                </label>

                <div className="relative">

                    <input
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full mt-2 px-5 py-4 pr-14 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#93633e] focus:border-[#93633e]"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                        className="absolute right-5 top-5 text-gray-500 hover:text-[#93633e] cursor-pointer"
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword
                            ? "🙈"
                            : "👁"}
                    </button>

                </div>

                {/* Forgot Password */}
                <div className="text-right mt-3">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/forgot-password"
                            )
                        }
                        className="text-sm text-[#93633e] hover:text-[#7b5030] cursor-pointer"
                    >
                        Forgot password?
                    </button>

                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-[#93633e] text-white py-4 rounded-xl hover:bg-[#7b5030] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>

                {/* Register */}
                <div className="text-center mt-8 text-gray-500 text-sm">

                    Don't have an account?

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/register"
                            )
                        }
                        className="text-[#93633e] hover:text-[#7b5030] ml-2 cursor-pointer font-medium"
                    >
                        Create account
                    </button>

                </div>

            </form>

        </div>
    );
}