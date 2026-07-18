"use client";
import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { Article } from "@/redux/features/articles/articles.type";

interface ReviewArticleSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Article;
  onApprove: () => void;
  onReject: () => void;
}

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

  const categoryName = request.categories?.map((c) => c.name).join(", ") || "No Category";
  const displayDate = request.created_at ? new Date(request.created_at).toLocaleDateString() : "Unknown";

  const statusStyles: Record<string, string> = {
    pending: "text-amber-400 border-amber-500/10 bg-amber-500/5",
    approved: "text-emerald-400 border-emerald-500/10 bg-emerald-500/5",
    rejected: "text-rose-400 border-rose-500/10 bg-rose-500/5",
    draft: "text-slate-400 border-slate-500/10 bg-slate-500/5",
  };

  const statusText = request.status?.toLowerCase() || "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">

        {/* Top Banner Image */}
        <div className="relative h-40 w-full overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800/40">
          {(!imgError && (request.display_image || request.image_url)) ? (
            <img
              src={request.display_image || request.image_url || ""}
              alt={categoryName}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] opacity-60" />
              <span className="text-sm font-bold text-indigo-300 tracking-wider uppercase opacity-40">
                {categoryName} Submission
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
              <p className="text-[10px] text-slate-500">Submitted by user on {displayDate}</p>
            </div>
          </div>

          {/* Author info card */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-855 mb-5 text-xs text-slate-300">
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Author</p>
              <p className="font-semibold text-slate-200 mt-0.5">{request.author_name}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Category</p>
              <p className="font-semibold text-slate-200 mt-0.5">{categoryName}</p>
              <span className={`inline-block mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold border uppercase ${statusStyles[statusText] || statusStyles.pending}`}>
                {statusText}
              </span>
            </div>
          </div>

          {/* Title / Content */}
          <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1 no-scrollbar text-xs">
            <div>
              <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Submitted Title</h4>
              <p className="text-sm font-bold text-white leading-relaxed">{request.title}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-slate-550 uppercase tracking-wider mb-1">Submitted Content</h4>
              <p className="text-slate-350 whitespace-pre-line leading-relaxed p-4 bg-slate-950/20 rounded-lg border border-slate-855">
                {request.content}
              </p>
            </div>
          </div>

          {/* Footer controls */}
          <div className="pt-4 border-t border-slate-800/60 mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
            >
              Close Reader
            </button>
            {statusText === "pending" && (
              <>
                <button
                  onClick={onReject}
                  className="px-4 py-2 border border-rose-500/20 hover:bg-rose-500/10 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={onApprove}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition-all"
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