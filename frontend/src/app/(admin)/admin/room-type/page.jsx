
import ActionDropdown from "@/components/admin/ActionDropdown";
import { fetchRooms } from "@/utils/api";
import TableHeader from "@/components/admin/TableHeader";
import TableFilter from "@/components/admin/TableFilter";
import StatusBtn from "@/components/admin/StatusBtn";

export default async function Page() {
  const rooms = await fetchRooms();

   if (rooms?.success === false){
    throw new Error(rooms?.message || "failed to fetch rooms");
  }
  return (
        <div className="min-h-screen p-2 lg:p-6">
      <TableHeader title="Room Type"
       path = "/admin/room-type/add" />
            {/* MAIN CARD */}
            <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
       
       <TableFilter/>

                {/* TABLE HEADER */}
                <div className="hidden grid-cols-12 border-b border-gray-100 bg-gray-50 px-4 py-3 lg:grid">

                    <div className="col-span-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            ID
                        </p>
                    </div>

                    <div className="col-span-5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Name
                        </p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Slug
                        </p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Status
                        </p>
                    </div>

                    <div className="col-span-2 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Action
                        </p>
                    </div>
                </div>

                {/* TABLE BODY */}
                <div>

                 {
                    rooms?.data?.length  === 0 ?(
                        <div className="flex min-h-[300px] item-center justify-center  ">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    No Rooms Found 
                                </h2>

                                <p className="mt-2 text-sm texr-gray-500">
                                    There are no rooms type available right now
                                </p>
                            </div>
                        </div>

                    ):(
                 

                        rooms?.data?.map((item, index) => {
                            return (
                                <div
                                    key={item._id || index}
                                    className="grid grid-cols-1 gap-3 border-b border-gray-100 px-4 py-4 transition-all duration-300 hover:bg-gray-50/60 lg:grid-cols-12 lg:items-center"
                                >

                                    {/* ID */}
                                    <div className="hidden lg:block lg:col-span-1">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-700">
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* ROOM INFO */}
                                    <div className="flex items-center gap-3 lg:col-span-5">
                                        <div className="min-w-0">
                                            <h2 className="truncate text-sm font-bold text-gray-900">
                                                {item.name}
                                            </h2> 
                                            <p className="mt-1 text-[11px] text-gray-500 lg:hidden">
                                                {item.slug}
                                            </p>
                                        </div>
                                    </div>

                                    {/* SLUG */}
                                    <div className="hidden lg:block lg:col-span-2">
                                        <div className="inline-flex rounded-xl bg-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-600">
                                            {item.slug}
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div className="lg:col-span-2">
                                    <StatusBtn  status = {item.status} path={`room-type/status-update/${item._id}`} />
                                    </div>

                                    {/* ACTION */}
                                    <div className="hidden justify-end lg:col-span-2 lg:flex">
                                       <ActionDropdown module="room-type" id={item._id} />
                                    </div>

                                </div>
                            );
                      })
                    )
                    }
                </div>
            </div>
        </div>
  );
}