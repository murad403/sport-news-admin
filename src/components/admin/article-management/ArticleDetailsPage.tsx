"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit2, Star, Calendar, Eye, Globe, ExternalLink, Activity, Info } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  useGetArticleDetailsQuery,
  useUpdateArticleMutation,
} from "@/redux/features/articles/articles.api";

export default function ArticleDetailsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "en";
  const articleSlug = params?.id as string;

  const { data: article, isLoading } = useGetArticleDetailsQuery(articleSlug, {
    skip: !articleSlug,
  });
  const [updateArticle] = useUpdateArticleMutation();

  const handleStatusChange = async (newStatus: "pending" | "published" | "draft") => {
    if (!article) return;
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      await updateArticle({ id: article.id, data: formData }).unwrap();
      toast(`Article status changed to ${newStatus}`, "success");
    } catch (err: any) {
      toast("Failed to update status", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <p className="font-semibold text-slate-400">Loading article details...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center text-slate-500">
        <p className="font-semibold text-slate-400">Article not found.</p>
      </div>
    );
  }

  const sentimentColors: Record<string, string> = {
    positive: "text-emerald-400 border-emerald-500/15 bg-emerald-500/5",
    neutral: "text-sky-400 border-sky-500/15 bg-sky-500/5",
    negative: "text-rose-400 border-rose-500/15 bg-rose-500/5",
  };

  const sentimentText = article.sentiment || "neutral";

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/${lang}/admin/article-management`)}
          className="px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/${lang}/admin/article-management/edit-article?id=${article.id}`)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <Edit2 className="w-4 h-4 text-indigo-400" />
            Edit Article
          </button>
        </div>
      </div>

      {/* Main Cover Banner */}
      <div className="relative h-60 md:h-72 w-full rounded-2xl overflow-hidden border border-slate-800/80 shadow-lg bg-slate-950">
        {(article.display_image || article.image_url) && (
          <img
            src={article.display_image || article.image_url || ""}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-5 left-6 right-6">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {article.categories.map((c) => (
              <span key={c.id} className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold uppercase">
                {c.name}
              </span>
            ))}
            {article.is_featured && (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center gap-0.5 uppercase">
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                Featured
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight drop-shadow-md">
            {article.title}
          </h2>
        </div>
      </div>

      {/* Side-by-side details panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left side content summary (Spans 2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg space-y-5">
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</h4>
            <p className="text-xs font-semibold text-slate-300 italic border-l-2 border-indigo-500/50 pl-3 leading-relaxed">
              {article.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/40">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Article Content</h4>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {article.content}
            </p>
          </div>
        </div>

        {/* Right side Metadata Summary (Spans 1 column) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800/60 pb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-400" />
              Article Metadata
            </h3>

            {/* Author */}
            <div>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Author</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">{article.author_name}</p>
            </div>

            {/* Original Source */}
            {article.source_name && (
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Origin Source</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-semibold text-slate-200">{article.source_name}</span>
                  <a
                    href={article.source_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                  >
                    Visit Link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Sentiment & Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Language</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-550" />
                  {article.language}
                </p>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Sentiment</span>
                <div className={`mt-1 px-2 py-0.5 rounded border text-[9px] font-bold inline-block uppercase ${sentimentColors[sentimentText] || sentimentColors.neutral}`}>
                  {sentimentText}
                </div>
              </div>
            </div>

            {/* Stats: Views */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/40">
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Views Count</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5 flex items-center gap-1.5 font-mono">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {article.views_count.toLocaleString()}
                </p>
              </div>
              {article.pub_date && (
                <div>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Published At</span>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(article.pub_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Publishing State Controller */}
          <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800/60 pb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              Publishing status
            </h3>

            <div className="space-y-2">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Change Live Status
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                {(["draft", "pending", "published"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                      article.status === s
                        ? s === "published"
                          ? "bg-emerald-600 text-white"
                          : s === "pending"
                          ? "bg-amber-600 text-white"
                          : "bg-slate-700 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}