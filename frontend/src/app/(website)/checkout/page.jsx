"use client";

import Checkout from "@/components/website/Checkout";
import { client } from "@/utils/helper";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const response = await client.get("user/profile");

                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error(
                    "Checkout Profile Error:",
                    error?.response?.data || error.message
                );
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