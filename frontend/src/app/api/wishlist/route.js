
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function wishlistRequest(request, path, method = "GET") {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
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

        const response = await fetch(`${baseUrl}wishlist${path}`, {
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

export async function GET() {
    return wishlistRequest(null, "");
}
