"use client";

import React, { useState, useEffect } from "react";
import { Eye, Check, X, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Article } from "@/redux/features/articles/articles.type";
import {
  useGetRequestedArticlesQuery,
  useApproveRequestedArticleMutation,
  useRejectRequestedArticleMutation,
} from "@/redux/features/articles/articles.api";
import CustomPagination from "@/components/shared/CustomPagination";
import ReviewArticleSubmissionModal from "./ReviewArticleSubmissionModal";
import ApproveArticleModal from "./ApproveArticleModal";
import RejectArticleModal from "./RejectArticleModal";

export default function UserRequestPage() {
  const { toast } = useToast();

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

  // API Queries & Mutations
  const { data, isLoading } = useGetRequestedArticlesQuery({
    page,
    search: debouncedSearch || undefined,
  });

  const [approveArticle, { isLoading: isApproving }] = useApproveRequestedArticleMutation();
  const [rejectArticle, { isLoading: isRejecting }] = useRejectRequestedArticleMutation();

  const requests = data?.results || [];
  const totalRequests = data?.count || 0;

  // Modal active states
  const [selectedReq, setSelectedReq] = useState<Article | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  // Approval handler
  const handleApproveConfirm = async () => {
    if (!selectedReq) return;
    try {
      await approveArticle(selectedReq.id).unwrap();
      toast("Submission approved and published!", "success");
      setApproveOpen(false);
      setSelectedReq(null);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to approve article.";
      toast(errorMsg, "error");
    }
  };

  // Rejection handler
  const handleRejectConfirm = async (reason: string) => {
    if (!selectedReq) return;
    try {
      await rejectArticle({ id: selectedReq.id, reason }).unwrap();
      toast("Submission rejected. Reason logged.", "info");
      setRejectOpen(false);
      setSelectedReq(null);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to reject article.";
      toast(errorMsg, "error");
    }
  };

  const statusStyles: Record<string, string> = {
    pending: "text-amber-400 bg-amber-500/5 border-amber-500/10",
    approved: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    rejected: "text-rose-400 bg-rose-500/5 border-rose-500/10",
    draft: "text-slate-400 bg-slate-500/5 border-slate-500/10",
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Requests Approval Desk</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, approve, or reject articles submitted by general users from the frontend website.
          </p>
        </div>
        <div className="px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs font-semibold text-slate-350 self-start sm:self-center">
          Total Pending Requests: <span className="text-indigo-400 ml-1 font-bold">{totalRequests}</span>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="p-4 rounded-lg bg-slate-900/40 backdrop-blur-md border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by author or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/50 rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/40 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">Author</th>
                <th className="pb-3 px-2">Article Title</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Submitted</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-[10px] text-slate-550 mt-1">Loading requests...</p>
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-slate-400">No requests found</p>
                      <p className="text-[10px] text-slate-500">Try modifying your search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const statusText = req.status?.toLowerCase() || "pending";
                  return (
                    <tr key={req.id} className="hover:bg-slate-900/20 transition-colors group">
                      {/* Author */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-300 uppercase">
                            {req.author_name ? req.author_name.split(" ").map((n) => n[0]).join("") : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{req.author_name || "Unknown"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-4 px-2 max-w-xs md:max-w-md">
                        <p className="font-semibold text-slate-300 truncate group-hover:text-slate-100 transition-colors">
                          {req.title}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-850 text-[10px] font-semibold">
                          {req.categories?.map((c) => c.name).join(", ") || "No Category"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase ${statusStyles[statusText] || statusStyles.pending}`}>
                          {req.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-2 text-slate-500">
                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => {
                              setSelectedReq(req);
                              setViewOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
                            title="View Content"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {statusText === "pending" && (
                            <>
                              {/* Approve Button */}
                              <button
                                onClick={() => {
                                  setSelectedReq(req);
                                  setApproveOpen(true);
                                }}
                                className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all"
                                title="Approve Request"
                              >
                                <Check className="w-4 h-4" />
                              </button>

                              {/* Reject Button */}
                              <button
                                onClick={() => {
                                  setSelectedReq(req);
                                  setRejectOpen(true);
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                                title="Reject Request"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalRequests > 20 && (
          <CustomPagination
            count={totalRequests}
            page={page}
            pageSize={20}
            onChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* View Modal */}
      {selectedReq && (
        <ReviewArticleSubmissionModal
          isOpen={viewOpen}
          onClose={() => setViewOpen(false)}
          request={selectedReq}
          onApprove={() => {
            setViewOpen(false);
            setApproveOpen(true);
          }}
          onReject={() => {
            setViewOpen(false);
            setRejectOpen(true);
          }}
        />
      )}

      {/* Approve Confirm Dialog */}
      {selectedReq && (
        <ApproveArticleModal
          isOpen={approveOpen}
          onClose={() => setApproveOpen(false)}
          onConfirm={handleApproveConfirm}
          articleTitle={selectedReq.title}
          isLoading={isApproving}
        />
      )}

      {/* Reject Dialog */}
      {selectedReq && (
        <RejectArticleModal
          isOpen={rejectOpen}
          onClose={() => setRejectOpen(false)}
          onConfirm={handleRejectConfirm}
          articleTitle={selectedReq.title}
          authorName={selectedReq.author_name}
          isLoading={isRejecting}
        />
      )}
    </div>
  );
}