"use client";

import { CircleUser, Mail, Phone, ShieldCheck } from "lucide-react";

export default function ProfileCard({ user }) {
    return (
        <div className="overflow-hidden rounded-3xl border border-[#E8DDD4] bg-white shadow-sm transition-all duration-300 hover:shadow-lg">

            {/* Top Banner */}
            <div className="h-20 bg-gradient-to-r from-[#2F221B] via-[#4A352A] to-[#A66A43]" />

            <div className="relative px-6 pb-6">

                {/* Avatar */}
                <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#A66A43] text-3xl font-bold uppercase text-white shadow-md">

                            {user?.name
                                ? user.name.charAt(0)
                                : <CircleUser size={34} />}

                        </div>

                        <div>

                            <h2 className="text-2xl text-amber-50 font-bold text-[#2F221B]">
                                {user?.name}
                            </h2>

                            <p className="mt-1 text-sm text-[#8B7565]">
                                Welcome Back 👋
                            </p>

                        </div>

                    </div>

                    <span className="rounded-full bg-[#F5E8DD] px-4 py-2 text-sm font-semibold capitalize text-[#A66A43]">
                        {user?.role}
                    </span>

                </div>

                {/* Details */}

                <div className="mt-8 grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border border-[#EFE4DB] bg-[#FCFAF8] p-5 transition-all duration-300 hover:border-[#A66A43] hover:bg-[#F8F3EF]">

                        <div className="mb-3 flex items-center gap-2 text-[#A66A43]">
                            <Mail size={18} />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Email
                            </span>
                        </div>

                        <p className="truncate text-sm font-medium text-[#2F221B]">
                            {user?.email}
                        </p>

                    </div>

                    <div className="rounded-2xl border border-[#EFE4DB] bg-[#FCFAF8] p-5 transition-all duration-300 hover:border-[#A66A43] hover:bg-[#F8F3EF]">

                        <div className="mb-3 flex items-center gap-2 text-[#A66A43]">
                            <Phone size={18} />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Phone
                            </span>
                        </div>

                        <p className="text-sm font-medium text-[#2F221B]">
                            {user?.phone || "Not Added"}
                        </p>

                    </div>

                    <div className="rounded-2xl border border-[#EFE4DB] bg-[#FCFAF8] p-5 transition-all duration-300 hover:border-[#A66A43] hover:bg-[#F8F3EF]">

                        <div className="mb-3 flex items-center gap-2 text-[#A66A43]">
                            <ShieldCheck size={18} />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Account
                            </span>
                        </div>

                        <p className="text-sm font-medium capitalize text-[#2F221B]">
                            {user?.role}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}