"use client";

import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Eye, Users, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import UserDetailsModal from "./UserDetailsModal";
import CustomPagination from "@/components/shared/CustomPagination";
import { User, GetUsersQueryArg } from "@/redux/features/users/users.type";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/features/users/users.api";

export default function UserManagementPage() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("");
  const [isEmailVerifiedFilter, setIsEmailVerifiedFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, isActiveFilter, isEmailVerifiedFilter]);

  const queryArgs: GetUsersQueryArg = {
    page,
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    is_active: isActiveFilter === "true" ? true : isActiveFilter === "false" ? false : undefined,
    is_email_verified: isEmailVerifiedFilter === "true" ? true : isEmailVerifiedFilter === "false" ? false : undefined,
  };

  const { data, isLoading } = useGetUsersQuery(queryArgs);

  const users = data?.results || [];
  const totalUsers = data?.count || 0;

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleEditUser = async (updatedData: {
    name: string;
    role: "reader" | "author" | "editor" | "admin";
    bio: string;
    is_active: boolean;
    is_email_verified: boolean;
  }) => {
    if (!selectedUser) return;
    try {
      await updateUser({
        id: selectedUser.id,
        data: updatedData,
      }).unwrap();
      toast(`User profile updated successfully!`, "success");
      setIsEditOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to update user.";
      toast(errorMsg, "error");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id).unwrap();
      toast(`User account successfully deleted!`, "success");
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to delete user.";
      toast(errorMsg, "error");
    }
  };

  const renderRoleBadge = (role: User["role"]) => {
    const styles = {
      admin: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      editor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      author: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      reader: "bg-slate-800 text-slate-400 border-slate-700",
    };
    return (
      <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border tracking-wide uppercase ${styles[role] || styles.reader}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Administer system users, change roles, suspend accounts, and configure verification details.
          </p>
        </div>
      </div>

      <div className="max-w-xs">
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Members</span>
            <p className="text-2xl font-bold text-white mt-1">{totalUsers}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300">
            <Users className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Role</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
            >
              <option value="">--</option>
              <option value="reader">Reader</option>
              <option value="author">Author</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Active</span>
            <select
              value={isActiveFilter}
              onChange={(e) => setIsActiveFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
            >
              <option value="">--</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Verified</span>
            <select
              value={isEmailVerifiedFilter}
              onChange={(e) => setIsEmailVerifiedFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
            >
              <option value="">--</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/40 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">Member</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Registered On</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-[10px] text-slate-500 mt-1">Loading users list...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-slate-400">No users found</p>
                      <p className="text-[10px] text-slate-500">Try modifying your filter settings.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/20 transition-colors group animate-in fade-in duration-200">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full border border-slate-750 object-cover shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-850 border border-slate-755 flex items-center justify-center font-bold text-xs text-indigo-300 shadow-sm uppercase shrink-0">
                            {user.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-200 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-2">
                      {renderRoleBadge(user.role)}
                    </td>

                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border flex items-center gap-1 w-fit ${
                        user.is_active 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.is_active ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                        }`} />
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-4 px-2 text-slate-500 font-sans">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setViewUserId(user.id);
                            setIsDetailsOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <CustomPagination
          count={totalUsers}
          page={page}
          pageSize={20}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>

      {viewUserId && (
        <UserDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setViewUserId(null);
          }}
          userId={viewUserId}
        />
      )}

      {selectedUser && (
        <EditUserModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleEditUser}
          currentUser={selectedUser}
          isLoading={isUpdating}
        />
      )}

      {selectedUser && (
        <DeleteUserModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteUser}
          userName={selectedUser.name}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
