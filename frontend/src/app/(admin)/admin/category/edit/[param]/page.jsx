"use client";

import { client, generateSlug } from "@/utils/helper.js";
import { use, useEffect, useState } from "react";
import { FiSave, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchcategoryById } from "@/utils/api";

export default function EditCategoryPage({ params }) {
    const { param } = use(params);
    const router = useRouter();
    
    const [wait, setWait] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: null,
        oldImage: "",
    });

    useEffect(() => {
        if (!param) return;
        const getCategory = async () => {
            const response = await fetchcategoryById(param);
            if (response?.success) {
                setFormData({
                    name: response.data.name,
                    slug: response.data.slug,
                    image: null,
                    oldImage: response.data.image,
                });
            }
        };
        getCategory();
    }, [param]);

    const handleNameChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: generateSlug(value),
        }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setWait(true);

        try {
            const sendData = new FormData();
            sendData.append("name", formData.name);
            sendData.append("slug", formData.slug);
            
            if (formData.image) {
                sendData.append("image", formData.image);
            }

            // Updated: PUT request with FormData
            const response = await client.put(
                `category/update/${param}`,
                sendData
            );

            if (response.data.success) {
                toast.success(response.data.message || "Category updated successfully");
                router.push("/admin/category");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update category");
        } finally {
            setWait(false);
        }
    };

    return (
        <div className="min-h-screen mx-auto bg-[#f7f8fd] p-6">
            <div className="mb-6 mx-auto w-2xl">
                <h1 className="text-2xl font-semibold text-[#2a3460]">Edit Category</h1>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-2xl border shadow-md overflow-hidden">
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">
                    <FiTag size={18} />
                    <h2 className="text-[15px] font-semibold">Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold">Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b497e]"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold">Slug *</label>
                        <input
                            type="text"
                            value={formData.slug}
                            readOnly
                            className="border bg-gray-50 rounded-xl px-4 py-3 text-sm font-mono"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold">Image</label>
                        <input type="file" accept="image/*" onChange={handleImage} className="border rounded-xl px-4 py-2 text-sm" />
                        
                        <div className="mt-2">
                            {formData.image ? (
                                <img src={URL.createObjectURL(formData.image)} alt="preview" className="w-28 h-28 rounded-xl object-cover border" />
                            ) : formData.oldImage ? (
                                <img src={formData.oldImage} alt="existing" className="w-28 h-28 rounded-xl object-cover border" />
                            ) : null}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl border text-sm">Cancel</button>
                        <button type="submit" disabled={wait} className="bg-[#3b497e] text-white rounded-xl px-5 py-2.5 text-sm font-semibold">
                            {wait ? "Updating..." : "Save Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}