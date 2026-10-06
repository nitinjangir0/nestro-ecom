"use client";

import { client, generateSlug } from "@/utils/helper";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Editor } from "primereact/editor";
import { FiSave, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import { fetchRooms, fetchCategory, fetchProductById, } from "@/utils/api";

export default function EditProductPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [wait, setWait] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [categories, setCategories] = useState([]);
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
        oldImage: ""

    });

    // Name
    const handleNameChange = (value) => {

        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: generateSlug(value)
        }));

    };

    // Inputs
    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };

    // Image
    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            image: file
        }));

    };

    // Fetch Dropdowns
    useEffect(() => {

        async function loadData() {

            try {

                const roomRes =
                    await fetchRooms();

                const categoryRes =
                    await fetchCategory();

                setRooms(roomRes.data);

                setCategories(categoryRes.data);

            } catch (error) {

                console.log(error);

            }

        }

        loadData();

    }, []);



    // Fetch Product
    useEffect(() => {

        if (!id) return;

        async function getProduct() {

            try {

                const response = await fetchProductById(id);
                if (response.success) {
                    const product = response.data;
                    console.log(product);

                    setFormData({

                        roomId:
                            product.roomId?._id || "",

                        categoryId:
                            product.categoryId?._id || "",

                        name:
                            product.name || "",

                        slug:
                            product.slug || "",

                        originalPrice:
                            product.originalPrice || "",

                        salePrice:
                            product.salePrice || "",

                        discount:
                            product.discount || "",

                        shortDescription:
                            product.shortDescription || "",

                        description:
                            product.description || "",

                        material:
                            product.material || "",

                        color:
                            product.color || "",

                        width:
                            product.dimensions?.width || "",

                        height:
                            product.dimensions?.height || "",

                        depth:
                            product.dimensions?.depth || "",

                        weight:
                            product.weight || "",

                        seoTitle:
                            product.seoTitle || "",

                        seoDescription:
                            product.seoDescription || "",

                        image: null,

                        oldImage:
                            product.thumbnail || ""

                    });

                }

            } catch (error) {

                toast.error(
                    "Unable to fetch Product"
                );

            }

        }

        getProduct();

    }, [id]);




    // Auto Discount
    useEffect(() => {

        const originalPrice = Number(formData.originalPrice);

        const salePrice = Number(formData.salePrice);

        if (
            originalPrice > 0 &&
            salePrice >= 0 &&
            salePrice <= originalPrice
        ) {

            const discount = Math.round(
                ((originalPrice - salePrice) /
                    originalPrice) * 100
            );

            setFormData(prev => ({
                ...prev,
                discount
            }));

        } else {

            setFormData(prev => ({
                ...prev,
                discount: ""
            }));

        }

    }, [
        formData.originalPrice,
        formData.salePrice
    ]);

    // Submit

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setWait(true);

            const sendData = new FormData();

            sendData.append(
                "roomId",
                formData.roomId
            );

            sendData.append(
                "categoryId",
                formData.categoryId
            );

            sendData.append(
                "name",
                formData.name
            );

            sendData.append(
                "slug",
                formData.slug
            );

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

            if (formData.image) {

                sendData.append(
                    "image",
                    formData.image
                );

            }

            const response =
                await client.put(
                    `product/update/${id}`,
                    sendData
                );

            if (response.data.success) {

                toast.success(
                    response.data.message
                );

                router.push(
                    "/admin/product"
                );

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Internal Server Error"
            );

        } finally {

            setWait(false);

        }

    };

    return (

        <div className="min-h-screen bg-[#f7f8fd] p-4">

            <div className="max-w-6xl mx-auto">

                <div className="mb-5">

                    <h1 className="text-2xl font-bold text-[#2a3460]">

                        Edit Product

                    </h1>

                </div>

                <div className="bg-white rounded-2xl shadow border overflow-hidden">
                    <div className="bg-[#3b497e] text-white px-4 py-2 flex items-center gap-2">
                        <FiTag />
                        <h2 className="font-semibold">
                            Product Information
                        </h2>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="p-3 space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleNameChange(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:border-[#3b497e]"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    readOnly
                                    className="w-full border rounded-xl px-4 py-3 bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Room & Category */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Room
                                </label>
                                <Select
                                    value={rooms
                                        .map(room => ({
                                            value: room._id,
                                            label: room.name
                                        }))
                                        .find(
                                            item =>
                                                item.value ===
                                                formData.roomId
                                        )}
                                    options={rooms.map(room => ({
                                        value: room._id,
                                        label: room.name
                                    }))}
                                    onChange={(selected) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            roomId:
                                                selected.value
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Category
                                </label>
                                <Select
                                    value={categories
                                        .map(category => ({
                                            value: category._id,
                                            label: category.name
                                        }))
                                        .find(
                                            item =>
                                                item.value ===
                                                formData.categoryId
                                        )}
                                    options={categories.map(category => ({
                                        value: category._id,
                                        label: category.name
                                    }))}
                                    onChange={(selected) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            categoryId:
                                                selected.value
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        {/* Prices */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700">
                                    Original Price
                                </label>

                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700">
                                    Sale Price
                                </label>

                                <input
                                    type="number"
                                    name="salePrice"
                                    value={formData.salePrice}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700">
                                    Discount %
                                </label>

                                <input
                                    type="text"
                                    value={formData.discount}
                                    readOnly
                                    className="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm"
                                />
                            </div>

                        </div>

                        {/* Material */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Material */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Material
                                </label>

                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    placeholder="Enter Material"
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e]"
                                />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Color
                                </label>

                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="Enter Color"
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e]"
                                />
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Weight (kg)
                                </label>

                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="Enter Weight"
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e]"
                                />
                            </div>

                        </div>

                        {/* Dimensions */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Width */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Width (cm)
                                </label>

                                <input
                                    type="number"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleChange}
                                    placeholder="Enter Width"
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e]"
                                />
                            </div>

                            {/* Height */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Height (cm)
                                </label>

                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="Enter Height"
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e]"
                                />
                            </div>

                            {/* Depth */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Depth (cm)
                                </label>

                                <input
                                    type="number"
                                    name="depth"
                                    value={formData.depth}
                                    onChange={handleChange}
                                    placeholder="Enter Depth"
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e]"
                                />
                            </div>
                        </div>

                        {/* Short Description & Description */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            {/* Short Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Short Description
                                </label>

                                <textarea
                                    rows={5}
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                    placeholder="Enter short description..."
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none outline-none focus:border-[#3b497e]"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Product Description
                                </label>

                                <div className="rounded-lg border border-gray-300 overflow-hidden">
                                    <Editor
                                        value={formData.description}
                                        onTextChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                description: e.htmlValue
                                            }))
                                        }
                                        style={{
                                            height: "130px"
                                        }}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* SEO Section */}
                        {/* SEO Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* SEO Title */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    SEO Title
                                </label>

                                <input
                                    type="text"
                                    name="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={handleChange}
                                    placeholder="Enter SEO Title"
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#3b497e] focus:ring-1 focus:ring-[#3b497e]"
                                />
                            </div>

                            {/* SEO Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    SEO Description
                                </label>

                                <textarea
                                    rows={2}
                                    name="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={handleChange}
                                    placeholder="Enter SEO Description"
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none outline-none focus:border-[#3b497e] focus:ring-1 focus:ring-[#3b497e]"
                                />
                            </div>

                        </div>

                        {/* Product Thumbnail */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-3">
                                Product Thumbnail
                            </label>

                            <div className="flex items-center gap-5 rounded-xl border border-gray-200 p-4 bg-gray-50">

                                {/* Image Preview */}
                                <div className="flex-shrink-0">
                                    {formData.image ? (
                                        <img
                                            src={URL.createObjectURL(formData.image)}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-xl object-cover border border-gray-300 shadow-sm"
                                        />
                                    ) : formData.oldImage ? (
                                        <img
                                            src={formData.oldImage}
                                            alt="Thumbnail"
                                            className="w-24 h-24 rounded-xl object-cover border border-gray-300 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Upload Section */}
                                <div className="flex-1">

                                    <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#3b497e] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d3967] transition">
                                        📷 Choose New Image

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImage}
                                            className="hidden"
                                        />
                                    </label>

                                    <p className="mt-2 text-xs text-gray-600">
                                        Upload JPG, PNG or WEBP image
                                    </p>

                                    <p className="text-[11px] text-gray-400 mt-1">
                                        Maximum file size: 2 MB
                                    </p>

                                    {formData.image && (
                                        <p className="mt-2 text-xs text-green-600 font-medium">
                                            ✓ New image selected
                                        </p>
                                    )}

                                </div>

                            </div>
                        </div>
                        {/* Buttons */}

                        {/* Action Buttons */}
                        <div className="flex justify-end items-center gap-3 pt-6 border-t border-gray-200">

                            {/* Cancel Button */}
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex items-center justify-center h-11 px-6 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 hover:shadow-md active:scale-95"
                            >
                                Cancel
                            </button>

                            {/* Update Button */}
                            <button
                                type="submit"
                                disabled={wait}
                                className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[#3b497e] text-white text-sm font-semibold shadow-md transition-all duration-300 hover:bg-[#2d3967] hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                <FiSave className="text-base" />

                                {wait ? "Updating Product..." : "Update Product"}
                            </button>

                        </div>
                    </form>

                </div>

            </div>

        </div>

    );

}