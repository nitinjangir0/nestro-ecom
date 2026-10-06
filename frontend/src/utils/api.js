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

export const addToWishlist = async (productId) => {
    try {

        const response = await client.post(
            `wishlist/add/${productId}`
        );

        return {
            success: response.data.success,
            message: response.data.message,
            isWishlisted: response.data.isWishlisted,
        };

    } catch (error) {

        console.log(
            "Add Wishlist Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "Internal Server Error",
            isWishlisted: false,
        };
    }
};


export const removeFromWishlist = async (productId) => {
    try {

        const response = await client.delete(
            `wishlist/remove/${productId}`
        );

        return {
            success: response.data.success,
            message: response.data.message,
            isWishlisted: response.data.isWishlisted,
        };

    } catch (error) {

        console.log(
            "Remove Wishlist Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "Internal Server Error",
            isWishlisted: true,
        };
    }
};


export const checkWishlist = async (productId) => {
    try {

        const response = await client.get(
            `wishlist/check/${productId}`
        );

        return {
            success: response.data.success,
            isWishlisted: response.data.isWishlisted,
        };

    } catch (error) {

        console.log(
            "Check Wishlist Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            isWishlisted: false,
        };
    }
};


export const getWishlist = async () => {
    try {
        const response = await client.get("wishlist");

        return {
            success: response.data.success,
            wishlist: response.data.wishlist || [],
            message: response.data.message,
        };
    } catch (error) {
        console.log(
            "Get Wishlist Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            wishlist: [],
            message:
                error?.response?.data?.message ||
                "Failed to fetch wishlist",
        };
    }
};
