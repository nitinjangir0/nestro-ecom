
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        if (!backendUrl) {
            return NextResponse.json(
                { success: false, message: "Backend URL is not configured" },
                { status: 500 }
            );
        }

        const baseUrl = backendUrl.endsWith("/")
            ? backendUrl
            : `${backendUrl}/`;

        const body = await request.json();

        const response = await fetch(`${baseUrl}cart/add-to-cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const text = await response.text();

        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            return NextResponse.json(
                { success: false, message: "Backend returned an invalid response" },
                { status: 502 }
            );
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Add to Cart Proxy Error:", error);

        return NextResponse.json(
            { success: false, message: "Cart request failed" },
            { status: 500 }
        );
    }
}
