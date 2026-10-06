"use client";

import React, { useState } from "react";
import {
  MapPin,
  Plus
} from "lucide-react";

import { client } from "@/utils/helper";
import { toast } from "react-toastify";

import AddressCard from "@/components/website/AddressCard";
import AddressForm from "@/components/website/AddressForm";

export default function AddressPage({ user }) {

  const [addresses, setAddresses] = useState(user?.addresses || []);

  const [editAddress, setEditAddress] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const handleDeleteAddress = (updatedAddresses) => {

    setAddresses(updatedAddresses);

  };

  const handleDefaultAddress = async (id) => {

    try {

      const response = await client.put(
        `/user/default-address/${id}`
      );

      if (response.data.success) {

        toast.success(response.data.message);

        setAddresses(response.data.addresses);

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };
    return (
  <>
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-stone-100 p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">

          <div className="p-2 bg-amber-50 rounded-xl">
            <MapPin className="text-amber-800 w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-stone-800 tracking-tight">
            My Addresses
          </h2>

        </div>

        <button
          onClick={() => {
            setEditAddress(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-amber-900 text-white px-2 py-2 rounded-xl hover:bg-amber-800 transition"
        >
          <Plus size={18} />
          Add Address
        </button>

      </div>

      {/* Empty State */}

      {addresses.length === 0 ? (

        <div className="text-center py-12 border-2 border-dashed border-stone-100 rounded-2xl">

          <p className="text-stone-400 mb-5">
            No addresses saved yet.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-900 text-white px-5 py-2 rounded-xl hover:bg-amber-800"
          >
            Add Address
          </button>

        </div>

      ) : (

        <div className="space-y-4">

          {addresses.map((address) => (

            <AddressCard
              key={address._id}
              address={address}

              showSelection={false}

              setShowForm={setShowForm}
              setEditAddress={setEditAddress}

              handleDeleteAddress={handleDeleteAddress}
              handleDefaultAddress={handleDefaultAddress}
            />

          ))}

        </div>

      )}

    </div>

    {/* Address Form */}

    {showForm && (

      <AddressForm
        setShowForm={setShowForm}
        setAddresses={setAddresses}
        editAddress={editAddress}
        setEditAddress={setEditAddress}
      />

    )}

  </>
);
}