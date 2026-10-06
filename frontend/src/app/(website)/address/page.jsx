"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/utils/helper";
import AddressPage from "@/components/website/profile/AddressPage";
export default function Page() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const getProfile = async () => {
        try {
            const response = await client.get("/user/profile");
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log(error);
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
    return (
        <AddressPage
        user={user}
        />
    );
}