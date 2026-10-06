import { fetchCategory, fetchRooms } from "@/utils/api";
import FilterSection from "./FilterSection";
import PriceFilter from "./PriceFilter";

export default async function Filter() {
    const room = await fetchRooms({ status: true });
    const category = await fetchCategory();
    return (
        <aside className="w-70 bg-white rounded-xl  p-6 space-y-8">

            <FilterSection
                title="Room Type"
                data={room.data}
                queryKey="roomtype"
            />


            <FilterSection
                title="Category"
                data={category.data}
                queryKey="category"
            />
            <PriceFilter />

        </aside>
    );
}