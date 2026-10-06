
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    MapPin,
    Phone,
    Mail,
    Clock3,
    ArrowRight,
    Send,
    MessageCircle,
    ShieldCheck,
    Truck,
    RefreshCcw,
} from "lucide-react";
import { toast } from "react-toastify";

import { client } from "@/utils/helper";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const phone = formData.phone.trim();
        const subject = formData.subject.trim();
        const message = formData.message.trim();

        if (!name || !email || !subject || !message) {
            toast.error("Please fill all required fields");
            return;
        }

        if (name.length < 2) {
            toast.error("Please enter a valid name");
            return;
        }

        if (phone && !/^[0-9]{10}$/.test(phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        try {
            setLoading(true);

            const response = await client.post("contact/create", {
                name,
                email,
                phone,
                subject,
                message,
            });

            if (response.data?.success) {
                toast.success(
                    response.data?.message ||
                        "Message sent successfully!"
                );

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
            } else {
                toast.error(
                    response.data?.message ||
                        "Unable to send your message"
                );
            }
        } catch (error) {
            console.error("Contact API Error:", {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error.message,
            });

            toast.error(
                error?.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#faf9f7] text-[#29231f]">
            {/* =====================================
                HERO SECTION
            ====================================== */}
            <section className="border-b border-[#e9e3dd]">
                <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#93633e]">
                            Contact Nestro
                        </p>

                        <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                            Let&apos;s make your space
                            <span className="block text-[#93633e]">
                                feel like home.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#756b64] md:text-base">
                            Have a question about an order, need help
                            choosing furniture, or want to know more about
                            Nestro? Our team is here to help you.
                        </p>
                    </div>
                </div>
            </section>

            {/* =====================================
                CONTACT INFORMATION
            ====================================== */}
            <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#e7e0d9] bg-white sm:grid-cols-2 lg:grid-cols-4">
                    <ContactInfo
                        icon={<MapPin size={19} strokeWidth={1.8} />}
                        title="Visit us"
                        firstLine="Jaipur, Rajasthan"
                        secondLine="India"
                    />

                    <ContactInfo
                        icon={<Phone size={19} strokeWidth={1.8} />}
                        title="Call us"
                        firstLine="+91 98765 43210"
                        secondLine="Mon – Sat"
                    />

                    <ContactInfo
                        icon={<Mail size={19} strokeWidth={1.8} />}
                        title="Email us"
                        firstLine="support@nestro.com"
                        secondLine="Within 24 hours"
                    />

                    <ContactInfo
                        icon={<Clock3 size={19} strokeWidth={1.8} />}
                        title="Opening hours"
                        firstLine="9:00 AM – 7:00 PM"
                        secondLine="Monday – Saturday"
                    />
                </div>
            </section>

            {/* =====================================
                MAIN CONTENT
            ====================================== */}
            <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                    {/* =================================
                        LEFT CONTENT
                    ================================== */}
                    <div className="pt-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#93633e]">
                            Get in touch
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                            How can we help?
                        </h2>

                        <p className="mt-5 max-w-md text-sm leading-7 text-[#756b64] md:text-[15px]">
                            From product questions to order assistance, our
                            support team is ready to help you find the right
                            solution for your home or workspace.
                        </p>

                        <div className="mt-8 space-y-5">
                            <SupportItem
                                icon={<MessageCircle size={17} />}
                                title="Customer support"
                                description="Get help with your questions and orders."
                            />

                            <SupportItem
                                icon={<Truck size={17} />}
                                title="Order assistance"
                                description="Need help with delivery or order updates?"
                            />

                            <SupportItem
                                icon={<ShieldCheck size={17} />}
                                title="Product guidance"
                                description="We can help you choose the right furniture."
                            />

                            <SupportItem
                                icon={<RefreshCcw size={17} />}
                                title="Returns and support"
                                description="Contact us for return or replacement queries."
                            />
                        </div>

                        <div className="mt-10 border-t border-[#e6dfd9] pt-7">
                            <p className="text-sm font-semibold">
                                Looking for furniture?
                            </p>

                            <p className="mt-1 text-sm text-[#7b716a]">
                                Explore our latest furniture collection.
                            </p>

                            <Link
                                href="/store"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#93633e] transition hover:text-[#70482c]"
                            >
                                Browse collection
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* =================================
                        CONTACT FORM
                    ================================== */}
                    <div className="rounded-2xl border border-[#e6dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(72,49,32,0.04)] sm:p-7 md:p-8">
                        <div className="mb-7">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#93633e]">
                                Send a message
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                                We&apos;d love to hear from you
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#7b716a]">
                                Fill in the details below and our team will
                                get back to you as soon as possible.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField
                                    id="name"
                                    name="name"
                                    label="Full name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                />

                                <FormField
                                    id="email"
                                    name="email"
                                    label="Email address"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField
                                    id="phone"
                                    name="phone"
                                    label="Phone number"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit number"
                                    maxLength={10}
                                />

                                <FormField
                                    id="subject"
                                    name="subject"
                                    label="Subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-xs font-semibold text-[#4d443e]"
                                >
                                    Message
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    required
                                    placeholder="Write your message here..."
                                    className="w-full resize-none rounded-xl border border-[#ddd5ce] bg-[#fdfcfb] px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa099] focus:border-[#93633e] focus:bg-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#93633e] text-sm font-semibold text-white transition hover:bg-[#7c522f] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        Send message
                                        <Send size={16} />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs leading-5 text-[#91867e]">
                                Your information will only be used to respond
                                to your enquiry.
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

/* =====================================
   CONTACT INFO COMPONENT
===================================== */

function ContactInfo({
    icon,
    title,
    firstLine,
    secondLine,
}) {
    return (
        <div className="border-b border-[#e7e0d9] p-5 last:border-b-0 sm:p-6 sm:nth-[2]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3ece5] text-[#93633e]">
                    {icon}
                </div>

                <div className="min-w-0">
                    <h3 className="text-sm font-semibold">
                        {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#776d66]">
                        {firstLine}
                        <br />
                        {secondLine}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* =====================================
   SUPPORT ITEM COMPONENT
===================================== */

function SupportItem({
    icon,
    title,
    description,
}) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee6df] text-[#93633e]">
                {icon}
            </div>

            <div>
                <p className="text-sm font-semibold">
                    {title}
                </p>

                <p className="mt-1 text-sm leading-6 text-[#7b716a]">
                    {description}
                </p>
            </div>
        </div>
    );
}

/* =====================================
   FORM FIELD COMPONENT
===================================== */

function FormField({
    id,
    name,
    label,
    type = "text",
    required = false,
    value,
    onChange,
    placeholder,
    maxLength,
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-xs font-semibold text-[#4d443e]"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                required={required}
                className="h-12 w-full rounded-xl border border-[#ddd5ce] bg-[#fdfcfb] px-4 text-sm outline-none transition placeholder:text-[#aaa099] focus:border-[#93633e] focus:bg-white"
            />
        </div>
    );
}