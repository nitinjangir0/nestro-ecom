import express from "express";

import {
    protect,
    authorize
} from "../middleware/auth.js";

import {
    getDashboardStats,
    getSalesOverview,
    getOrderStatus,
    getCategorySales,
    getCustomerGrowth,
    getTopProducts,
    getLowStockProducts,
    getRecentOrders
} from "../controllers/dashboard.controller.js";


const router = express.Router();


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
    "/stats",
    protect,
    authorize("admin", "superadmin"),
    getDashboardStats
);


router.get(
    "/sales",
    protect,
    authorize("admin", "superadmin"),
    getSalesOverview
);


router.get(
    "/order-status",
    protect,
    authorize("admin", "superadmin"),
    getOrderStatus
);


router.get(
    "/categories",
    protect,
    authorize("admin", "superadmin"),
    getCategorySales
);


router.get(
    "/customers",
    protect,
    authorize("admin", "superadmin"),
    getCustomerGrowth
);


router.get(
    "/top-products",
    protect,
    authorize("admin", "superadmin"),
    getTopProducts
);


router.get(
    "/low-stock",
    protect,
    authorize("admin", "superadmin"),
    getLowStockProducts
);


router.get(
    "/recent-orders",
    protect,
    authorize("admin", "superadmin"),
    getRecentOrders
);


export default router;