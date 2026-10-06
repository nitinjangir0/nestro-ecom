"use client";

import { useEffect, useState } from "react";
import { fetchProductById } from "@/utils/api";
import { client } from "@/utils/helper";
import { toast } from "sonner";

export default function ProductDetailsModal() {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [product, setProduct] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      setProductId(event.detail.id);
      setOpen(true);
    };
    window.addEventListener("open-product-details", handler);
    return () => window.removeEventListener("open-product-details", handler);
  }, []);

  useEffect(() => {
    if (!productId) return;
    const getProduct = async () => {
      const response = await fetchProductById(productId);
      if (response.success) setProduct(response.data);
    };
    getProduct();
  }, [productId]);

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (files.length === 0) return toast.error("Please select images");
    
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await client.post(`product/add-multiple-images/${productId}`, formData);
      toast.success(response.data.message);
      setFiles([]);

      const updatedProduct = await fetchProductById(productId);
      if (updatedProduct.success) setProduct(updatedProduct.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
        </div>

        <div className="mt-4 max-h-[70vh] overflow-y-auto">
          {product ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">Category: {product?.categoryId?.name}</p>
                <div className="flex gap-4 mt-2 font-semibold">
                  <span className="text-green-600">Sale: {product.salePrice}</span>
                  <span className="text-gray-400 line-through">MRP: {product.originalPrice}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Current Images</h4>
                <div className="flex flex-wrap gap-2">
                  {product?.images?.map((img, index) => (
                    <img key={index} src={img} className="h-20 w-20 rounded-lg border object-cover" />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold mb-2">Add More Images</label>
                <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} className="w-full text-sm border p-2 rounded-lg" />
              </div>

              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((file, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(file)} className="h-20 w-20 rounded-lg border object-cover" />
                      <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={uploadImages}
                disabled={uploading}
                className="w-full mt-4 rounded-lg bg-green-600 px-4 py-3 text-white font-bold hover:bg-green-700 disabled:bg-gray-400"
              >
                {uploading ? "Uploading..." : "Upload Selected Images"}
              </button>
            </div>
          ) : (
            <p className="text-center py-10">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}