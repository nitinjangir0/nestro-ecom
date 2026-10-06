import React from 'react';
import Link from 'next/link';
import { MdAdd } from 'react-icons/md'; 

export default function TableHeader({title = "data", path = "/admin" }) {
  return (
    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-xl lg:text-2xl font-black tracking-tight text-gray-900">
            {title} List
        </h1>      
      </div>
    
    <Link href={path}>
    <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:text-white transition-all hover:bg-black active:scale-95 shadow-sm">
        <MdAdd className="text-sm" />
        <span>Create {title}</span>
      </button>
    </Link>

    </div>
  );
}