"use client";

import { client } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        logoutUser();
    }, []);

    async function logoutUser() {
        try {
            setLoading(true);

            const response = await client.post(
                "user/logout"
            );

            if (response.data.success) {
                toast.success(
                    response.data.message ||
                    "Logout successful"
                );

                setTimeout(() => {
                    router.push("/");
                }, 800);
            }

        } catch (error) {
            console.log("LOGOUT ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to logout"
            );

            // Even if API fails, go to home
            setTimeout(() => {
                router.push("/");
            }, 1000);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f5f1] px-5">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#eee5dc] p-8 text-center">

                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#f3ebe4] flex items-center justify-center">
                    <span className="text-2xl">
                        ✓
                    </span>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800">
                    {loading
                        ? "Logging out..."
                        : "Logout successful"}
                </h1>

                <p className="text-gray-500 mt-2 text-sm">
                    {loading
                        ? "Please wait while we securely log you out."
                        : "Redirecting you to the home page..."}
                </p>

            </div>

        </div>
    );
}