"use client";

import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, Key, Users, UserCheck, ShieldCheck, Mail, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import ResetPasswordModal from "./ResetPasswordModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Contributor" | "Viewer";
  status: "Active" | "Pending" | "Suspended";
  joinedAt: string;
}

export default function UserManagementPage() {
  const { toast } = useToast();

  // Local state for users list
  const [users, setUsers] = useState<User[]>([
    { id: "usr-1", name: "Marcus Vance", email: "marcus.vance@sportnews.com", role: "Admin", status: "Active", joinedAt: "Jan 15, 2025" },
    { id: "usr-2", name: "Sarah Connor", email: "sarah.connor@sportnews.com", role: "Editor", status: "Active", joinedAt: "Feb 08, 2025" },
    { id: "usr-3", name: "David Beckham", email: "david.b@sportnews.com", role: "Contributor", status: "Pending", joinedAt: "Jun 19, 2025" },
    { id: "usr-4", name: "Elena Rostova", email: "elena.r@sportnews.com", role: "Editor", status: "Active", joinedAt: "Mar 22, 2025" },
    { id: "usr-5", name: "John Doe", email: "john.doe@sportnews.com", role: "Viewer", status: "Suspended", joinedAt: "Apr 11, 2025" },
    { id: "usr-6", name: "Liam Gallagher", email: "liam.g@sportnews.com", role: "Contributor", status: "Active", joinedAt: "May 30, 2025" },
    { id: "usr-7", name: "Emma Watson", email: "emma.watson@sportnews.com", role: "Editor", status: "Active", joinedAt: "Jul 01, 2025" },
  ]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modal control states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // CRUD actions
  const handleAddUser = (data: {
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Contributor" | "Viewer";
    status: "Active" | "Pending" | "Suspended";
  }) => {
    // Check duplication
    const duplicate = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (duplicate) {
      toast("A user with this email address already exists!", "error");
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      joinedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setUsers((prev) => [newUser, ...prev]);
    toast(`User profile for "${data.name}" created successfully!`, "success");
    setIsAddOpen(false);
  };

  const handleEditUser = (data: {
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Contributor" | "Viewer";
    status: "Active" | "Pending" | "Suspended";
  }) => {
    if (!selectedUser) return;

    // Check duplication excluding editing user
    const duplicate = users.some(
      (u) => u.id !== selectedUser.id && u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (duplicate) {
      toast("A user with this email address already exists!", "error");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: data.name,
              email: data.email,
              role: data.role,
              status: data.status,
            }
          : u
      )
    );

    toast(`User settings for "${data.name}" updated!`, "success");
    setIsEditOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    toast(`User "${selectedUser.name}" successfully deleted!`, "success");
    setIsDeleteOpen(false);
    setSelectedUser(null);
  };

  // Filter users based on query and selectors
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Analytics helper variables
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const pendingUsers = users.filter((u) => u.status === "Pending").length;
  const adminEditorUsers = users.filter((u) => u.role === "Admin" || u.role === "Editor").length;

  // Render Role Badge
  const renderRoleBadge = (role: User["role"]) => {
    const styles = {
      Admin: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      Editor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      Contributor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      Viewer: "bg-slate-800 text-slate-400 border-slate-700",
    };
    return (
      <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border tracking-wide uppercase ${styles[role]}`}>
        {role}
      </span>
    );
  };

  // Render Status Badge
  const renderStatusBadge = (status: User["status"]) => {
    const styles = {
      Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Suspended: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };
    return (
      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border flex items-center gap-1 w-fit ${styles[status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          status === "Active" ? "bg-emerald-400 animate-pulse" :
          status === "Pending" ? "bg-amber-400" : "bg-rose-400"
        }`} />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Administer system users, change roles, suspend accounts, invite writers, and configure security permissions.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Members</span>
            <p className="text-2xl font-bold text-white mt-1">{totalUsers}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300">
            <Users className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Active Members */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Active Users</span>
            <p className="text-2xl font-bold text-white mt-1">{activeUsers}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300">
            <UserCheck className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Pending Invites */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pending Invites</span>
            <p className="text-2xl font-bold text-white mt-1">{pendingUsers}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300">
            <Mail className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Admins & Editors */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Admins / Editors</span>
            <p className="text-2xl font-bold text-white mt-1">{adminEditorUsers}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-300">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Role</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Contributor">Contributor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-slate-400">No users found</p>
                      <p className="text-[10px] text-slate-500">Try modifying your query or status settings.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/20 transition-colors group animate-in fade-in duration-200">
                    {/* User profile details */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-850 border border-slate-750 flex items-center justify-center font-bold text-xs text-indigo-300 shadow-sm uppercase shrink-0">
                          {user.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-200 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="py-4 px-2">
                      {renderRoleBadge(user.role)}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-2">
                      {renderStatusBadge(user.status)}
                    </td>

                    {/* Registration/Joined date */}
                    <td className="py-4 px-2 text-slate-500 font-sans">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        {user.joinedAt}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
                            setIsResetOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
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
      </div>

      {/* Modals containers */}
      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleEditUser}
        currentUser={selectedUser}
      />

      <DeleteUserModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        userName={selectedUser ? selectedUser.name : ""}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => {
          setIsResetOpen(false);
          setSelectedUser(null);
        }}
        userName={selectedUser ? selectedUser.name : ""}
      />
    </div>
  );
}
