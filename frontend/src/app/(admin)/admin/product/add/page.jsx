"use client";

import { client, generateSlug } from "@/utils/helper";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Editor } from "primereact/editor";
import { FiSave, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchCategory, fetchRooms } from "@/utils/api";


const Select = dynamic(
    () => import("react-select"),
    {
        ssr: false,
        loading: () => (
            <div className="border border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-gray-400">
                Loading...
            </div>
        ),
    }
);

export default function AddProductPage() {
    const router = useRouter();

    const [rooms, setRooms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [wait, setWait] = useState(false);

    const [formData, setFormData] = useState({
        roomId: "",
        categoryId: "",
        name: "",
        slug: "",
        originalPrice: "",
        salePrice: "",
        discount: "",
        shortDescription: "",
        description: "",
        material: "",
        color: "",
        width: "",
        height: "",
        depth: "",
        weight: "",
        seoTitle: "",
        seoDescription: "",
        image: null,

        // Product status
        featured: false,
        bestSeller: false,
        newArrival: false,
        stock: true,
        status: true,
    });

    // ==========================================
    // NAME + SLUG
    // ==========================================

    const handleNameChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: generateSlug(value),
        }));
    };

    // ==========================================
    // NORMAL INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // THUMBNAIL
    // ==========================================

    const handleImage = (e) => {
        const file = e.target.files?.[0] || null;

        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    // ==========================================
    // LOAD ROOMS + CATEGORIES
    // ==========================================

    useEffect(() => {
        const getData = async () => {
            try {
                const [roomResponse, categoryResponse] =
                    await Promise.all([
                        fetchRooms(),
                        fetchCategory(),
                    ]);

                setRooms(roomResponse.data || []);
                setCategories(categoryResponse.data || []);
            } catch (error) {
                console.log(error);

                toast.error(
                    "Unable to load rooms and categories"
                );
            }
        };

        getData();
    }, []);

    // ==========================================
    // AUTO DISCOUNT
    // ==========================================

    useEffect(() => {
        const originalPrice = Number(formData.originalPrice);
        const salePrice = Number(formData.salePrice);

        if (
            originalPrice > 0 &&
            salePrice >= 0 &&
            salePrice <= originalPrice
        ) {
            const discount = Math.round(
                ((originalPrice - salePrice) / originalPrice) * 100
            );

            setFormData((prev) => ({
                ...prev,
                discount,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                discount: "",
            }));
        }
    }, [
        formData.originalPrice,
        formData.salePrice,
    ]);

    // ==========================================
    // SUBMIT CREATE PRODUCT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.roomId) {
            toast.error("Please select a room");
            return;
        }

        if (!formData.categoryId) {
            toast.error("Please select a category");
            return;
        }

        if (!formData.name.trim()) {
            toast.error("Please enter product name");
            return;
        }

        if (!formData.originalPrice) {
            toast.error("Please enter original price");
            return;
        }

        if (!formData.salePrice) {
            toast.error("Please enter sale price");
            return;
        }

        if (!formData.image) {
            toast.error("Please select product thumbnail");
            return;
        }

        try {
            setWait(true);

            const sendData = new FormData();

            sendData.append("roomId", formData.roomId);
            sendData.append("categoryId", formData.categoryId);
            sendData.append("name", formData.name);
            sendData.append("slug", formData.slug);
            sendData.append(
                "originalPrice",
                formData.originalPrice
            );
            sendData.append(
                "salePrice",
                formData.salePrice
            );
            sendData.append(
                "discount",
                formData.discount
            );
            sendData.append(
                "shortDescription",
                formData.shortDescription
            );
            sendData.append(
                "description",
                formData.description
            );
            sendData.append(
                "material",
                formData.material
            );
            sendData.append(
                "color",
                formData.color
            );
            sendData.append(
                "weight",
                formData.weight
            );

            sendData.append(
                "width",
                formData.width
            );

            sendData.append(
                "height",
                formData.height
            );

            sendData.append(
                "depth",
                formData.depth
            );

            sendData.append(
                "seoTitle",
                formData.seoTitle
            );

            sendData.append(
                "seoDescription",
                formData.seoDescription
            );

            // Product flags
            sendData.append(
                "featured",
                formData.featured
            );

            sendData.append(
                "bestSeller",
                formData.bestSeller
            );

            sendData.append(
                "newArrival",
                formData.newArrival
            );

            sendData.append(
                "stock",
                formData.stock
            );

            sendData.append(
                "status",
                formData.status
            );

            // Thumbnail
            sendData.append(
                "image",
                formData.image
            );

            // ==================================
            // CREATE PRODUCT
            // ==================================

            const response = await client.post(
                "product/create",
                sendData
            );

            if (response.data.success) {
                toast.success(
                    response.data.message ||
                    "Product created successfully"
                );

                router.push("/admin/product");
                router.refresh();
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to create product"
            );
        } finally {
            setWait(false);
        }
    };

    // ==========================================
    // SELECT OPTIONS
    // ==========================================

    const roomOptions = rooms.map((room) => ({
        value: room._id,
        label: room.name,
    }));

    const categoryOptions = categories.map((category) => ({
        value: category._id,
        label: category.name,
    }));

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen mx-auto bg-[#f7f8fd] p-6">

            <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">

                {/* Header */}

                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">

                    <FiTag size={18} />

                    <h2 className="text-[15px] font-semibold">
                        Add Product
                    </h2>

                </div>

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="p-5 space-y-5"
                >

                    {/* ===============================
                        BASIC INFORMATION
                    =============================== */}

                    <div className="grid md:grid-cols-2 gap-5">

                        <div className="flex flex-col gap-1.5">

                            <label className="text-xs font-semibold text-[#2a3460]">
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) =>
                                    handleNameChange(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter product name"
                                className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 outline-none focus:border-[#3b497e]"
                            />

                        </div>

                        <div className="flex flex-col gap-1.5">

                            <label className="text-xs font-semibold text-[#2a3460]">
                                Slug
                            </label>

                            <input
                                type="text"
                                value={formData.slug}
                                readOnly
                                className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 bg-gray-50"
                            />

                        </div>

                    </div>

                    {/* ===============================
                        ROOM + CATEGORY
                    =============================== */}

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>

                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">
                                Room *
                            </label>

                            <Select
                                options={roomOptions}
                                value={
                                    roomOptions.find(
                                        (item) =>
                                            item.value ===
                                            formData.roomId
                                    ) || null
                                }
                                onChange={(selected) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        roomId:
                                            selected?.value || "",
                                    }))
                                }
                                placeholder="Select room"
                            />

                        </div>

                        <div>

                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">
                                Category *
                            </label>

                            <Select
                                options={categoryOptions}
                                value={
                                    categoryOptions.find(
                                        (item) =>
                                            item.value ===
                                            formData.categoryId
                                    ) || null
                                }
                                onChange={(selected) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        categoryId:
                                            selected?.value || "",
                                    }))
                                }
                                placeholder="Select category"
                            />

                        </div>

                    </div>

                    {/* ===============================
                        PRICE
                    =============================== */}

                    <div className="grid md:grid-cols-3 gap-5">

                        <input
                            type="number"
                            name="originalPrice"
                            placeholder="Original Price"
                            value={formData.originalPrice}
                            onChange={handleChange}
                            min="0"
                            className="border rounded-xl px-4 py-3 outline-none"
                        />

                        <input
                            type="number"
                            name="salePrice"
                            placeholder="Sale Price"
                            value={formData.salePrice}
                            onChange={handleChange}
                            min="0"
                            className="border rounded-xl px-4 py-3 outline-none"
                        />

                        <input
                            type="number"
                            name="discount"
                            placeholder="Discount %"
                            value={formData.discount}
                            readOnly
                            className="border rounded-xl px-4 py-3 bg-gray-50"
                        />

                    </div>

                    {/* ===============================
                        MATERIAL / COLOR / WEIGHT
                    =============================== */}

                    <div className="grid md:grid-cols-3 gap-5">

                        <input
                            type="text"
                            name="material"
                            placeholder="Material"
                            value={formData.material}
                            onChange={handleChange}
                            className="border rounded-xl px-4 py-3 outline-none"
                        />

                        <input
                            type="text"
                            name="color"
                            placeholder="Color"
                            value={formData.color}
                            onChange={handleChange}
                            className="border rounded-xl px-4 py-3 outline-none"
                        />

                        <input
                            type="number"
                            name="weight"
                            placeholder="Weight (KG)"
                            value={formData.weight}
                            onChange={handleChange}
                            className="border rounded-xl px-4 py-3 outline-none"
                        />

                    </div>

                    {/* ===============================
                        DIMENSIONS
                    =============================== */}

                    <div>

                        <label className="text-xs font-semibold text-[#2a3460] block mb-2">
                            Dimensions
                        </label>

                        <div className="grid md:grid-cols-3 gap-5">

                            <input
                                type="number"
                                name="width"
                                placeholder="Width"
                                value={formData.width}
                                onChange={handleChange}
                                className="border rounded-xl px-4 py-3 outline-none"
                            />

                            <input
                                type="number"
                                name="height"
                                placeholder="Height"
                                value={formData.height}
                                onChange={handleChange}
                                className="border rounded-xl px-4 py-3 outline-none"
                            />

                            <input
                                type="number"
                                name="depth"
                                placeholder="Depth"
                                value={formData.depth}
                                onChange={handleChange}
                                className="border rounded-xl px-4 py-3 outline-none"
                            />

                        </div>

                    </div>

                    {/* ===============================
                        SHORT DESCRIPTION
                    =============================== */}

                    <textarea
                        name="shortDescription"
                        placeholder="Short Description"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        rows={4}
                        className="border rounded-xl w-full px-4 py-3 outline-none"
                    />

                    {/* ===============================
                        DESCRIPTION
                    =============================== */}

                    <div className="border rounded-xl overflow-hidden">

                        <Editor
                            value={formData.description}
                            onTextChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    description:
                                        e.htmlValue || "",
                                }));
                            }}
                        />

                    </div>

                    {/* ===============================
                        SEO
                    =============================== */}

                    <div className="grid md:grid-cols-2 gap-5">

                        <input
                            type="text"
                            name="seoTitle"
                            placeholder="SEO Title"
                            value={formData.seoTitle}
                            onChange={handleChange}
                            className="border rounded-xl px-4 py-3 outline-none"
                        />

                        <textarea
                            name="seoDescription"
                            placeholder="SEO Description"
                            value={formData.seoDescription}
                            onChange={handleChange}
                            rows={3}
                            className="border rounded-xl px-4 py-3 outline-none"
                        />

                    </div>

                    {/* ===============================
                        THUMBNAIL
                    =============================== */}

                    <div className="flex flex-col gap-2">

                        <label className="text-xs font-semibold text-[#2a3460]">
                            Product Thumbnail *
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm"
                        />

                        {formData.image && (
                            <div className="mt-2">

                                <img
                                    src={URL.createObjectURL(
                                        formData.image
                                    )}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-xl object-cover border"
                                />

                            </div>
                        )}

                    </div>

                    {/* ===============================
                        PRODUCT SETTINGS
                    =============================== */}

                    <div className="border rounded-xl p-4">

                        <h3 className="text-sm font-semibold text-[#2a3460] mb-4">
                            Product Settings
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            featured:
                                                e.target.checked,
                                        }))
                                    }
                                />

                                <span className="text-sm">
                                    Featured Product
                                </span>

                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={formData.bestSeller}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            bestSeller:
                                                e.target.checked,
                                        }))
                                    }
                                />

                                <span className="text-sm">
                                    Best Seller
                                </span>

                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={formData.newArrival}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            newArrival:
                                                e.target.checked,
                                        }))
                                    }
                                />

                                <span className="text-sm">
                                    New Arrival
                                </span>

                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={formData.stock}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            stock:
                                                e.target.checked,
                                        }))
                                    }
                                />

                                <span className="text-sm">
                                    In Stock
                                </span>

                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={formData.status}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            status:
                                                e.target.checked,
                                        }))
                                    }
                                />

                                <span className="text-sm">
                                    Active Product
                                </span>

                            </label>

                        </div>

                    </div>

                    {/* ===============================
                        BUTTONS
                    =============================== */}

                    <div className="flex items-center justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/admin/product")
                            }
                            className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb]"
                        >
                            Cancel
                        </button>

                        {!wait ? (
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md"
                            >
                                <FiSave size={16} />

                                Create Product
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="bg-gray-400 text-white px-5 py-2.5 rounded-xl"
                            >
                                Creating...
                            </button>
                        )}

                    </div>

                </form>

            </div>

        </div>
    );
}