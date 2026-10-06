import OrderModel from "../model/order.model.js";
import ProductModel from "../model/product.model.js";
import UserModel from "../model/user.model.js";
import CategoryModel from "../model/category.model.js";


// =====================================================
// DASHBOARD STATS
// =====================================================

const getDashboardStats = async (req, res) => {
    try {

        const [
            totalOrders,
            totalCustomers,
            totalProducts,

            pendingOrders,
            confirmedOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            returnOrders,

            revenueResult
        ] = await Promise.all([

            // TOTAL ORDERS
            OrderModel.countDocuments(),

            // TOTAL CUSTOMERS
            UserModel.countDocuments({
                role: "user"
            }),

            // TOTAL PRODUCTS
            ProductModel.countDocuments(),

            // ORDER STATUS
            OrderModel.countDocuments({
                orderStatus: "placed"
            }),

            OrderModel.countDocuments({
                orderStatus: "confirmed"
            }),

            OrderModel.countDocuments({
                orderStatus: "shipped"
            }),

            OrderModel.countDocuments({
                orderStatus: "delivered"
            }),

            OrderModel.countDocuments({
                orderStatus: "cancelled"
            }),

            OrderModel.countDocuments({
                orderStatus: "return"
            }),

            // TOTAL REVENUE
            OrderModel.aggregate([
                {
                    $match: {
                        orderStatus: {
                            $nin: ["cancelled", "return"]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ])
        ]);


        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].total
                : 0;


        return res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",

            stats: {
                totalRevenue,
                totalOrders,
                totalCustomers,
                totalProducts,

                orderStatus: {
                    placed: pendingOrders,
                    confirmed: confirmedOrders,
                    shipped: shippedOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders,
                    return: returnOrders
                }
            }
        });

    } catch (error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// =====================================================
// SALES OVERVIEW
// =====================================================

const getSalesOverview = async (req, res) => {
    try {

        const currentYear = new Date().getFullYear();

        const sales = await OrderModel.aggregate([

            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    },

                    orderStatus: {
                        $nin: ["cancelled", "return"]
                    }
                }
            },

            {
                $group: {
                    _id: {
                        month: {
                            $month: "$createdAt"
                        }
                    },

                    revenue: {
                        $sum: "$totalAmount"
                    },

                    orders: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    "_id.month": 1
                }
            }
        ]);


        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];


        const formattedSales = monthNames.map(
            (month, index) => {

                const monthData = sales.find(
                    item =>
                        item._id.month === index + 1
                );

                return {
                    month,

                    revenue:
                        monthData?.revenue || 0,

                    orders:
                        monthData?.orders || 0
                };
            }
        );


        return res.status(200).json({
            success: true,
            message: "Sales overview fetched successfully",
            year: currentYear,
            sales: formattedSales
        });

    } catch (error) {

        console.error(
            "Sales Overview Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// =====================================================
// ORDER STATUS
// =====================================================

const getOrderStatus = async (req, res) => {
    try {

        const statusData =
            await OrderModel.aggregate([

                {
                    $group: {
                        _id: "$orderStatus",

                        count: {
                            $sum: 1
                        }
                    }
                },

                {
                    $sort: {
                        count: -1
                    }
                }
            ]);


        const statuses = [
            "placed",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
            "return"
        ];


        const result = statuses.map(status => {

            const found =
                statusData.find(
                    item =>
                        item._id === status
                );

            return {
                status,
                count: found?.count || 0
            };
        });


        return res.status(200).json({
            success: true,
            message: "Order status fetched successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Order Status Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// =====================================================
// SALES BY CATEGORY
// =====================================================

const getCategorySales = async (req, res) => {
    try {

        const categorySales =
            await OrderModel.aggregate([

                // Ignore cancelled / returned orders
                {
                    $match: {
                        orderStatus: {
                            $nin: [
                                "cancelled",
                                "return"
                            ]
                        }
                    }
                },

                // ORDER ITEMS
                {
                    $unwind: "$items"
                },

                // PRODUCT
                {
                    $lookup: {
                        from: "products",
                        localField: "items.product_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },

                {
                    $unwind: "$product"
                },

                // CATEGORY
                {
                    $lookup: {
                        from: "catagories",
                        localField: "product.categoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                },

                {
                    $unwind: "$category"
                },

                // GROUP CATEGORY
                {
                    $group: {
                        _id: "$category._id",

                        categoryName: {
                            $first: "$category.name"
                        },

                        sales: {
                            $sum: "$items.total"
                        },

                        quantity: {
                            $sum: "$items.qty"
                        }
                    }
                },

                {
                    $sort: {
                        sales: -1
                    }
                }
            ]);


        return res.status(200).json({
            success: true,
            message: "Category sales fetched successfully",
            data: categorySales
        });

    } catch (error) {

        console.error(
            "Category Sales Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// =====================================================
// CUSTOMER GROWTH
// =====================================================

const getCustomerGrowth = async (req, res) => {
    try {

        const currentYear =
            new Date().getFullYear();


        const customers =
            await UserModel.aggregate([

                {
                    $match: {
                        role: "user",

                        createdAt: {
                            $gte: new Date(
                                `${currentYear}-01-01`
                            ),

                            $lt: new Date(
                                `${currentYear + 1}-01-01`
                            )
                        }
                    }
                },

                {
                    $group: {
                        _id: {
                            month: {
                                $month: "$createdAt"
                            }
                        },

                        customers: {
                            $sum: 1
                        }
                    }
                },

                {
                    $sort: {
                        "_id.month": 1
                    }
                }
            ]);


        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];


        const formattedCustomers =
            monthNames.map(
                (month, index) => {

                    const monthData =
                        customers.find(
                            item =>
                                item._id.month === index + 1
                        );

                    return {
                        month,

                        customers:
                            monthData?.customers || 0
                    };
                }
            );


        return res.status(200).json({
            success: true,
            message: "Customer growth fetched successfully",
            year: currentYear,
            data: formattedCustomers
        });

    } catch (error) {

        console.error(
            "Customer Growth Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// =====================================================
// TOP SELLING PRODUCTS
// =====================================================

const getTopProducts = async (req, res) => {
    try {

        const products =
            await OrderModel.aggregate([

                {
                    $match: {
                        orderStatus: {
                            $nin: [
                                "cancelled",
                                "return"
                            ]
                        }
                    }
                },

                {
                    $unwind: "$items"
                },

                {
                    $group: {
                        _id: "$items.product_id",

                        totalQuantity: {
                            $sum: "$items.qty"
                        },

                        totalSales: {
                            $sum: "$items.total"
                        }
                    }
                },

                {
                    $sort: {
                        totalQuantity: -1
                    }
                },

                {
                    $limit: 10
                },

                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },

                {
                    $unwind: "$product"
                },

                {
                    $project: {
                        _id: 1,

                        name: "$product.name",

                        thumbnail:
                            "$product.thumbnail",

                        salePrice:
                            "$product.salePrice",

                        totalQuantity: 1,

                        totalSales: 1
                    }
                }
            ]);


        return res.status(200).json({
            success: true,
            message: "Top products fetched successfully",
            data: products
        });

    } catch (error) {

        console.error(
            "Top Products Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// =====================================================
// LOW / OUT OF STOCK PRODUCTS
// =====================================================

const getLowStockProducts = async (req, res) => {
    try {

        const products =
            await ProductModel.find({
                stock: false
            })
            .select(
                "name thumbnail salePrice stock status"
            )
            .sort({
                updatedAt: -1
            })
            .limit(10);


        return res.status(200).json({
            success: true,
            message: "Out of stock products fetched successfully",
            data: products
        });

    } catch (error) {

        console.error(
            "Low Stock Products Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// =====================================================
// RECENT ORDERS
// =====================================================

const getRecentOrders = async (req, res) => {
    try {

        const orders =
            await OrderModel.find()

                .populate({
                    path: "user",
                    select: "name email"
                })

                .populate({
                    path: "items.product_id",
                    select:
                        "name thumbnail salePrice"
                })

                .sort({
                    createdAt: -1
                })

                .limit(10);


        return res.status(200).json({
            success: true,
            message: "Recent orders fetched successfully",
            data: orders
        });

    } catch (error) {

        console.error(
            "Recent Orders Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// =====================================================
// EXPORT
// =====================================================

export {
    getDashboardStats,
    getSalesOverview,
    getOrderStatus,
    getCategorySales,
    getCustomerGrowth,
    getTopProducts,
    getLowStockProducts,
    getRecentOrders
};