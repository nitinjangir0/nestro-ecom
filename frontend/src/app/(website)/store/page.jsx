
import Link from "next/link";

import ProductCard from "@/components/website/ProductCard";
import ProductHeader from "@/components/website/ProductHeader";

import {
    fetchProduct,
    fetchRooms,
    fetchCategory,
} from "@/utils/api";

import { getProfile } from "@/utils/serverapi";

export default async function Page({ searchParams }) {
    const params = await searchParams;

    const roomtype = params.roomtype || [];
    const category = params.category || [];
    const min = params.min || 800;
    const max = params.max || 50000;
    const sort = params.sort || "";

    // Current page
    const currentPage = Math.max(
        Number(params.page) || 1,
        1
    );

    // Only 6 products per page
    const limit = 6;

    const products = await fetchProduct({
        roomtype,
        category,
        min,
        max,
        sort,
        page: currentPage,
        limit,
    });

    const rooms = await fetchRooms({
        status: true,
    });

    const categories = await fetchCategory();

    const getMe = await getProfile();

    const user = getMe?.success
        ? getMe.data
        : null;

    const productList = products?.data || [];

    const totalProducts = Number(
        products?.meta?.total || 0
    );

    const totalPages = Math.ceil(
        totalProducts / limit
    );

    // Preserve active filters while changing page
    const createPageUrl = (pageNumber) => {
        const query = new URLSearchParams();

        if (roomtype?.length) {
            if (Array.isArray(roomtype)) {
                roomtype.forEach((item) => {
                    query.append("roomtype", item);
                });
            } else {
                query.set("roomtype", roomtype);
            }
        }

        if (category?.length) {
            if (Array.isArray(category)) {
                category.forEach((item) => {
                    query.append("category", item);
                });
            } else {
                query.set("category", category);
            }
        }

        if (min) {
            query.set("min", min);
        }

        if (max) {
            query.set("max", max);
        }

        if (sort) {
            query.set("sort", sort);
        }

        query.set("page", pageNumber);

        return `/store?${query.toString()}`;
    };

    return (
        <div className="space-y-8">
            <ProductHeader
                rooms={rooms?.data || []}
                categories={categories?.data || []}
                total={totalProducts}
            />

            {/* Products */}
            {productList.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {productList.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            user={user}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-[#e8e1da] bg-white px-5 py-16 text-center">
                    <h2 className="text-xl font-semibold text-[#3b3028]">
                        No products found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Try changing your filters to find more products.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pb-8">
                    {/* Previous */}
                    {currentPage > 1 ? (
                        <Link
                            href={createPageUrl(currentPage - 1)}
                            className="flex h-10 items-center justify-center rounded-lg border border-[#ded5cc] bg-white px-4 text-sm font-semibold text-[#7a4e2d] transition hover:border-[#7a4e2d] hover:bg-[#f8f3ee]"
                        >
                            ← Previous
                        </Link>
                    ) : (
                        <span className="flex h-10 cursor-not-allowed items-center justify-center rounded-lg border border-[#eee8e2] bg-[#f5f2ef] px-4 text-sm font-semibold text-gray-400">
                            ← Previous
                        </span>
                    )}

                    {/* Page Numbers */}
                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((pageNumber) => (
                        <Link
                            key={pageNumber}
                            href={createPageUrl(pageNumber)}
                            className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                                currentPage === pageNumber
                                    ? "border-[#7a4e2d] bg-[#7a4e2d] text-white"
                                    : "border-[#ded5cc] bg-white text-[#7a4e2d] hover:border-[#7a4e2d] hover:bg-[#f8f3ee]"
                            }`}
                        >
                            {pageNumber}
                        </Link>
                    ))}

                    {/* Next */}
                    {currentPage < totalPages ? (
                        <Link
                            href={createPageUrl(currentPage + 1)}
                            className="flex h-10 items-center justify-center rounded-lg border border-[#ded5cc] bg-white px-4 text-sm font-semibold text-[#7a4e2d] transition hover:border-[#7a4e2d] hover:bg-[#f8f3ee]"
                        >
                            Next →
                        </Link>
                    ) : (
                        <span className="flex h-10 cursor-not-allowed items-center justify-center rounded-lg border border-[#eee8e2] bg-[#f5f2ef] px-4 text-sm font-semibold text-gray-400">
                            Next →
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}