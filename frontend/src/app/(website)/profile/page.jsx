"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/utils/helper";

import ProfileCard from "@/components/website/ProfileCard";
import ProfileMenu from "@/components/website/ProfileMenu";

export default function ProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const getUserProfile = async () => {
            try {
                const response = await client.get("user/profile");

                if (!response.data.success || !response.data.user) {
                    router.replace("/login");
                    return;
                }

                if (!active) return;

                const profileUser = response.data.user;
                const role = profileUser.role?.toLowerCase();

                const isAdmin =
                    role === "admin" ||
                    role === "superadmin";

                const profileMenus = response.data.menu || [];

                const updatedMenus = isAdmin
                    ? [
                          ...profileMenus.filter(
                              (menu) => menu.id !== "admin-panel"
                          ),
                          {
                              id: "admin-panel",
                              title: "Admin Panel",
                              href: "/admin",
                              icon: "LayoutDashboard",
                          },
                      ]
                    : profileMenus;

                setUser(profileUser);
                setMenus(updatedMenus);
            } catch (error) {
                console.error(
                    "Profile API Error:",
                    error?.response?.data || error.message
                );

                if (active) {
                    router.replace("/login");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        getUserProfile();

        return () => {
            active = false;
        };
    }, [router]);

    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
                <p className="text-gray-500">Loading profile...</p>
            </section>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <section className="bg-[#FAF8F6] min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <aside className="lg:col-span-3">
                        <div className="sticky top-24">
                            <ProfileMenu menus={menus} />
                        </div>
                    </aside>

                    <main className="lg:col-span-9">
                        <ProfileCard user={user} />
                    </main>
                </div>
            </div>
        </section>
    );
}