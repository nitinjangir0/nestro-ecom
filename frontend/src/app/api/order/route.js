
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function forwardRequest(request, endpoint) {
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

        const response = await fetch(`${baseUrl}${endpoint}`, {
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
                { success: false, message: "Invalid response from backend" },
                { status: 502 }
            );
        }

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Order proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to process order request" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const { pathname } = new URL(request.url);
    const action = pathname.split("/").filter(Boolean).pop();

    const routes = {
        place: "order/place",
        verify: "order/verify",
    };

    const endpoint = routes[action];

    if (!endpoint) {
        return NextResponse.json(
            { success: false, message: "Invalid order action" },
            { status: 404 }
        );
    }

    return forwardRequest(request, endpoint);
}
