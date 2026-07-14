"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, Plus, Eye, Edit2, Trash2, ArrowUpRight, AlertCircle, Star } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import CustomPagination from "@/components/shared/CustomPagination";
import {
  useGetArticlesQuery,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
} from "@/redux/features/articles/articles.api";
import { useGetCategoriesQuery } from "@/redux/features/categories/categories.api";


export default function ArticleManagementPage() {
  const { toast } = useToast();
  const params = useParams();
  const lang = params?.lang || "en";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
  }, [categoryFilter]);

  const { data, isLoading } = useGetArticlesQuery({
    page,
    search: debouncedSearch || undefined,
    category: categoryFilter || undefined,
  });

  const { data: categoriesData } = useGetCategoriesQuery({});
  const categoriesList = categoriesData?.results || [];

  const articles = data?.results || [];
  const totalArticles = data?.count || 0;

  const [deleteArticle] = useDeleteArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(id).unwrap();
        toast("Article deleted successfully", "success");
      } catch (err: any) {
        toast("Failed to delete article", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Article Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish, edit, and audit sports news entries collected from feeds or created by editors.
          </p>
        </div>
        <Link
          href={`/${lang}/admin/article-management/add-article`}
          className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </Link>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-48 px-3.5 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500/50 rounded-xl text-xs text-slate-350 outline-none transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            {categoriesList.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/40 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">Article</th>
                <th className="pb-3 px-2">Classification</th>
                <th className="pb-3 px-2">Author & Source</th>
                <th className="pb-3 px-2">Views</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-[10px] text-slate-500 mt-1">Loading articles...</p>
                    </div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-slate-400">No articles found</p>
                      <p className="text-[10px] text-slate-500">Try adjusting your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                articles.map((art) => {
                  const statusStyles: Record<string, string> = {
                    published: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
                    approved: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
                    draft: "text-slate-400 bg-slate-500/5 border-slate-500/10",
                    pending: "text-amber-400 bg-amber-500/5 border-amber-500/10",
                    rejected: "text-rose-400 bg-rose-500/5 border-rose-500/10",
                  };

                  const sentimentStyles: Record<string, string> = {
                    positive: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
                    neutral: "text-sky-400 bg-sky-500/5 border-sky-500/10",
                    negative: "text-rose-400 bg-rose-500/5 border-rose-500/10",
                  };

                  const statusText = art.status || "draft";
                  const sentimentText = art.sentiment || "neutral";

                  return (
                    <tr key={art.id} className="hover:bg-slate-900/20 transition-colors group">
                      <td className="py-4 px-2 max-w-xs">
                        <div className="flex items-center gap-3">
                          {art.display_image || art.image_url ? (
                            <img
                              src={art.display_image || art.image_url || ""}
                              alt={art.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-800 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-300 uppercase shrink-0">
                              {art.title.slice(0, 2)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {art.is_featured && (
                                <span title="Featured" className="shrink-0 flex items-center">
                                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                </span>
                              )}
                              <p className="font-semibold text-slate-200 truncate group-hover:text-slate-100 transition-colors">
                                {art.title}
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">{art.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {art.categories.map((c) => (
                              <span key={c.id} className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/10 text-[9px] font-semibold">
                                {c.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {art.tags.map((t) => (
                              <span key={t.id} className="text-[9px] text-slate-500">
                                #{t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        <p className="font-semibold text-slate-300">{art.author_name}</p>
                        {art.source_name && (
                          <a
                            href={art.source_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors inline-flex items-center gap-0.5"
                          >
                            {art.source_name}
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>

                      <td className="py-4 px-2 text-slate-350 font-semibold font-mono">
                        {art.views_count.toLocaleString()}
                      </td>

                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase ${statusStyles[statusText] || statusStyles.draft}`}>
                          {statusText}
                        </span>
                      </td>

                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/${lang}/admin/article-management/${art.slug}`}
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/${lang}/admin/article-management/edit-article?id=${art.id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
                            title="Edit Article"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(art.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-450 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <CustomPagination
          count={totalArticles}
          page={page}
          pageSize={20}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}