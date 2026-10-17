
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request, { params }) {
    return forwardRequest(request, params, "POST");
}

export async function DELETE(request, { params }) {
    return forwardRequest(request, params, "DELETE");
}

export async function GET(request, { params }) {
    return forwardRequest(request, params, "GET");
}

async function forwardRequest(request, params, method) {
    try {
        const { path = [] } = await params;
        const token = (await cookies()).get("jwt")?.value;
        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
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

        const endpoint = path.map(encodeURIComponent).join("/");
        const url = `${baseUrl}wishlist/${endpoint}`;

        const response = await fetch(url, {
            method,
            headers: {
                Authorization: token,
            },
            cache: "no-store",
        });

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Wishlist proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to connect to wishlist service" },
            { status: 500 }
        );
    }
}
