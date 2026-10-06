import { MdSearch, MdAdd } from "react-icons/md"; 

export default function TableFilter() {
  return (
        //    filter section
                <div className="p-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* search bar */}
                    <div className="relative flex-1 max-w-md">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input 
                            type="text" 
                            placeholder="Search rooms..." 
                            className="w-sm lg:w-xl rounded-xl border text-black border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white"
                        />
                    </div>

                    {/* DROPDOWNS (Status & Category) */}
                    <div className="flex items-center gap-3">
                        {/* All Status */}
                        <select className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-600 outline-none transition-all focus:border-blue-500 focus:bg-white">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* All Category */}
                        <select className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-600 outline-none transition-all focus:border-blue-500 focus:bg-white">
                            <option value="">All Category</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="super-deluxe">Super Deluxe</option>
                            <option value="suite">Suite</option>
                        </select>
                    </div>

                </div>
  )
}
