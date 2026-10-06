import { redirect } from "next/navigation";
import { getProfile } from "@/utils/serverapi";

import WishlistPageClient from "@/components/website/WishlistPageClient";

export default async function WishlistPage() {

    const profile = await getProfile();

    if (!profile.success) {
        redirect("/login");
    }

    return (
        <WishlistPageClient
            user={profile.data}
        />
    );
}