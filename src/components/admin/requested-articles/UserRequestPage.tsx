"use client";

import React, { useState } from "react";
import { Eye, Check, X, Search, Filter, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import ReviewArticleSubmissionModal from "./ReviewArticleSubmissionModal";
import ApproveArticleModal from "./ApproveArticleModal";
import RejectArticleModal from "./RejectArticleModal";

interface UserRequest {
  id: string;
  authorName: string;
  authorEmail: string;
  title: string;
  category: "Soccer" | "Tennis" | "Basketball" | "F1";
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  content: string;
  rejectReason?: string;
}

export default function UserRequestPage() {
  const { toast } = useToast();

  // Requests Local State
  const [requests, setRequests] = useState<UserRequest[]>([
    {
      id: "req-1",
      authorName: "Marcus Vance",
      authorEmail: "marcus.v@gmail.com",
      title: "Why Chelsea's Young Midfield is Finally Clicking Under pressure",
      category: "Soccer",
      date: "Jul 1, 2026",
      status: "Pending",
      content: "After eighteen months of chaotic squad rebuilding and multiple managerial changes, Chelsea's astronomical investment in youth is finally paying off. The midfield partnership of Caicedo and Enzo Fernandez has developed into an elite double pivot.\n\nTactical analysis shows that the spacing between the lines has closed from 14 meters down to an optimal 9.5 meters, preventing opponent counter-attacks. Furthermore, the defensive tracking of the wingers has relieved pressure, allowing Enzo to drift into advanced playmaking positions where his passing range excels.\n\nThis tactical stability could see Chelsea challenge for a top-four spot consistently in the upcoming season.",
    },
    {
      id: "req-2",
      authorName: "Helena Rostova",
      authorEmail: "helena.r@yahoo.com",
      title: "Swiatek Reclaims World No. 1 Ranking with Paris Masterclass",
      category: "Tennis",
      date: "Jul 2, 2026",
      status: "Pending",
      content: "Iga Swiatek put on a tennis clinic to reclaim her World No. 1 ranking, securing the clay tournament in straight sets 6-2, 6-1. The Polish superstar dominated from the baseline, hitting 24 winners and committing only 6 unforced errors.\n\nHer opponent struggled to cope with the heavy topspin and sliding defensive coverage that Swiatek utilizes on clay surfaces. This mark's Swiatek's third title in Paris over the last four years, cementing her legacy as one of the most dominant clay-court players of the modern era.",
    },
    {
      id: "req-3",
      authorName: "Derrick Rose Jr.",
      authorEmail: "drose.hoops@outlook.com",
      title: "The Mathematical Evolution of the NBA Stepback Three-Pointer",
      category: "Basketball",
      date: "Jun 28, 2026",
      status: "Approved",
      content: "Ten years ago, the stepback three-pointer was a rare, highly specialized isolation play. Today, it is a staple of modern NBA offenses. Driven by advanced analytics and shooting coaching, the mechanics of the stepback have evolved into a high-percentage shot.\n\nPlayers are now utilizing deceleration techniques that create up to 4.2 feet of space between themselves and the defender, increasing the effective shooting window by 15%. This breakdown examines the biomechanics and statistical efficiency of the league's top shooters.",
    },
    {
      id: "req-4",
      authorName: "Carlos Sainz Fan",
      authorEmail: "chili.f1@f1fan.com",
      title: "Ferrari Strategic Flub Costly in Silverstone Rain",
      category: "F1",
      date: "Jun 25, 2026",
      status: "Rejected",
      content: "Ferrari's strategic decisions during the Silverstone Grand Prix once again cost them a potential podium finish. When rain began to fall on lap 28, the team delayed fitting intermediate tires, forcing their lead driver to complete an extra lap on slick tires.\n\nThis strategic delay cost 18.5 seconds, dropping them from second to sixth in the order. In a sport decided by tenths of a second, these repeated operational mishaps highlight ongoing structural weaknesses in the team's decision-making apparatus.",
      rejectReason: "Duplicate submission. Similar article already exists on the main news feed.",
    },
  ]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  // Modal active states
  const [selectedReq, setSelectedReq] = useState<UserRequest | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  // Approval handler
  const handleApproveConfirm = () => {
    if (!selectedReq) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === selectedReq.id ? { ...r, status: "Approved" } : r))
    );
    toast("Submission approved and published!", "success");
    setApproveOpen(false);
    setSelectedReq(null);
  };

  // Rejection handler
  const handleRejectConfirm = (reason: string) => {
    if (!selectedReq) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id
          ? { ...r, status: "Rejected", rejectReason: reason }
          : r
      )
    );
    toast("Submission rejected. Reason logged.", "info");
    setRejectOpen(false);
    setSelectedReq(null);
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.authorEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Requests Approval Desk</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, approve, or reject articles submitted by general users from the frontend website.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by author, email, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden sm:block" />
          <span className="text-xs font-semibold text-slate-400 hidden sm:block">Status:</span>
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-850">
            {(["All", "Pending", "Approved", "Rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
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
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-slate-400">No requests found</p>
                      <p className="text-[10px] text-slate-500">Try modifying your search query or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const statusStyles = {
                    Pending: "text-amber-400 bg-amber-500/5 border-amber-500/10",
                    Approved: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
                    Rejected: "text-rose-400 bg-rose-500/5 border-rose-500/10",
                  };

                  return (
                    <tr key={req.id} className="hover:bg-slate-900/20 transition-colors group">
                      {/* Author */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-300 animate-in fade-in zoom-in duration-200">
                            {req.authorName.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{req.authorName}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{req.authorEmail}</p>
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
                          {req.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${statusStyles[req.status]}`}>
                          {req.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-2 text-slate-500">
                        {req.date}
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

                          {req.status === "Pending" && (
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
        />
      )}

      {/* Reject Dialog */}
      {selectedReq && (
        <RejectArticleModal
          isOpen={rejectOpen}
          onClose={() => setRejectOpen(false)}
          onConfirm={handleRejectConfirm}
          articleTitle={selectedReq.title}
          authorName={selectedReq.authorName}
        />
      )}
    </div>
  );
}