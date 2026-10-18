
"use client";

import React, { useEffect, useState } from "react";
import AddressPage from "@/components/website/profile/AddressPage";

export default function Page() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        try {
            const response = await fetch("/api/user/profile", {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUser(data.user || data.data || null);
            } else {
                console.error("Address Profile Error:", data.message);
            }
        } catch (error) {
            console.error("Address Profile Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-lg text-gray-500">
                    Loading Addresses...
                </p>
            </div>
        );
    }

    return <AddressPage user={user} />;
}
