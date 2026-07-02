"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Star, Tag, Newspaper, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const articleSchema = z.object({
  title: z.string().min(1, "Article title is required"),
  description: z.string().optional(),
  content: z.string().min(10, "Article content must be at least 10 characters long"),
  imageUrl: z.string().url("Please enter a valid image URL").or(z.literal("")),
  externalLink: z.string().url("Please enter a valid article URL").or(z.literal("")),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  tagsInput: z.string().optional(),
  authorName: z.string().min(1, "Author name is required"),
  sourceName: z.string().optional(),
  sourceUrl: z.string().url("Please enter a valid source URL").or(z.literal("")),
  language: z.string().default("English"),
  sentiment: z.enum(["positive", "neutral", "negative"]).default("positive"),
  status: z.enum(["pending", "published", "draft"]).default("draft"),
  isFeatured: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function AddArticlePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "en";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      imageUrl: "",
      externalLink: "",
      categories: [],
      tagsInput: "",
      authorName: "Alex Mercer",
      sourceName: "",
      sourceUrl: "",
      language: "English",
      sentiment: "positive",
      status: "draft",
      isFeatured: false,
    },
  });

  const selectedCategories = watch("categories") || [];
  const isFeaturedValue = watch("isFeatured");

  const handleCategoryToggle = (catName: string) => {
    const next = selectedCategories.includes(catName)
      ? selectedCategories.filter((c) => c !== catName)
      : [...selectedCategories, catName];
    setValue("categories", next, { shouldValidate: true });
  };

  const onSubmit = (data: ArticleFormValues) => {
    toast("Article created successfully!", "success");
    setTimeout(() => {
      router.push(`/${lang}/admin/article-management`);
    }, 1000);
  };

  const categoriesList = ["Soccer", "Tennis", "Basketball", "F1", "Cricket", "Volleyball"];

  return (
    <div className="space-y-6">
      {/* Header and Back Action */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(`/${lang}/admin/article-management`)}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-indigo-400" />
            Create New Article
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manually compose and catalog sports articles on the platform.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Body Content (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-5 p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800/60 pb-3 mb-5">
            Article Composition
          </h3>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Article Title
            </label>
            <input
              type="text"
              placeholder="e.g. Manchester City Reclaim Premier League Crown..."
              {...register("title")}
              className={`w-full px-4 py-3 bg-slate-950/50 focus:bg-slate-950 border ${
                errors.title ? "border-rose-500/50 focus:ring-rose-500/20" : "border-slate-800 focus:ring-indigo-500/50"
              } focus:ring-1 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all`}
            />
            {errors.title && (
              <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Short Description / Summary
            </label>
            <textarea
              placeholder="A brief 1-2 sentence overview summarizing the story..."
              rows={3}
              {...register("description")}
              className="w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-550 outline-none transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Article Content
            </label>
            <textarea
              placeholder="Write full article body content..."
              rows={12}
              {...register("content")}
              className={`w-full p-4 bg-slate-950/50 focus:bg-slate-950 border ${
                errors.content ? "border-rose-500/50 focus:ring-rose-500/20" : "border-slate-800 focus:ring-indigo-500/50"
              } focus:ring-1 rounded-xl text-xs text-slate-200 placeholder-slate-550 outline-none resize-none no-scrollbar`}
            />
            {errors.content && (
              <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Media Header Image URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Display Image URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                {...register("imageUrl")}
                className={`w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border ${
                  errors.imageUrl ? "border-rose-500/50 focus:ring-rose-500/20" : "border-slate-800 focus:ring-indigo-500/50"
                } focus:ring-1 rounded-xl text-xs text-slate-200 placeholder-slate-550 outline-none transition-all`}
              />
              {errors.imageUrl && (
                <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Original Article Link (Optional)
              </label>
              <input
                type="text"
                placeholder="https://espn.com/news-story-link"
                {...register("externalLink")}
                className={`w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border ${
                  errors.externalLink ? "border-rose-500/50" : "border-slate-800"
                } focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-550 outline-none transition-all`}
              />
              {errors.externalLink && (
                <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.externalLink.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Publishing Metadata (Spans 1 column) */}
        <div className="space-y-5">
          {/* Classification & Metadata Panel */}
          <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800/60 pb-3">
              Classification
            </h3>

            {/* Categories */}
            <div className="space-y-2">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Select Categories
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categoriesList.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-3 py-2 border rounded-xl text-left text-[11px] font-semibold transition-all ${
                        isChecked
                          ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-300"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              {errors.categories && (
                <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.categories.message}
                </p>
              )}
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Tags (Comma-separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="mbappe, madrid, champions-league"
                  {...register("tagsInput")}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Publishing settings */}
          <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800/60 pb-3">
              Publishing Options
            </h3>

            {/* Author Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Author Name
              </label>
              <input
                type="text"
                {...register("authorName")}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all"
              />
              {errors.authorName && (
                <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.authorName.message}
                </p>
              )}
            </div>

            {/* Source details */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Source Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. ESPN"
                  {...register("sourceName")}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Source URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  {...register("sourceUrl")}
                  className={`w-full px-3 py-2 bg-slate-950 border ${
                    errors.sourceUrl ? "border-rose-500/50" : "border-slate-800"
                  } focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none transition-all`}
                />
                {errors.sourceUrl && (
                  <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.sourceUrl.message}
                  </p>
                )}
              </div>
            </div>

            {/* Language & Sentiment Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Language
                </label>
                <select
                  {...register("language")}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none transition-all"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Sentiment
                </label>
                <select
                  {...register("sentiment")}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none transition-all"
                >
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>

            {/* Status Select */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Publishing Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-slate-200 outline-none transition-all"
              >
                <option value="draft">Draft (Private)</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published (Live)</option>
              </select>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850 mt-3.5">
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${isFeaturedValue ? "text-amber-400 fill-amber-400" : "text-slate-500"}`} />
                <span className="text-xs font-semibold text-slate-300">Feature this Article</span>
              </div>
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${lang}/admin/article-management`)}
              className="flex-1 py-3 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Article
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}