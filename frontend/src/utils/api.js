import { client } from "./helper";

export const fetchRooms = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();
        if (queryObject.status) {
            query.append("status", queryObject.status)
        }
        if (queryObject.limit) {
            query.append("limit", queryObject.limit)
        }
        const response = await client.get(`room-type?${query.toString()}`);

        return {
            success: response.data.success,
            data: response.data.rooms,
            message: response.data.message
        }

    } catch (error) {

        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }

    }
}

export const fetchRoomsById = async (id) => {
    try {
        const response = await client.get(`room-type/${id}`);


        return {
            success: response.data.success,
            data: response.data.rooms,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }

    }
}





//
export const fetchCategory = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();

        if (queryObject.status) {
            query.append("status", queryObject.status);
        }

        if (queryObject.limit) {
            query.append("limit", queryObject.limit);
        }

        const response = await client.get(
            `category?${query.toString()}`
        );

        console.log("CATEGORY API SUCCESS:", response.data);

        return {
            success: response.data.success,
            data: response.data.categories || [],
            message: response.data.message
        };

    } catch (error) {
        console.log("CATEGORY API ERROR:", {
            message: error.message,
            status: error?.response?.status,
            data: error?.response?.data,
        });

        return {
            success: false,
            data: [],
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Internal Server Error"
        };
    }
};

export const fetchcategoryById = async (id) => {
    try {
        const response = await client.get(`category/${id}`);

        return {
            success: response.data.success,
            data: response.data.category,
            message: response.data.message
        }

    } catch (error) {

        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }

    }
}




export const fetchProduct = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();

        if (queryObject.status !== undefined) {
            query.append("status", queryObject.status);
        }

        if (queryObject.limit) {
            query.append("limit", queryObject.limit);
        }

        if (queryObject.page) {
            query.append("page", queryObject.page);
        }

        if (queryObject.bestSeller !== undefined) {
            query.append("bestSeller", queryObject.bestSeller);
        }

        if (queryObject.roomtype) {
            if (Array.isArray(queryObject.roomtype)) {
                queryObject.roomtype.forEach((item) => {
                    query.append("roomtype", item);
                });
            } else {
                query.append("roomtype", queryObject.roomtype);
            }
        }

        if (queryObject.category) {
            if (Array.isArray(queryObject.category)) {
                queryObject.category.forEach((item) => {
                    query.append("category", item);
                });
            } else {
                query.append("category", queryObject.category);
            }
        }

        if (
            queryObject.min !== undefined &&
            queryObject.max !== undefined
        ) {
            query.append("min", queryObject.min);
            query.append("max", queryObject.max);
        }

        if (queryObject.sort) {
            query.append("sort", queryObject.sort);
        }

        const response = await client.get(
            `product?${query.toString()}`
        );

        return {
            success: response.data?.success ?? false,

            data: response.data?.products ?? [],

            meta: response.data?.meta ?? {
                limit: queryObject.limit || 6,
                total: 0,
                skip: 0,
                pages: 0,
                page: queryObject.page || 1,
            },

            message: response.data?.message ?? "",
        };
    } catch (error) {
        console.log(
            "PRODUCT API ERROR:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            data: [],

            meta: {
                limit: queryObject.limit || 6,
                total: 0,
                skip: 0,
                pages: 0,
                page: queryObject.page || 1,
            },

            message:
                error?.response?.data?.message ||
                error?.message ||
                "Internal Server Error",
        };
    }
};
export const fetchProductById = async (id) => {
    try {
        const response = await client.get(`product/${id}`);
        return {
            success: response.data.success,
            data: response.data.product,
            message: response.data.message
        }

    } catch (error) {

        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }

    }
}


export const fetchProductBySlug = async (slug) => {
    try {
        const response = await client.get(`product/slug/${slug}`);

        return {
            success: response.data.success,
            data: response.data.product,
            message: response.data.message
        };

    } catch (error) {

        console.log(
            "PRODUCT BY SLUG API ERROR:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            data: null,
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Product not found"
        };
    }
};



// ===============================
// WISHLIST
// ===============================

const wishlistRequest = async (path, method = "GET") => {
    try {
        const response = await fetch(`/api/wishlist${path}`, {
            method,
            credentials: "same-origin",
            cache: "no-store",
        });

        const data = await response.json();

        return {
            success: response.ok && data.success,
            message: data.message,
            isWishlisted: data.isWishlisted,
            wishlist: data.wishlist || [],
        };
    } catch (error) {
        console.error("Wishlist API Error:", error);

        return {
            success: false,
            message: "Unable to connect to wishlist service",
            isWishlisted: false,
            wishlist: [],
        };
    }
};

export const addToWishlist = async (productId) =>
    wishlistRequest(`/add/${encodeURIComponent(productId)}`, "POST");

export const removeFromWishlist = async (productId) =>
    wishlistRequest(`/remove/${encodeURIComponent(productId)}`, "DELETE");

export const checkWishlist = async (productId) =>
    wishlistRequest(`/check/${encodeURIComponent(productId)}`);

export const getWishlist = async () =>
    wishlistRequest("");

