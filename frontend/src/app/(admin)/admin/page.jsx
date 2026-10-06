"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  IndianRupee,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
  PackageCheck,
  AlertTriangle,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { client } from "@/utils/helper";

const COLORS = {
  primary: "#304CB2",
  secondary: "#7187E2",
  light: "#E8EEFF",
  background: "#F4F7FF",
  border: "#E4EAF8",
  text: "#172554",
  muted: "#71809F",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const STATUS_CONFIG = {
  placed: {
    label: "Placed",
    icon: Clock3,
    bg: "#EEF2FF",
    color: "#4F46E5",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    bg: "#ECFDF5",
    color: "#059669",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    bg: "#EFF6FF",
    color: "#2563EB",
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    bg: "#F0FDF4",
    color: "#16A34A",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    bg: "#FEF2F2",
    color: "#DC2626",
  },
  return: {
    label: "Return",
    icon: RotateCcw,
    bg: "#FFF7ED",
    color: "#EA580C",
  },
};

function formatCurrency(value) {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(date) {
  if (!date) return "--";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderStatus(status) {
  const value = String(status || "").toLowerCase();

  return (
    STATUS_CONFIG[value] || {
      label: status || "Unknown",
      icon: Package,
      bg: "#F1F5F9",
      color: "#64748B",
    }
  );
}

/* =====================================================
   REUSABLE CARD
===================================================== */

function DashboardCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border bg-white shadow-[0_4px_20px_rgba(48,76,178,0.05)] ${className}`}
      style={{ borderColor: COLORS.border }}
    >
      {children}
    </div>
  );
}

/* =====================================================
   SECTION HEADER
===================================================== */

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <div>
        <h2 className="text-[17px] font-bold text-slate-800">{title}</h2>

        {subtitle && (
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  icon: Icon,
  growth,
  positive = true,
  data = [],
}) {
  return (
    <DashboardCard className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>

          <h3 className="mt-2 text-[25px] font-bold tracking-tight text-slate-800">
            {value}
          </h3>

          <div className="mt-3 flex items-center gap-1.5">
            {positive ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}

            <span
              className={`text-xs font-semibold ${
                positive ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {growth}
            </span>

            <span className="text-[11px] text-slate-400">
              vs last month
            </span>
          </div>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: COLORS.light,
            color: COLORS.primary,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {data.length > 0 && (
        <div className="mt-4 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLORS.secondary}
                fill={COLORS.light}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  );
}

/* =====================================================
   STATUS CARD
===================================================== */

function StatusCard({ status, count }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
  const Icon = config.icon;

  return (
    <div
      className="rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            backgroundColor: config.bg,
            color: config.color,
          }}
        >
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-xl font-bold text-slate-800">{count}</span>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500">
        {config.label}
      </p>
    </div>
  );
}

/* =====================================================
   CUSTOM TOOLTIP
===================================================== */

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xl">
      <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>

      {payload.map((item, index) => (
        <p key={index} className="text-sm font-bold text-slate-700">
          {item.name === "revenue"
            ? formatCurrency(item.value)
            : `${item.value}`}
        </p>
      ))}
    </div>
  );
}

/* =====================================================
   MAIN DASHBOARD
===================================================== */

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH DASHBOARD
  ===================================================== */

  async function fetchDashboard(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        statsResponse,
        salesResponse,
        orderStatusResponse,
        categoriesResponse,
        customersResponse,
        topProductsResponse,
        lowStockResponse,
        recentOrdersResponse,
      ] = await Promise.all([
        client.get("/dashboard/stats"),
        client.get("/dashboard/sales"),
        client.get("/dashboard/order-status"),
        client.get("/dashboard/categories"),
        client.get("/dashboard/customers"),
        client.get("/dashboard/top-products"),
        client.get("/dashboard/low-stock"),
        client.get("/dashboard/recent-orders"),
      ]);

      setStats(statsResponse?.data?.stats || null);
      setSales(salesResponse?.data?.sales || []);
      setOrderStatus(orderStatusResponse?.data?.data || []);
      setCategories(categoriesResponse?.data?.data || []);
      setCustomers(customersResponse?.data?.data || []);
      setTopProducts(topProductsResponse?.data?.data || []);
      setLowStock(lowStockResponse?.data?.data || []);
      setRecentOrders(recentOrdersResponse?.data?.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* =====================================================
     STATUS DATA
  ===================================================== */

  const statusMap = useMemo(() => {
    const map = {};

    orderStatus.forEach((item) => {
      map[item.status] = item.count;
    });

    return map;
  }, [orderStatus]);

  /* =====================================================
     PIE DATA
  ===================================================== */

  const pieData = useMemo(() => {
    return orderStatus
      .filter((item) => Number(item.count) > 0)
      .map((item) => ({
        name:
          STATUS_CONFIG[item.status]?.label ||
          item.status,
        value: Number(item.count),
        status: item.status,
      }));
  }, [orderStatus]);

  /* =====================================================
     STAT SPARKLINE DATA
  ===================================================== */

  const revenueSpark = sales.map((item) => ({
    value: Number(item.revenue || 0),
  }));

  const orderSpark = sales.map((item) => ({
    value: Number(item.orders || 0),
  }));

  const customerSpark = customers.map((item) => ({
    value: Number(item.customers || 0),
  }));

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div
        className="flex min-h-[calc(100vh-80px)] items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="flex flex-col items-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#304CB2]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div
        className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6"
        style={{ backgroundColor: COLORS.background }}
      >
        <DashboardCard className="max-w-md p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Dashboard unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

          <button
            onClick={() => fetchDashboard()}
            className="mt-5 rounded-lg bg-[#304CB2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#263e99]"
          >
            Try Again
          </button>
        </DashboardCard>
      </div>
    );
  }

  /* =====================================================
     DASHBOARD UI
  ===================================================== */

  return (
    <main
      className="min-h-[calc(100vh-72px)] p-4 sm:p-5 lg:p-6"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="mx-auto max-w-[1700px] space-y-5">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7187E2]">
              Overview
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">
              Welcome back, Admin 👋
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Here's what's happening with your Nestro store today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="hidden items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm sm:flex"
              style={{ borderColor: COLORS.border }}
            >
              <CalendarDays className="h-4 w-4 text-[#304CB2]" />
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </button>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl bg-[#304CB2] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#263e99] disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue)}
            icon={IndianRupee}
            growth="12.5%"
            data={revenueSpark}
          />

          <StatCard
            title="Total Orders"
            value={Number(stats?.totalOrders || 0).toLocaleString("en-IN")}
            icon={ShoppingCart}
            growth="8.2%"
            data={orderSpark}
          />

          <StatCard
            title="Total Customers"
            value={Number(stats?.totalCustomers || 0).toLocaleString("en-IN")}
            icon={Users}
            growth="5.4%"
            data={customerSpark}
          />

          <StatCard
            title="Total Products"
            value={Number(stats?.totalProducts || 0).toLocaleString("en-IN")}
            icon={Package}
            growth="3.1%"
            data={[]}
          />
        </div>

        {/* =================================================
            ORDER OVERVIEW
        ================================================= */}

        <DashboardCard className="p-5">
          <SectionHeader
            title="Order Overview"
            subtitle="Current order status across your store"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              "placed",
              "confirmed",
              "shipped",
              "delivered",
              "cancelled",
              "return",
            ].map((status) => (
              <StatusCard
                key={status}
                status={status}
                count={statusMap[status] || 0}
              />
            ))}
          </div>
        </DashboardCard>

        {/* =================================================
            SALES + ORDER STATUS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">
          {/* SALES */}

          <DashboardCard className="p-5">
            <SectionHeader
              title="Sales Overview"
              subtitle="Revenue performance for the current year"
              action={
                <button className="flex items-center gap-1 rounded-lg border border-slate-100 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50">
                  This Year
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              }
            />

            <div className="h-[310px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sales}
                  margin={{
                    top: 10,
                    right: 5,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7187E2"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="#7187E2"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EDF1F8"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                    }}
                    tickFormatter={(value) =>
                      value >= 1000
                        ? `₹${(value / 1000).toFixed(0)}k`
                        : `₹${value}`
                    }
                  />

                  <Tooltip
                    content={<ChartTooltip />}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 3,
                      stroke: "#fff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* ORDER STATUS */}

          <DashboardCard className="p-5">
            <SectionHeader
              title="Order Status"
              subtitle="Distribution of all orders"
            />

            <div className="relative h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((item, index) => (
                      <Cell
                        key={index}
                        fill={
                          STATUS_CONFIG[item.status]?.color ||
                          COLORS.secondary
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">
                  {Number(stats?.totalOrders || 0).toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span className="text-[11px] text-slate-400">
                  Total Orders
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {pieData.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center gap-2"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        STATUS_CONFIG[item.status]?.color ||
                        COLORS.secondary,
                    }}
                  />

                  <span className="text-xs text-slate-500">
                    {item.name}
                  </span>

                  <span className="ml-auto text-xs font-bold text-slate-700">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* =================================================
            CUSTOMER GROWTH + CATEGORY
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* CUSTOMER GROWTH */}

          <DashboardCard className="p-5">
            <SectionHeader
              title="Customer Growth"
              subtitle="New customers registered this year"
            />

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customers}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EDF1F8"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#94A3B8",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fontSize: 10,
                      fill: "#94A3B8",
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="customers"
                    fill={COLORS.secondary}
                    radius={[5, 5, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* CATEGORY */}

          <DashboardCard className="p-5">
            <SectionHeader
              title="Sales by Category"
              subtitle="Category-wise revenue contribution"
            />

            <div className="space-y-5">
              {categories.length === 0 ? (
                <div className="flex h-[230px] items-center justify-center text-sm text-slate-400">
                  No category sales available.
                </div>
              ) : (
                categories.slice(0, 6).map((category, index) => {
                  const maxSales = Math.max(
                    ...categories.map((item) =>
                      Number(item.sales || 0)
                    ),
                    1
                  );

                  const percentage =
                    (Number(category.sales || 0) / maxSales) * 100;

                  return (
                    <div key={category._id || index}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">
                          {category.categoryName}
                        </span>

                        <span className="text-xs font-bold text-slate-700">
                          {formatCurrency(category.sales)}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#7187E2] transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              percentage,
                              4
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="mt-1 flex justify-end">
                        <span className="text-[10px] text-slate-400">
                          {Number(category.quantity || 0)} items sold
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </DashboardCard>
        </div>

        {/* =================================================
            TOP PRODUCTS
        ================================================= */}

        <DashboardCard className="overflow-hidden">
          <div className="p-5 pb-3">
            <SectionHeader
              title="Top Selling Products"
              subtitle="Best performing products based on quantity sold"
              action={
                <button className="flex items-center gap-1.5 text-xs font-semibold text-[#304CB2] hover:underline">
                  View All
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              }
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Product
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Price
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Units Sold
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Sales
                  </th>

                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {topProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-slate-400"
                    >
                      No product sales available.
                    </td>
                  </tr>
                ) : (
                  topProducts.slice(0, 10).map((product, index) => (
                    <tr
                      key={product._id || index}
                      className="border-b border-slate-50 transition hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4F7FF] text-xs font-bold text-[#304CB2]">
                            {index + 1}
                          </div>

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                            {product.thumbnail ? (
                              <img
                                src={product.thumbnail}
                                alt={product.name || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-slate-300" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[240px] truncate text-sm font-semibold text-slate-700">
                              {product.name || "Unnamed Product"}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                              Product
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-600">
                        {formatCurrency(product.salePrice)}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-semibold text-[#4F46E5]">
                          {product.totalQuantity || 0}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-sm font-bold text-slate-700">
                        {formatCurrency(product.totalSales)}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#304CB2]">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* =================================================
            LOW STOCK + RECENT ORDERS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.65fr]">
          {/* LOW STOCK */}

          <DashboardCard className="p-5">
            <SectionHeader
              title="Low Stock Alert"
              subtitle="Products that need your attention"
              action={
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              }
            />

            <div className="space-y-3">
              {lowStock.length === 0 ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    All products are in stock
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Nothing needs your attention right now.
                  </p>
                </div>
              ) : (
                lowStock.slice(0, 6).map((product, index) => (
                  <div
                    key={product._id || index}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-5 w-5 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700">
                        {product.name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {formatCurrency(product.salePrice)}
                      </p>
                    </div>

                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-500">
                      Out of stock
                    </span>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>

          {/* RECENT ORDERS */}

          <DashboardCard className="overflow-hidden">
            <div className="p-5 pb-3">
              <SectionHeader
                title="Recent Orders"
                subtitle="Latest orders placed by customers"
                action={
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-[#304CB2] hover:underline">
                    View All
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                }
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Order
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      View
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-slate-400"
                      >
                        No recent orders found.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.slice(0, 10).map((order, index) => {
                      const status = getOrderStatus(
                        order.orderStatus
                      );

                      return (
                        <tr
                          key={order._id || index}
                          className="border-b border-slate-50 transition hover:bg-slate-50/50"
                        >
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-bold text-[#304CB2]">
                              #
                              {String(order._id || "")
                                .slice(-6)
                                .toUpperCase()}
                            </span>
                          </td>

                          <td className="px-5 py-3.5">
                            <div>
                              <p className="max-w-[160px] truncate text-sm font-semibold text-slate-700">
                                {order.user?.name ||
                                  "Guest Customer"}
                              </p>

                              <p className="max-w-[160px] truncate text-[11px] text-slate-400">
                                {order.user?.email || "--"}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 text-xs text-slate-500">
                            {formatDate(order.createdAt)}
                          </td>

                          <td className="px-5 py-3.5 text-sm font-bold text-slate-700">
                            {formatCurrency(
                              order.totalAmount ||
                                order.total ||
                                0
                            )}
                          </td>

                          <td className="px-5 py-3.5">
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold"
                              style={{
                                backgroundColor: status.bg,
                                color: status.color,
                              }}
                            >
                              {status.label}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#304CB2]">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      </div>
    </main>
  );
}