"use client";

import { useEffect, useState } from "react";
import { CircleUser, Menu, X } from "lucide-react";
import { FiSearch, FiShoppingBag, FiX, } from "react-icons/fi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { client } from "@/utils/helper";

export default function Header({ user }) {
    const cartItem = useSelector(
        (store) => store.cart?.items || []
    );

    const pathname = usePathname();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [searchProducts, setSearchProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const navLinks = [
        {
            name: "Home",
            href: "/",
        },
        {
            name: "Store",
            href: "/store",
        },
        {
            name: "About",
            href: "/about",
        },
        {
            name: "Contact",
            href: "/contact",
        },
    ];

    const cartCount = cartItem.length;

    // ==========================================
    // SEARCH API
    // ==========================================

    useEffect(() => {
        const searchValue = search.trim();

        if (!searchValue) {
            setSearchProducts([]);
            setLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);

                const response = await client.get(
                    `product/search?search=${encodeURIComponent(
                        searchValue
                    )}`
                );

                setSearchProducts(
                    response.data?.data || []
                );
            } catch (error) {
                console.error(
                    "SEARCH PRODUCTS ERROR:",
                    error
                );

                setSearchProducts([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // ==========================================
    // CLOSE SEARCH
    // ==========================================

    const closeSearch = () => {
        setSearchOpen(false);
        setSearch("");
        setSearchProducts([]);
    };

    // ==========================================
    // CLOSE MOBILE MENU
    // ==========================================

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // ==========================================
    // CLOSE ON ROUTE CHANGE
    // ==========================================

    useEffect(() => {
        setMobileMenuOpen(false);
        setSearchOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#E8E1DB] bg-white">

            {/* ==================================================
                MAIN HEADER
            ================================================== */}

            <div className="relative mx-auto flex h-[64px] max-w-7xl items-center px-3 sm:px-5 lg:px-7 xl:px-8">

                {/* ==================================================
                    LEFT SECTION
                ================================================== */}

                <div className="flex min-w-0 flex-1 items-center">

                    {/* MOBILE / TABLET MENU */}

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(
                                (prev) => !prev
                            )
                        }
                        className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#303030] transition hover:bg-[#F5F1ED] hover:text-[#8C5A3C] active:scale-95 lg:hidden"
                        aria-label={
                            mobileMenuOpen
                                ? "Close menu"
                                : "Open menu"
                        }
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X
                                size={20}
                                strokeWidth={2}
                            />
                        ) : (
                            <Menu
                                size={20}
                                strokeWidth={2}
                            />
                        )}
                    </button>

                    {/* LOGO */}

                    <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className="shrink-0 text-[14px] font-semibold tracking-[0.2em] text-[#1E1E1E] transition hover:text-[#8C5A3C] sm:text-[15px] lg:text-base"
                    >
                        NESTRO
                        <span className="text-[#A3704C]">
                            .
                        </span>
                    </Link>
                </div>

                {/* ==================================================
                    DESKTOP NAVIGATION
                    EXACT CENTER
                ================================================== */}

                <nav className="hidden shrink-0 items-center gap-1 lg:flex">

                    {navLinks.map((link) => {
                        const isActive =
                            pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`rounded-lg px-3 py-2 text-[12px] font-semibold transition duration-200 xl:px-3.5 ${isActive
                                    ? "bg-[#F5EEE8] text-[#8C5A3C]"
                                    : "text-[#626262] hover:bg-[#FAF8F6] hover:text-[#8C5A3C]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                </nav>

                {/* ==================================================
                    RIGHT SECTION
                ================================================== */}

                <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2 lg:gap-3">

                    {/* ==================================================
                        DESKTOP SEARCH
                    ================================================== */}

                    <div className="relative hidden shrink-0 lg:block">

                        <div className="flex h-9 w-[190px] items-center rounded-full border border-[#E2D9D1] bg-[#FAF8F6] px-3 transition focus-within:border-[#BFA894] focus-within:bg-white xl:w-[225px]">

                            <FiSearch
                                size={15}
                                className="mr-2 shrink-0 text-[#777]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search products"
                                className="min-w-0 flex-1 bg-transparent text-[12px] text-[#333] outline-none placeholder:text-[#999]"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={closeSearch}
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#888] transition hover:bg-[#EDE8E3] hover:text-[#333]"
                                    aria-label="Clear search"
                                >
                                    <FiX size={13} />
                                </button>
                            )}
                        </div>

                        {/* DESKTOP SEARCH RESULTS */}

                        {search.trim() && (
                            <div className="absolute right-0 top-11 z-[60] w-[300px] overflow-hidden rounded-xl border border-[#E8E1DB] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.10)] xl:w-[340px]">

                                {loading ? (
                                    <div className="px-4 py-5 text-center text-xs text-gray-500">
                                        Searching products...
                                    </div>
                                ) : searchProducts.length >
                                    0 ? (
                                    <div className="max-h-[320px] overflow-y-auto">

                                        {searchProducts.map(
                                            (product) => (
                                                <Link
                                                    key={
                                                        product._id
                                                    }
                                                    href={`/product/${product.slug}`}
                                                    onClick={
                                                        closeSearch
                                                    }
                                                    className="flex items-center gap-3 border-b border-[#F1ECE7] px-3 py-3 transition last:border-b-0 hover:bg-[#FAF8F6]"
                                                >

                                                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#F5F3F0]">

                                                        {product.thumbnail ? (
                                                            <img
                                                                src={
                                                                    product.thumbnail
                                                                }
                                                                alt={
                                                                    product.name ||
                                                                    "Product"
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-400">
                                                                No
                                                                image
                                                            </div>
                                                        )}

                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-[12px] font-semibold text-[#333]">
                                                            {
                                                                product.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-[11px] font-semibold text-[#788864]">
                                                            ₹
                                                            {Number(
                                                                product.salePrice ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>

                                                    </div>

                                                </Link>
                                            )
                                        )}

                                    </div>
                                ) : (
                                    <div className="px-4 py-6 text-center text-xs text-gray-500">
                                        No products found
                                    </div>
                                )}

                            </div>
                        )}
                    </div>

                    {/* ==================================================
                        MOBILE / TABLET SEARCH BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setSearchOpen(
                                (prev) => !prev
                            )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#303030] transition hover:bg-[#F5F1ED] hover:text-[#8C5A3C] active:scale-95 lg:hidden"
                        aria-label="Search"
                    >
                        {searchOpen ? (
                            <FiX size={17} />
                        ) : (
                            <FiSearch size={17} />
                        )}
                    </button>

                    {/* ==================================================
                        CART
                    ================================================== */}

                    <Link
                        href="/cart"
                        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#303030] transition hover:bg-[#F5F1ED] hover:text-[#8C5A3C] active:scale-95"
                        aria-label="Shopping cart"
                    >

                        <FiShoppingBag size={19} />

                        {cartCount > 0 && (
                            <span className="absolute right-0 top-0 z-10 flex h-[16px] min-w-[16px] -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold leading-none bg-red-600 text-black ring-2 ring-white">
                                {cartCount}
                            </span>
                        )}

                    </Link>

                    {/* ==================================================
                        PROFILE
                    ================================================== */}

                    <Link
                        href="/profile"
                        className="flex items-center rounded-full lg:pl-1"
                        aria-label="Profile"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F3F0] text-[#424242]">
                            <CircleUser
                                size={19}
                                strokeWidth={2}
                            />
                        </div>

                        {user?.name && (
                            <span
                                className="ml-2 hidden max-w-[100px] truncate text-[12px] font-medium text-[#555] lg:block"
                                title={user.name}
                            >
                                {user.name}
                            </span>
                        )}
                    </Link>
                </div>

                {/* ==================================================
                    MOBILE SEARCH PANEL
                ================================================== */}

                {searchOpen && (
                    <div className="absolute left-3 right-3 top-[68px] z-[55] rounded-xl border border-[#E8E1DB] bg-white p-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.12)] lg:hidden">

                        {/* SEARCH INPUT */}

                        <div className="flex h-10 items-center rounded-lg border border-[#E2D9D1] bg-[#FAF8F6] px-3">

                            <FiSearch
                                size={16}
                                className="mr-2 shrink-0 text-[#777]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                autoFocus
                                placeholder="Search products..."
                                className="min-w-0 flex-1 bg-transparent text-xs text-[#333] outline-none placeholder:text-[#999]"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={closeSearch}
                                    className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-[#EDE8E3]"
                                    aria-label="Clear search"
                                >
                                    <FiX size={14} />
                                </button>
                            )}

                        </div>

                        {/* MOBILE SEARCH RESULTS */}

                        {search.trim() && (
                            <div className="mt-2 overflow-hidden rounded-lg border border-[#E8E1DB] bg-white">

                                {loading ? (
                                    <div className="px-4 py-5 text-center text-xs text-gray-500">
                                        Searching products...
                                    </div>
                                ) : searchProducts.length >
                                    0 ? (
                                    <div className="max-h-[280px] overflow-y-auto">

                                        {searchProducts.map(
                                            (product) => (
                                                <Link
                                                    key={
                                                        product._id
                                                    }
                                                    href={`/product/${product.slug}`}
                                                    onClick={
                                                        closeSearch
                                                    }
                                                    className="flex items-center gap-3 border-b border-[#F1ECE7] px-3 py-3 last:border-b-0 hover:bg-[#FAF8F6]"
                                                >

                                                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#F5F3F0]">

                                                        {product.thumbnail ? (
                                                            <img
                                                                src={
                                                                    product.thumbnail
                                                                }
                                                                alt={
                                                                    product.name ||
                                                                    "Product"
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-400">
                                                                No
                                                                image
                                                            </div>
                                                        )}

                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-xs font-semibold text-[#333]">
                                                            {
                                                                product.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-[11px] font-semibold text-[#788864]">
                                                            ₹
                                                            {Number(
                                                                product.salePrice ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>

                                                    </div>

                                                </Link>
                                            )
                                        )}

                                    </div>
                                ) : (
                                    <div className="px-4 py-5 text-center text-xs text-gray-500">
                                        No products found
                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                )}

            </div>

            {/* ==================================================
                MOBILE / TABLET MENU
            ================================================== */}

            {mobileMenuOpen && (
                <div className="border-t border-[#EDE7E1] bg-white shadow-sm lg:hidden">

                    <nav className="mx-auto max-w-7xl px-3 py-3 sm:px-5">

                        <div className="grid gap-1">

                            {navLinks.map((link) => {
                                const isActive =
                                    pathname ===
                                    link.href;

                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={
                                            closeMobileMenu
                                        }
                                        className={`flex min-h-[42px] items-center rounded-lg px-3.5 text-[13px] font-semibold transition ${isActive
                                            ? "bg-[#F5EEE8] text-[#8C5A3C]"
                                            : "text-[#555] hover:bg-[#FAF8F6] hover:text-[#8C5A3C]"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}

                        </div>

                    </nav>

                </div>
            )}

        </header>
    );
}