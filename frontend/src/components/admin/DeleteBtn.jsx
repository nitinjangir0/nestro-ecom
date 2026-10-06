'use client'

import { client } from '@/utils/helper.js';
import { useRouter } from 'next/navigation';
import React from 'react'

import {
  HiOutlineTrash,
} from "react-icons/hi";
import { toast } from 'sonner';
import Swal from 'sweetalert2'

export default function DeleteBtn({ path }) {
 const router = useRouter()
      function deleteHandler() {

        Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){

 
    Swal.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success"
  });

  client.delete(path).then(
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
    

   
});
       
      

      }

  return (
    <div onClick={deleteHandler} className='flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-red-500 transition-all hover:bg-red-50'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-red-100'>
      <HiOutlineTrash className="text-sm" />
        </div>
      Delete  
    </div>
  )
}
