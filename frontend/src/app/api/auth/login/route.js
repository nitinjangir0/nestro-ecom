
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

        if (!backendUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Backend URL is not configured",
                },
                { status: 500 }
            );
        }

        const normalizedUrl = backendUrl.endsWith("/")
            ? backendUrl
            : `${backendUrl}/`;

        const response = await fetch(
            `${normalizedUrl}user/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const data = await response.json();

        const result = NextResponse.json(data, {
            status: response.status,
        });

        const setCookie = response.headers.get("set-cookie");
        const jwtMatch = setCookie?.match(/(?:^|,\s*)jwt=([^;,\s]+)/);

        if (response.ok && jwtMatch) {
            result.cookies.set("jwt", jwtMatch[1], {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60,
            });
        }

        return result;
    } catch (error) {
        console.error("Login proxy error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to login server",
            },
            { status: 500 }
        );
    }
}

