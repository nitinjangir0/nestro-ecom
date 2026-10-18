
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function forwardRequest(request, method, endpoint, includeBody = false) {
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

        const headers = { Authorization: token };
        const options = {
            method,
            headers,
            cache: "no-store",
        };

        if (includeBody) {
            const body = await request.json();
            headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${normalizedUrl}${endpoint}`, options);
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Address proxy error:", error);

        return NextResponse.json(
            { success: false, message: "Address request failed" },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { addressId } = await params;
    const action = new URL(request.url).searchParams.get("action");

    if (action === "default") {
        return forwardRequest(
            request,
            "PUT",
            `user/default-address/${addressId}`
        );
    }

    return forwardRequest(
        request,
        "PUT",
        `user/update-address/${addressId}`,
        true
    );
}

export async function PATCH(request, { params }) {
    const { addressId } = await params;

    return forwardRequest(
        request,
        "PATCH",
        `user/default-address/${addressId}`
    );
}

export async function DELETE(request, { params }) {
    const { addressId } = await params;

    return forwardRequest(
        request,
        "DELETE",
        `user/delete-address/${addressId}`
    );
}
