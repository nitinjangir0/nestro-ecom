import { client } from "./helper";
import { cookies } from "next/headers";


// ===============================
// GET PROFILE
// ===============================

export const getProfile = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;

        // User logged in nahi hai
        // to profile API call hi mat karo
        if (!token) {
            return {
                success: false,
                data: null,
                menu: [],
                message: "User not logged in",
            };
        }

        const response = await client.get("user/profile", {
            headers: {
                Authorization: token,
            },
        });

        return {
            success: response.data.success,
            data: response.data.user || null,
            menu: response.data.menu || [],
            message: response.data.message,
        };

    } catch (error) {

        console.error(
            "Get Profile Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            data: null,
            menu: [],
            message:
                error?.response?.data?.message ||
                "Internal Server Error",
        };
    }
};


// ===============================
// GET MY ORDERS
// ===============================

export const getMyOrders = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;

        const response = await client.get("order/my-orders", {
            headers: {
                Authorization: token,
            },
        });

        return {
            success: response.data.success,
            data: response.data.orders,
            message: response.data.message,
        };

    } catch (error) {

        console.error(
            "Get My Orders Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            data: [],
            message: "Internal Server Error",
        };
    }
};


export const getOrderById = async (orderId) => {
    try {

        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;


        const response = await client.get(
            `order/${orderId}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );


        return {
            success: response.data.success,
            data: response.data.order,
            message: response.data.message,
        };


    } catch (error) {

        console.error(
            "Get Order Error:",
            error?.response?.data || error.message
        );


        return {
            success: false,
            data: null,
            message:
                error?.response?.data?.message ||
                "Order not found",
        };
    }
};