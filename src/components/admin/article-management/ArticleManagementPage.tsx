"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Search, Plus, Eye, Edit2, Trash2, Tag, ArrowUpRight, TrendingUp, AlertCircle, Eye as EyeIcon, Globe, Heart, ShieldAlert, Star } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  news_count: number;
}

interface ArticleTag {
  id: string;
  name: string;
  slug: string;
  news_count: number;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  display_image?: string;
  image_url: string;
  link?: string;
  categories: Category[];
  tags: ArticleTag[];
  author_name: string;
  source_name: string;
  source_url: string;
  language: string;
  sentiment: "positive" | "neutral" | "negative";
  pub_date: string;
  is_featured: boolean;
  views_count: number;
  status: "pending" | "published" | "draft";
  created_at: string;
  updated_at: string;
}

export default function ArticleManagementPage() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";

  // Mock list of database articles
  const [articles, setArticles] = useState<Article[]>([
    {
      id: "art-101",
      title: "Mbappe Shines as Real Madrid Secure Super Cup Victory",
      slug: "mbappe-shines-real-madrid-super-cup-victory",
      description: "Kylian Mbappe scored on his debut to help Real Madrid secure a 2-0 victory over Atalanta.",
      content: "Kylian Mbappe made a dream start to his Real Madrid career, scoring a clinical second goal to seal a 2-0 victory over Atalanta in the UEFA Super Cup on Wednesday...\n\nThe French forward converted Jude Bellingham's low pass into the top corner in the 68th minute after Federico Valverde had tapped in the opener.",
      image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80",
      categories: [{ id: "cat-1", name: "Soccer", slug: "soccer", news_count: 520 }],
      tags: [
        { id: "tag-1", name: "Mbappe", slug: "mbappe", news_count: 22 },
        { id: "tag-2", name: "Real Madrid", slug: "real-madrid", news_count: 45 }
      ],
      author_name: "Marcus Vance",
      source_name: "ESPN",
      source_url: "https://espn.com",
      language: "English",
      sentiment: "positive",
      pub_date: "2026-07-01T14:30:00Z",
      is_featured: true,
      views_count: 3420,
      status: "published",
      created_at: "2026-07-01T14:30:00Z",
      updated_at: "2026-07-01T14:30:00Z"
    },
    {
      id: "art-102",
      title: "Hamilton Hits Out at Monaco GP Grid Penalties Layout",
      slug: "hamilton-hits-out-monaco-gp-grid-penalties-layout",
      description: "Hamilton criticizes the stewards after receiving a controversial three-place grid penalty in Monaco.",
      content: "Lewis Hamilton hit out at Monaco GP race stewards, calling their decision to award him a three-place grid penalty 'unfair' and 'ruinous' for his race prospects on the narrow street circuit...",
      image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=300&q=80",
      categories: [{ id: "cat-4", name: "F1", slug: "f1", news_count: 178 }],
      tags: [{ id: "tag-3", name: "Hamilton", slug: "hamilton", news_count: 18 }],
      author_name: "Helena Rostova",
      source_name: "Sky Sports",
      source_url: "https://skysports.com",
      language: "English",
      sentiment: "negative",
      pub_date: "2026-07-02T08:15:00Z",
      is_featured: false,
      views_count: 1105,
      status: "published",
      created_at: "2026-07-02T08:15:00Z",
      updated_at: "2026-07-02T08:15:00Z"
    },
    {
      id: "art-103",
      title: "Tactical breakdown: The mechanics of Curry's high arc release",
      slug: "tactical-breakdown-mechanics-curry-high-arc-release",
      description: "An in-depth biomechanical study of Stephen Curry's legendary three-point shooting technique.",
      content: "Steph Curry's shot release takes an average of 0.3 seconds. By utilizing an elevated 55-degree release arc, Curry increases the hoop target width area dynamically...",
      image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80",
      categories: [{ id: "cat-3", name: "Basketball", slug: "basketball", news_count: 340 }],
      tags: [{ id: "tag-4", name: "Curry", slug: "curry", news_count: 9 }],
      author_name: "Derrick Rose Jr.",
      source_name: "The Athletic",
      source_url: "https://theathletic.com",
      language: "English",
      sentiment: "neutral",
      pub_date: "2026-06-28T10:00:00Z",
      is_featured: false,
      views_count: 980,
      status: "draft",
      created_at: "2026-06-28T10:00:00Z",
      updated_at: "2026-06-28T10:00:00Z"
    },
  ]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast("Article deleted successfully", "success");
    }
  };

  const toggleFeatured = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_featured: !a.is_featured } : a))
    );
    toast("Featured status updated", "success");
  };

  // Filter logic
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.source_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || art.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      art.categories.some((c) => c.name.toLowerCase() === categoryFilter.toLowerCase());
    const matchesSentiment = sentimentFilter === "all" || art.sentiment === sentimentFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesSentiment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Filter Options */}
      <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search title, author, source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 outline-none transition-all"
          >
            <option value="all">All Categories</option>
            <option value="soccer">Soccer</option>
            <option value="tennis">Tennis</option>
            <option value="basketball">Basketball</option>
            <option value="f1">F1</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
          </select>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 outline-none transition-all"
          >
            <option value="all">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/40 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">Article</th>
                <th className="pb-3 px-2">Classification</th>
                <th className="pb-3 px-2">Author & Source</th>
                <th className="pb-3 px-2">Sentiment</th>
                <th className="pb-3 px-2">Views</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-xs">
              {filteredArticles.length === 0 ? (
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
                filteredArticles.map((art) => {
                  const statusStyles = {
                    published: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
                    draft: "text-slate-400 bg-slate-500/5 border-slate-500/10",
                    pending: "text-amber-400 bg-amber-500/5 border-amber-500/10",
                  };

                  const sentimentStyles = {
                    positive: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
                    neutral: "text-sky-400 bg-sky-500/5 border-sky-500/10",
                    negative: "text-rose-400 bg-rose-500/5 border-rose-500/10",
                  };

                  return (
                    <tr key={art.id} className="hover:bg-slate-900/20 transition-colors group">
                      {/* Image & Title */}
                      <td className="py-4 px-2 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={art.image_url}
                            alt={art.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-800 shrink-0"
                          />
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

                      {/* Categories & Tags */}
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

                      {/* Author & Source */}
                      <td className="py-4 px-2">
                        <p className="font-semibold text-slate-300">{art.author_name}</p>
                        <a
                          href={art.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors inline-flex items-center gap-0.5"
                        >
                          {art.source_name}
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      </td>

                      {/* Sentiment */}
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase ${sentimentStyles[art.sentiment]}`}>
                          {art.sentiment}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="py-4 px-2 text-slate-300 font-semibold font-mono">
                        <span className="flex items-center gap-1 text-[11px]">
                          <EyeIcon className="w-3.5 h-3.5 text-slate-500" />
                          {art.views_count.toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase ${statusStyles[art.status]}`}>
                          {art.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Featured toggle */}
                          <button
                            onClick={() => toggleFeatured(art.id)}
                            className={`p-1.5 rounded-lg transition-all ${
                              art.is_featured
                                ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                            }`}
                            title="Toggle Featured"
                          >
                            <Star className="w-4 h-4" />
                          </button>

                          {/* View details */}
                          <Link
                            href={`/${lang}/admin/article-management/${art.id}`}
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit details */}
                          <Link
                            href={`/${lang}/admin/article-management/edit-article?id=${art.id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
                            title="Edit Article"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* Delete */}
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
      </div>
    </div>
  );
}