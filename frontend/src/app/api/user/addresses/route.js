
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

        const body = await request.json();
        const normalizedUrl = backendUrl.endsWith("/")
            ? backendUrl
            : `${backendUrl}/`;

        const response = await fetch(
            `${normalizedUrl}user/add-address`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Add address proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to add address" },
            { status: 500 }
        );
    }
}
