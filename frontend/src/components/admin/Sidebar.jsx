'use client'

import React, { useState } from 'react'
import { FaBars } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { MdOutlineChair } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { SlLayers } from "react-icons/sl";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { FaOpencart } from "react-icons/fa6";
import { LuWarehouse } from "react-icons/lu";
import { RiSettingsLine } from "react-icons/ri";
import { RxCrossCircled } from "react-icons/rx";
import { RiApps2Line } from "react-icons/ri";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
    const pathname = usePathname();
    
    
    const [toggle, setToggle] = useState(false);
    const menuItems = [
    { 
        name: "Dashboard", 
        path: "/admin", 
        icon: <GoHome /> 
    },
    {
    name: "Category",
    path: "/admin/category",
    icon: <RiApps2Line/>
    },
    {
    name: "Nestro Menu",
    path: "/admin/nestro-menu",
    icon: <SlLayers/>

  },
  {
    name: "Product", 
    path: "/admin/product",
    icon: <FaPeopleCarryBox/>
  },
  {
    name: "Orders", 
    path: "/admin/orders",
    icon: <FaOpencart/>
  },
  {
    name: "Room-type",
    path: "/admin/room-type",
    icon: <LuWarehouse/>
  },
  {
    name: "Settings", 
    path: "/admin/settings",
    icon: <RiSettingsLine/> 
  }
    
];
  return (
    <div className={` ${toggle ? 'w-20' : 'w-64'} duration-200 h-screen bg-[#3b497e]`}>
        <div className="flex justify-around items-center py-4 px-3 border-b-1 border-white">
       <div className='flex items-center gap-2'>
        <MdOutlineChair className="text-3xl text-white" />
 
         { !toggle && <h1 className="text-2xl font-bold">Nestro</h1> }  
       </div>
            

          <button onClick={() => setToggle(!toggle)} className="text-xl text-white hover:text-gray-300 transition-all duration-300 transform active:scale-95">
                    {toggle ? <RxCrossCircled /> : <FaBars />}
        </button>
        </div>

        <div className='mt-6 pe-3'>
            { 
        menuItems.map((item, index)=>{
            const active = pathname === item.path
            return(
                <Link key={index} style={{ borderRadius: "0px 20px 20px 0px"}} href={item.path} className={`px-4 py-3 mb-3 text-white relative flex items-center gap-3 group transition-all duration-200
                ${active ? "bg-[#ffffff1a]": ""} hover:bg-[#ffffff1a] flex items-center gap-3`} >
             {item.icon}
          {!toggle && <span>{item.name}</span>}
        {!toggle && item.name === "Dashboard" && (
                                <MdKeyboardArrowUp className='ml-auto text-xl' />
                            )}
                            
    {toggle && (
      <div className="absolute left-20 scale-0 pointer-events-none transition-all duration-150 origin-left rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white z-50 whitespace-nowrap
        group-hover:scale-100 group-hover:translate-x-4"
      >
        {item.name}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
      </div>
    )}
            </Link>
            )
        })
            }
        </div>
    </div>
  )
}
