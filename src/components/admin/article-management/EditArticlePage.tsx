"use client";
import React, { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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

export default function EditArticlePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = params?.lang || "en";
  const articleId = searchParams.get("id");

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      content: "",
      imageUrl: "",
      externalLink: "",
      categories: [],
      tagsInput: "",
      authorName: "",
      sourceName: "",
      sourceUrl: "",
      language: "English",
      sentiment: "positive",
      status: "draft",
      isFeatured: false,
    },
  });

  // Seed data based on active article ID
  useEffect(() => {
    let mockValues: ArticleFormValues;

    if (articleId === "art-101") {
      mockValues = {
        title: "Mbappe Shines as Real Madrid Secure Super Cup Victory",
        description: "Kylian Mbappe scored on his debut to help Real Madrid secure a 2-0 victory over Atalanta.",
        content: "Kylian Mbappe made a dream start to his Real Madrid career, scoring a clinical second goal to seal a 2-0 victory over Atalanta in the UEFA Super Cup on Wednesday...\n\nThe French forward converted Jude Bellingham's low pass into the top corner in the 68th minute after Federico Valverde had tapped in the opener.",
        imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80",
        externalLink: "https://espn.com/real-madrid-story",
        authorName: "Marcus Vance",
        sourceName: "ESPN",
        sourceUrl: "https://espn.com",
        language: "English",
        sentiment: "positive",
        status: "published",
        isFeatured: true,
        categories: ["Soccer"],
        tagsInput: "mbappe, real-madrid",
      };
    } else if (articleId === "art-102") {
      mockValues = {
        title: "Hamilton Hits Out at Monaco GP Grid Penalties Layout",
        description: "Hamilton criticizes the stewards after receiving a controversial three-place grid penalty in Monaco.",
        content: "Lewis Hamilton hit out at Monaco GP race stewards, calling their decision to award him a three-place grid penalty 'unfair' and 'ruinous' for his race prospects on the narrow street circuit...",
        imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=300&q=80",
        externalLink: "",
        authorName: "Helena Rostova",
        sourceName: "Sky Sports",
        sourceUrl: "https://skysports.com",
        language: "English",
        sentiment: "negative",
        status: "published",
        isFeatured: false,
        categories: ["F1"],
        tagsInput: "hamilton, f1",
      };
    } else {
      mockValues = {
        title: "Tactical breakdown: The mechanics of Curry's high arc release",
        description: "An in-depth biomechanical study of Stephen Curry's legendary three-point shooting technique.",
        content: "Steph Curry's shot release takes an average of 0.3 seconds. By utilizing an elevated 55-degree release arc, Curry increases the hoop target width area dynamically...",
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80",
        externalLink: "",
        authorName: "Derrick Rose Jr.",
        sourceName: "The Athletic",
        sourceUrl: "https://theathletic.com",
        language: "English",
        sentiment: "neutral",
        status: "draft",
        isFeatured: false,
        categories: ["Basketball"],
        tagsInput: "curry, nba",
      };
    }

    reset(mockValues);
  }, [articleId, reset]);

  const selectedCategories = watch("categories") || [];
  const isFeaturedValue = watch("isFeatured");

  const handleCategoryToggle = (catName: string) => {
    const next = selectedCategories.includes(catName)
      ? selectedCategories.filter((c) => c !== catName)
      : [...selectedCategories, catName];
    setValue("categories", next, { shouldValidate: true });
  };

  const onSubmit = (data: ArticleFormValues) => {
    toast("Changes saved successfully!", "success");
    setTimeout(() => {
      router.push(`/${lang}/admin/article-management`);
    }, 1000);
  };

  const categoriesList = ["Soccer", "Tennis", "Basketball", "F1", "Cricket", "Volleyball"];

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Edit Article
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update composition, categories, or publishing parameters for this entry.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns */}
        <div className="lg:col-span-2 space-y-5 p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800/60 pb-3 mb-5">
            Composition Details
          </h3>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Article Title
            </label>
            <input
              type="text"
              {...register("title")}
              className={`w-full px-4 py-3 bg-slate-955/50 focus:bg-slate-950 border ${errors.title ? "border-rose-500/50" : "border-slate-800"
                } focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all`}
            />
            {errors.title && (
              <p className="text-[10px] text-rose-450 font-semibold flex items-center gap-1 mt-1">
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
              rows={3}
              {...register("description")}
              className="w-full px-4 py-2.5 bg-slate-955/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Article Content
            </label>
            <textarea
              rows={12}
              {...register("content")}
              className={`w-full p-4 bg-slate-955/50 focus:bg-slate-950 border ${errors.content ? "border-rose-500/50" : "border-slate-800"
                } focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none resize-none no-scrollbar`}
            />
            {errors.content && (
              <p className="text-[10px] text-rose-450 font-semibold flex items-center gap-1 mt-1">
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
                {...register("imageUrl")}
                className={`w-full px-4 py-2.5 bg-slate-955/50 focus:bg-slate-950 border ${errors.imageUrl ? "border-rose-500/50" : "border-slate-800"
                  } focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all`}
              />
              {errors.imageUrl && (
                <p className="text-[10px] text-rose-450 font-semibold flex items-center gap-1 mt-1">
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
                {...register("externalLink")}
                className={`w-full px-4 py-2.5 bg-slate-955/50 focus:bg-slate-950 border ${errors.externalLink ? "border-rose-500/50" : "border-slate-800"
                  } focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all`}
              />
              {errors.externalLink && (
                <p className="text-[10px] text-rose-450 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.externalLink.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
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
                      className={`px-3 py-2 border rounded-xl text-left text-[11px] font-semibold transition-all ${isChecked
                          ? "bg-indigo-600/15 border-indigo-500/30 text-indigo-300"
                          : "bg-slate-955 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              {errors.categories && (
                <p className="text-[10px] text-rose-450 font-semibold flex items-center gap-1 mt-1">
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
                  {...register("tagsInput")}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-955 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all"
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
                className="w-full px-3 py-2 bg-slate-955 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all"
              />
              {errors.authorName && (
                <p className="text-[10px] text-rose-455 font-semibold flex items-center gap-1 mt-1">
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
                  {...register("sourceName")}
                  className="w-full px-3 py-2 bg-slate-955 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Source URL
                </label>
                <input
                  type="text"
                  {...register("sourceUrl")}
                  className={`w-full px-3 py-2 bg-slate-955 border ${errors.sourceUrl ? "border-rose-500/50" : "border-slate-800"
                    } focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all`}
                />
                {errors.sourceUrl && (
                  <p className="text-[10px] text-rose-455 font-semibold flex items-center gap-1 mt-1">
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
                  className="w-full px-2.5 py-2 bg-slate-955 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none transition-all"
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
                  className="w-full px-2.5 py-2 bg-slate-955 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none transition-all"
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
                className="w-full px-3 py-2.5 bg-slate-955 border border-slate-855 rounded-xl text-xs text-slate-200 outline-none transition-all"
              >
                <option value="draft">Draft (Private)</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published (Live)</option>
              </select>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-955 border border-slate-850 mt-3.5">
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${isFeaturedValue ? "text-amber-400 fill-amber-400" : "text-slate-500"}`} />
                <span className="text-xs font-semibold text-slate-300">Feature this Article</span>
              </div>
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-955 border-slate-800 focus:ring-0 cursor-pointer accent-indigo-500"
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
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}