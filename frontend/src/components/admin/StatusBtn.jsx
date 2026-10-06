 'use client'

import { client } from '@/utils/helper.js';
import { useRouter } from 'next/navigation';
import React from 'react'

import { toast } from 'sonner';

export default function StatusBtn({ path, status }) {
 const router = useRouter()
      function StatusHandler() {

         client.patch(path).then(
            (response) => {
                if (response.data.success) {
                    toast.success(response.data.message);
    router.refresh()       
                }
            }
        ).catch(
            (error) => {
                toast.error(error.response.data.message || 'Internal Server Error')
           }
        )
    } 

  return (
      <div
      onClick={StatusHandler}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  status
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
                   }`}
                   >
                  <div
                  className={`h-2 w-2 rounded-full ${
                  status ? "bg-emerald-500" : "bg-red-500"
                  }`}
                 />
                 {status 
                ? "Active" 
                : "Inactive"}
                </div>

  )
}
