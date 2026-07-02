"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit2, Star, Calendar, Eye, Globe, ExternalLink, Activity, Info } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleTag {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
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

export default function ArticleDetailsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "en";
  const articleId = params?.id;

  const [article, setArticle] = useState<Article | null>(null);
  const [currentStatus, setCurrentStatus] = useState<"pending" | "published" | "draft">("draft");

  // Fetch article data based on parameter ID
  useEffect(() => {
    // Mock database fetch
    let foundArticle: Article;
    if (articleId === "art-101") {
      foundArticle = {
        id: "art-101",
        title: "Mbappe Shines as Real Madrid Secure Super Cup Victory",
        slug: "mbappe-shines-real-madrid-super-cup-victory",
        description: "Kylian Mbappe scored on his debut to help Real Madrid secure a 2-0 victory over Atalanta.",
        content: "Kylian Mbappe made a dream start to his Real Madrid career, scoring a clinical second goal to seal a 2-0 victory over Atalanta in the UEFA Super Cup on Wednesday.\n\nThe French forward converted Jude Bellingham's low pass into the top corner in the 68th minute after Federico Valverde had tapped in the opener.\n\nThis victory marks a spectacular debut for Mbappe who completed a highly-anticipated transfer to Madrid earlier this season. Speaking to journalists after the match, Mbappe expressed his excitement: 'This is a historic moment for me. Scoring on my debut is a dream, but winning a trophy is even better.'",
        image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
        link: "https://espn.com/real-madrid-story",
        categories: [{ id: "cat-1", name: "Soccer", slug: "soccer" }],
        tags: [
          { id: "tag-1", name: "Mbappe", slug: "mbappe" },
          { id: "tag-2", name: "Real Madrid", slug: "real-madrid" }
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
      };
    } else if (articleId === "art-102") {
      foundArticle = {
        id: "art-102",
        title: "Hamilton Hits Out at Monaco GP Grid Penalties Layout",
        slug: "hamilton-hits-out-monaco-gp-grid-penalties-layout",
        description: "Hamilton criticizes the stewards after receiving a controversial three-place grid penalty in Monaco.",
        content: "Lewis Hamilton hit out at Monaco GP race stewards, calling their decision to award him a three-place grid penalty 'unfair' and 'ruinous' for his race prospects on the narrow street circuit.\n\nThe Mercedes driver was penalized for allegedly impeding another car during the final minutes of qualifying. This penalty pushes him down from second to fifth place on the start line.",
        image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
        categories: [{ id: "cat-4", name: "F1", slug: "f1" }],
        tags: [{ id: "tag-3", name: "Hamilton", slug: "hamilton" }],
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
      };
    } else {
      foundArticle = {
        id: "art-103",
        title: "Tactical breakdown: The mechanics of Curry's high arc release",
        slug: "tactical-breakdown-mechanics-curry-high-arc-release",
        description: "An in-depth biomechanical study of Stephen Curry's legendary three-point shooting technique.",
        content: "Steph Curry's shot release takes an average of 0.3 seconds. By utilizing an elevated 55-degree release arc, Curry increases the hoop target width area dynamically.\n\nThis breakdown covers the biomechanics, release speed, deceleration rates, and historical statistics that define Curry's shooting supremacy in the NBA.",
        image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
        categories: [{ id: "cat-3", name: "Basketball", slug: "basketball" }],
        tags: [{ id: "tag-4", name: "Curry", slug: "curry" }],
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
      };
    }

    setArticle(foundArticle);
    setCurrentStatus(foundArticle.status);
  }, [articleId]);

  const handleStatusChange = (newStatus: "pending" | "published" | "draft") => {
    setCurrentStatus(newStatus);
    toast(`Article status changed to ${newStatus}`, "success");
  };

  if (!article) {
    return (
      <div className="py-20 text-center text-slate-500">
        <p className="font-semibold text-slate-400">Loading article details...</p>
      </div>
    );
  }

  const sentimentColors = {
    positive: "text-emerald-400 border-emerald-500/15 bg-emerald-500/5",
    neutral: "text-sky-400 border-sky-500/15 bg-sky-500/5",
    negative: "text-rose-400 border-rose-500/15 bg-rose-500/5",
  };

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
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover"
        />
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
                <Star className="w-3 h-3 fill-slate-950" />
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
            <p className="text-xs font-semibold text-slate-350 italic border-l-2 border-indigo-500/50 pl-3 leading-relaxed">
              {article.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/40">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Article Content</h4>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
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
            <div>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Origin Source</span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs font-semibold text-slate-200">{article.source_name}</span>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                >
                  Visit Link
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Sentiment & Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Language</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  {article.language}
                </p>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Sentiment</span>
                <div className={`mt-1 px-2 py-0.5 rounded border text-[9px] font-bold inline-block uppercase ${sentimentColors[article.sentiment]}`}>
                  {article.sentiment}
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
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Published At</span>
                <p className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(article.pub_date).toLocaleDateString()}
                </p>
              </div>
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
                      currentStatus === s
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