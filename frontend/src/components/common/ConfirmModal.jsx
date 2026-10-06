"use client";

import React from "react";
import { Trash2, X } from "lucide-react";

export default function ConfirmModal({
    open,
    title = "Confirm Action",
    message = "Are you sure?",
    confirmText = "Delete",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-white rounded-2xl shadow-2xl w-[92%] max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}

                <div className="flex items-center justify-between px-6 py-4 border-b">

                    <h2 className="text-xl font-bold text-gray-800">
                        {title}
                    </h2>

                    <button
                        onClick={onCancel}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="px-6 py-8 flex flex-col items-center">

                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">

                        <Trash2
                            size={32}
                            className="text-red-600"
                        />

                    </div>

                    <p className="text-gray-600 text-center mt-5 leading-7">

                        {message}

                    </p>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 px-6 py-4 border-t">

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading ? "Deleting..." : confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
}