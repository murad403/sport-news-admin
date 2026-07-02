"use client";
import React, { useState } from "react";
import { X, FileText, ShieldAlert } from "lucide-react";

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

interface ReviewArticleSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: UserRequest;
  onApprove: () => void;
  onReject: () => void;
}

const categoryImages = {
  Soccer: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
  Tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  F1: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
};

export default function ReviewArticleSubmissionModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}: ReviewArticleSubmissionModalProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error when modal toggles
  React.useEffect(() => {
    if (isOpen) {
      setImgError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Banner Image */}
        <div className="relative h-40 w-full overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800/40">
          {!imgError ? (
            <img
              src={categoryImages[request.category] || categoryImages.Soccer}
              alt={request.category}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] opacity-60" />
              <span className="text-sm font-bold text-indigo-300 tracking-wider uppercase opacity-40">
                {request.category} Submission
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/30 to-transparent" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-white hover:text-slate-200 bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800/40 rounded-lg transition-all z-20"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4 mb-4">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Review Article Submission</h3>
              <p className="text-[10px] text-slate-500">Submitted by user on {request.date}</p>
            </div>
          </div>

          {/* Author info card */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-850 mb-5 text-xs text-slate-300">
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Author</p>
              <p className="font-semibold text-slate-200 mt-0.5">{request.authorName}</p>
              <p className="text-[10px] text-slate-500">{request.authorEmail}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Category</p>
              <p className="font-semibold text-slate-200 mt-0.5">{request.category}</p>
              <span className={`inline-block mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${
                request.status === "Approved"
                  ? "text-emerald-400 border-emerald-500/10 bg-emerald-500/5"
                  : request.status === "Rejected"
                  ? "text-rose-400 border-rose-500/10 bg-rose-500/5"
                  : "text-amber-400 border-amber-500/10 bg-amber-500/5"
              }`}>
                {request.status}
              </span>
            </div>
          </div>

          {/* Title / Content */}
          <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Submitted Title</h4>
              <p className="text-sm font-bold text-white leading-relaxed">{request.title}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Submitted Content</h4>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed p-4 bg-slate-950/20 rounded-xl border border-slate-850">
                {request.content}
              </p>
            </div>
            {request.status === "Rejected" && request.rejectReason && (
              <div className="p-3.5 rounded-xl border border-rose-500/15 bg-rose-500/5 text-rose-300 text-xs">
                <div className="flex gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-rose-200">Rejection Reason Logged:</p>
                    <p className="mt-1 text-slate-300">{request.rejectReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="pt-4 border-t border-slate-800/60 mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
            >
              Close Reader
            </button>
            {request.status === "Pending" && (
              <>
                <button
                  onClick={onReject}
                  className="px-4 py-2 border border-rose-500/20 hover:bg-rose-500/10 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={onApprove}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-all"
                >
                  Approve Submission
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}