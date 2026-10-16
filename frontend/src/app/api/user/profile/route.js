
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
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

        const normalizedUrl = backendUrl.endsWith("/")
            ? backendUrl
            : `${backendUrl}/`;

        const response = await fetch(
            `${normalizedUrl}user/profile`,
            {
                method: "GET",
                headers: {
                    Authorization: token,
                },
                cache: "no-store",
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Profile proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to fetch profile" },
            { status: 500 }
        );
    }
}
