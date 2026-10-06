import { redirect } from "next/navigation";
import { getProfile } from "@/utils/serverapi";

import ProfileCard from "@/components/website/ProfileCard";
import ProfileMenu from "@/components/website/ProfileMenu";

export default async function ProfilePage() {
    const profile = await getProfile();

    if (!profile.success) {
        redirect("/login");
    }

    const role = profile.data?.role?.toLowerCase();

    const isAdmin =
        role === "admin" ||
        role === "superadmin";

    const menus = isAdmin
        ? [
              ...profile.menu,
              {
                  id: "admin-panel",
                  title: "Admin Panel",
                  href: "/admin",
                  icon: "LayoutDashboard",
              },
          ]
        : profile.menu;

    return (
        <section className="bg-[#FAF8F6] min-h-screen py-10">

            <div className="mx-auto max-w-7xl px-4 lg:px-8">

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

                    {/* Sidebar */}

                    <aside className="lg:col-span-3">

                        <div className="sticky top-24">

                            <ProfileMenu menus={menus} />

                        </div>

                    </aside>

                    {/* Content */}

                    <main className="lg:col-span-9">

                        <ProfileCard user={profile.data} />

                    </main>

                </div>

            </div>

        </section>
    );
}