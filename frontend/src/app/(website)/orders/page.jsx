import { redirect } from "next/navigation";
import { getMyOrders } from "@/utils/serverapi";

import OrdersList from "@/components/website/OrdersList";


export default async function OrdersPage() {

    const ordersResponse = await getMyOrders();

    if (!ordersResponse.success) {
        redirect("/login");
    }

    const orders = ordersResponse.data || [];

    return (
        <section className="min-h-screen bg-[#FAF8F6] py-1">

            <div className="mx-auto max-w-2xl px-1">

                {/* HEADER */}

                <div className="mb-2">

                    <h1 className="text-md font-semibold text-[#2F221B]">
                        My Orders
                    </h1>

                    <p className="mt-1 text-sm text-[#8A7667]">
                        View and track all your orders
                    </p>

                </div>


                {/* ORDERS */}

                <OrdersList orders={orders} />

            </div>

        </section>
    );
}