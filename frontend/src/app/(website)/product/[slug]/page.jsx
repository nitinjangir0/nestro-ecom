
import { notFound } from "next/navigation";

import { fetchProductBySlug } from "@/utils/api";
import { getProfile } from "@/utils/serverapi";

import ProductDetailsClient from "@/components/website/ProductDetailsClient";

export default async function ProductDetailsPage({ params }) {
    const { slug } = await params;

    const productResponse = await fetchProductBySlug(slug);

    if (!productResponse?.success || !productResponse?.data) {
        notFound();
    }

    const product = productResponse.data;

    let user = null;

    try {
        const profileResponse = await getProfile();

        user =
            profileResponse?.data ||
            profileResponse?.user ||
            null;
    } catch (error) {
        user = null;
    }

    return (
        <ProductDetailsClient
            product={product}
            user={user}
        />
    );
}