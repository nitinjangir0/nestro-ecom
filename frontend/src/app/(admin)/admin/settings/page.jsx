"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, UserRound, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { client } from "@/utils/helper";

export default function SettingsPage() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ===============================
  // GET USERS
  // ===============================

  const fetchUsers = async () => {
    try {

      setLoading(true);

      const response = await client.get(
        "user/admin/users"
      );

      if (response.data?.success) {
        setUsers(response.data.users || []);
      } else {
        toast.error(
          response.data?.message || "Unable to fetch users"
        );
      }

    } catch (error) {

      console.log(
        "GET USERS ERROR:",
        error?.response?.data || error.message
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to fetch users"
      );

    } finally {
      setLoading(false);
    }
  };


  // ===============================
  // UPDATE ROLE
  // ===============================

  const handleRoleChange = async (userId, newRole) => {

    try {

      setUpdatingId(userId);

      const response = await client.patch(
        `user/admin/users/${userId}/role`,
        {
          role: newRole
        }
      );

      if (response.data?.success) {

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  role: newRole
                }
              : user
          )
        );

        toast.success(
          response.data.message ||
          "User role updated successfully"
        );

      } else {

        toast.error(
          response.data?.message ||
          "Unable to update role"
        );
      }

    } catch (error) {

      console.log(
        "UPDATE ROLE ERROR:",
        error?.response?.data || error.message
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to update role"
      );

    } finally {

      setUpdatingId(null);

    }
  };


  // ===============================
  // LOAD USERS
  // ===============================

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <div className="w-full">

      {/* ===============================
          PAGE HEADER
      =============================== */}

      <div className="flex items-center justify-between mb-5">

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Settings
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage user roles and admin permissions
          </p>
        </div>


        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>


      {/* ===============================
          ROLE MANAGEMENT CARD
      =============================== */}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        {/* Card Header */}

        <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <ShieldCheck
              size={19}
              className="text-gray-700"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Role Management
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Manage access levels for registered users
            </p>
          </div>

        </div>


        {/* ===============================
            LOADING
        =============================== */}

        {loading ? (

          <div className="px-5 py-12 text-center text-sm text-gray-500">
            Loading users...
          </div>

        ) : users.length === 0 ? (

          <div className="px-5 py-12 text-center">

            <UserRound
              size={32}
              className="mx-auto text-gray-400 mb-2"
            />

            <p className="text-sm text-gray-500">
              No users found
            </p>

          </div>

        ) : (

          /* ===============================
             TABLE
          =============================== */

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">

                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    User
                  </th>

                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Current Role
                  </th>

                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Change Role
                  </th>

                </tr>
              </thead>


              <tbody>

                {users.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 transition"
                  >

                    {/* USER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <UserRound
                            size={17}
                            className="text-gray-600"
                          />
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>

                          {user.mobile && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {user.mobile}
                            </p>
                          )}
                        </div>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td className="px-5 py-4 text-gray-600">
                      {user.email}
                    </td>


                    {/* CURRENT ROLE */}

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === "superadmin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>

                    </td>


                    {/* ROLE DROPDOWN */}

                    <td className="px-5 py-4">

                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value
                          )
                        }
                        className="w-36 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 outline-none focus:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >

                        <option value="user">
                          User
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                        <option value="superadmin">
                          Superadmin
                        </option>

                      </select>

                      {updatingId === user._id && (
                        <span className="ml-2 text-xs text-gray-500">
                          Updating...
                        </span>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}