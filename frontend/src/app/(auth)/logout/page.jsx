
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
    const router = useRouter();
    const logoutStarted = useRef(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (logoutStarted.current) return;
        logoutStarted.current = true;

        const logoutUser = async () => {
            try {
                const response = await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "same-origin",
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Unable to logout");
                }

                toast.success(data.message || "Logout successful");
                setLoading(false);

                setTimeout(() => {
                    router.replace("/");
                    router.refresh();
                }, 800);
            } catch (error) {
                console.error("LOGOUT ERROR:", error);
                toast.error(error.message || "Unable to logout");
                setLoading(false);
            }
        };

        logoutUser();
    }, [router]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f5f1] px-5">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#eee5dc] p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#f3ebe4] flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800">
                    {loading ? "Logging out..." : "Logout successful"}
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
