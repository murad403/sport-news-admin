"use client";

import React, { useState, useEffect } from "react";
import { Search, Trash2, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import DeleteNewsletterModal from "./DeleteNewsletterModal";
import CustomPagination from "@/components/shared/CustomPagination";
import { Newsletter } from "@/redux/features/newsletter/newsletter.type";
import {
  useGetNewsLetterQuery,
  useDeleteNewsletterMutation,
} from "@/redux/features/newsletter/newsletter.api";

export default function NewsletterPage() {
  const { toast } = useToast();

  // Search filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch newsletter subscribers using RTK Query
  const { data, isLoading, isError } = useGetNewsLetterQuery({
    page,
    search: debouncedSearch,
  });

  const subscribers = data?.results || [];
  const totalSubscribers = data?.count || 0;

  // Mutation hook for deleting a subscriber
  const [deleteNewsletter, { isLoading: isDeleting }] = useDeleteNewsletterMutation();

  // Modal control states
  const [selectedSub, setSelectedSub] = useState<Newsletter | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Delete handler
  const handleDeleteSubscriber = async () => {
    if (!selectedSub) return;
    try {
      await deleteNewsletter(selectedSub.id).unwrap();
      toast(`Subscriber "${selectedSub.email}" deleted successfully!`, "success");
      setIsDeleteOpen(false);
      setSelectedSub(null);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to delete subscriber.";
      toast(errorMsg, "error");
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Count active subscribers on current page
  const activeCount = subscribers.filter((sub) => sub.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Newsletter Subscribers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage subscriber email list for sending newsletters and updates.
          </p>
        </div>
      </div>

      {/* Newsletter Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
        {/* Total Subscribers Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Subscribers</span>
            <p className="text-2xl font-bold text-white mt-1">{totalSubscribers}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-300">
            <Mail className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Active on Current Page Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Active (This Page)</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-lg bg-slate-900/40 backdrop-blur-md border border-slate-800/60 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search subscribers by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/50 rounded-lg text-xs text-slate-100 placeholder-slate-550 outline-none transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/40 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">Subscriber</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 whitespace-nowrap">Subscribed At</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-[10px] text-slate-500 mt-1">Loading subscribers...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2 text-rose-450">
                      <AlertCircle className="w-8 h-8" />
                      <p className="font-semibold">Error loading subscribers</p>
                      <p className="text-[10px] text-slate-500">Please try refreshing the page.</p>
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-slate-400">No subscribers found</p>
                      <p className="text-[10px] text-slate-500">Try modifying your search filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-900/20 transition-colors group animate-in fade-in duration-200">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-300 uppercase animate-pulse-subtle">
                          {sub.email.slice(0, 2)}
                        </div>
                        <span className="font-semibold text-slate-200">{sub.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      {sub.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800/80 text-slate-400 border border-slate-700/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-550" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-slate-450 font-mono text-[10px]">
                      {formatDate(sub.subscribed_at)}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all active:scale-95"
                          title="Delete Subscriber"
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

        {/* Custom Pagination */}
        <CustomPagination
          count={totalSubscribers}
          page={page}
          pageSize={20}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* Delete Modal */}
      {selectedSub && (
        <DeleteNewsletterModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedSub(null);
          }}
          onConfirm={handleDeleteSubscriber}
          email={selectedSub.email}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}