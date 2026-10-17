import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

        if (token && backendUrl) {
            const normalizedUrl = backendUrl.endsWith("/")
                ? backendUrl
                : `${backendUrl}/`;

            await fetch(`${normalizedUrl}user/logout`, {
                method: "POST",
                headers: {
                    Authorization: token,
                },
                cache: "no-store",
            });
        }

        const response = NextResponse.json({
            success: true,
            message: "Logout successful",
        });

        response.cookies.set("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        console.error("Logout proxy error:", error);

        const response = NextResponse.json(
            {
                success: false,
                message: "Unable to logout",
            },
            { status: 500 }
        );

        response.cookies.set("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
            expires: new Date(0),
        });

        return response;
    }
}
