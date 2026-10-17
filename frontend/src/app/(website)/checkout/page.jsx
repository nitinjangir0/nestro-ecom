"use client";

import Checkout from "@/components/website/Checkout";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const response = await fetch("/api/user/profile", {
                    method: "GET",
                    credentials: "same-origin",
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    console.error(
                        "Checkout Profile Error:",
                        data.message || "Failed to fetch profile"
                    );
                    return;
                }

                setUser(data.user || data.data || null);
            } catch (error) {
                console.error("Checkout Profile Error:", error);
            } finally {
                setLoading(false);
            }
        };

        getUserProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading checkout...</p>
            </div>
        );
    }

    return <Checkout user={user} />;
}
