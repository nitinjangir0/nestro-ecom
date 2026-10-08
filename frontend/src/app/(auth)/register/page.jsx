"use client";

import { client } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    async function registerHandler(e) {
        e.preventDefault();
        if (
            !formData.name ||
            !formData.email ||
            !formData.password
        ) {
            toast.error("All fields are required");
            return;
        }
        try {
            setLoading(true);
            const response = await client.post(
                "user/register",
                formData
            );
            if (response.data.success) {
                toast.success(response.data.message);

                if (response.data.otp) {
                    toast.success(`Development OTP: ${response.data.otp}`, {
                        duration: 15000
                    });
                }

                setFormData({
                    name: "",
                    email: "",
                    password: ""
                });

                router.push(`/verify-otp?email=${response.data.user}`);
            }

        }
        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Internal Server Error"
            );

        }
        finally {

            setLoading(false);

        }

    }





    return (

        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f5f1] px-5">


            <form

                onSubmit={registerHandler}

                className="max-w-md w-full bg-white p-8 rounded-2xl shadow"

            >



                <h2 className="text-3xl font-semibold">
                    Create account
                </h2>



                <p className="text-gray-500 mt-2 mb-10">
                    Create your Nestro account.
                </p>





                <label htmlFor="name">
                    Name
                </label>


                <input

                    id="name"

                    name="name"

                    value={formData.name}

                    onChange={handleChange}

                    type="text"

                    placeholder="Rahul"

                    className="w-full mt-2 mb-5 px-5 py-4 border rounded-xl"

                />







                <label htmlFor="email">
                    Email address
                </label>


                <input

                    id="email"

                    name="email"

                    value={formData.email}

                    onChange={handleChange}

                    type="email"

                    placeholder="rahul@email.com"

                    className="w-full mt-2 mb-5 px-5 py-4 border rounded-xl"

                />









                <label htmlFor="password">
                    Password
                </label>


                <input

                    id="password"

                    name="password"

                    value={formData.password}

                    onChange={handleChange}

                    type="password"

                    placeholder="••••••••"

                    className="w-full mt-2 px-5 py-4 border rounded-xl"

                />







                <button

                    disabled={loading}

                    className="w-full mt-6 bg-[#93633e] text-white py-4 rounded-xl disabled:opacity-50"

                >

                    {
                        loading
                            ? "Creating..."
                            : "Create account"
                    }


                </button>








                <div className="text-center mt-8 text-gray-500">


                    Already have account?


                    <button

                        type="button"

                        onClick={() => router.push("/login")}

                        className="text-[#93633e] ml-2"

                    >

                        Sign in

                    </button>


                </div>




            </form>



        </div>

    );

}