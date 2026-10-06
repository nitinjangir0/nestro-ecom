"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {User,ShoppingBag,Heart,MapPin,Lock,LogOut,LayoutDashboard,} from "lucide-react";
const iconMap = {User,ShoppingBag,Heart,MapPin,Lock,LogOut,LayoutDashboard,};

export default function ProfileMenu({ menus = [] }) {
    const pathname = usePathname();

    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(166,106,67,0.12)]">

            {/* Heading */}

            <div className="border-b border-[#F3E7DD] px-6 py-5">
                <h3 className="text-lg font-semibold text-[#2F221B]">
                    My Account
                </h3>

                <p className="mt-1 text-sm text-[#8A7667]">
                    Manage your account
                </p>
            </div>

            {/* Menu */}

            <div className="p-3">

                {menus.map((item) => {
                    const Icon = iconMap[item.icon];
                    const active = pathname === item.href;
                    const logout = item.title === "Logout";

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`group mb-2 flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300
                            ${
                                active
                                    ? "bg-[#F5E8DD] text-[#A66A43]"
                                    : "text-[#4A352A] hover:bg-[#F8F3EF] hover:text-[#A66A43]"
                            }
                            ${logout ? "hover:bg-red-50 hover:text-red-600" : ""}
                            `}
                        >
                            <div className="flex items-center gap-3">

                                <Icon
                                    size={19}
                                    className={`transition-all
                                    ${
                                        active
                                            ? "text-[#A66A43]"
                                            : "text-[#7C6556] group-hover:text-[#A66A43]"
                                    }
                                    `}
                                />

                                <span className="text-[15px] font-medium">
                                    {item.title}
                                </span>

                            </div>

                            {active && (
                                <div className="h-2 w-2 rounded-full bg-[#A66A43]" />
                            )}

                        </Link>
                    );
                })}

            </div>
        </div>
    );
}