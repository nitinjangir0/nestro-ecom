import Filter from "@/components/website/Filter";
import { fetchCategory, fetchRooms } from "@/utils/api";

export default async function Layout({ children }) {
    const room = await fetchRooms({ status: true });
    const category = await fetchCategory();

    return (
        <div className="mx-auto max-w-7xl px-4 py-4">

            <div className="flex items-start gap-6">

                {/* Desktop Filter Sidebar */}
                <aside className="hidden w-[280px] shrink-0 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                    <Filter />
                </aside>

                {/* Products Area */}
                <main className="min-w-0 flex-1">
                    {children}
                </main>

            </div>

        </div>
    );
}