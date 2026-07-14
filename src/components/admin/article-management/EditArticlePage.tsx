"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Newspaper, AlertCircle, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  useGetArticleDetailsQuery,
  useUpdateArticleMutation,
} from "@/redux/features/articles/articles.api";
import { useGetCategoriesQuery } from "@/redux/features/categories/categories.api";
import { useGetTagsQuery } from "@/redux/features/tags/tags.api";
import { ArticleFormValues, articleSchema } from "@/validation/article.validation";



export default function EditArticlePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = params?.lang || "en";
  const articleId = searchParams.get("id");

  const { data: categoriesData } = useGetCategoriesQuery({});
  const categoriesList = categoriesData?.results || [];

  const { data: tagsData } = useGetTagsQuery({});
  const tagsList = tagsData?.results || [];

  const { data: article, isLoading: isDetailsLoading } = useGetArticleDetailsQuery(articleId || "", {
    skip: !articleId,
  });

  const [updateArticle] = useUpdateArticleMutation();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      content: "",
      categories: [],
      tags: [],
      language: "en",
      is_published: false,
      is_featured: false,
    },
  });

  const selectedCategories = watch("categories") || [];
  const selectedTags = watch("tags") || [];
  const isPublishedValue = watch("is_published");
  const isFeaturedValue = watch("is_featured");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const [tagSearch, setTagSearch] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        description: article.description || "",
        content: article.content,
        categories: article.categories.map((c) => c.id),
        tags: article.tags.map((t) => t.id),
        language: article.language,
        is_published: article.status === "published",
        is_featured: article.is_featured,
      });
      if (article.display_image || article.image_url) {
        setImagePreview(article.display_image || article.image_url);
      }
    }
  }, [article, reset]);

  const handleAddTag = (tagId: string) => {
    setValue("tags", [...selectedTags, tagId], { shouldValidate: true });
    setTagSearch("");
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tagId: string) => {
    setValue("tags", selectedTags.filter((id) => id !== tagId), { shouldValidate: true });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ArticleFormValues) => {
    if (!article) return;
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.description) {
        formData.append("description", values.description);
      }
      formData.append("content", values.content);

      if (values.image && values.image[0]) {
        formData.append("display_image", values.image[0]);
      }

      values.categories.forEach((catId) => {
        formData.append("categories", catId);
      });
      values.tags.forEach((tagId) => {
        formData.append("tags", tagId);
      });

      formData.append("language", values.language);
      formData.append("is_published", String(values.is_published));
      formData.append("is_featured", String(values.is_featured));

      await updateArticle({ id: article.id, data: formData }).unwrap();
      toast("Article updated successfully!", "success");
      router.push(`/${lang}/admin/article-management`);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to update article.";
      toast(errorMsg, "error");
    }
  };

  if (isDetailsLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <p className="font-semibold text-slate-400">Loading article data...</p>
      </div>
    );
  }

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
            <label className="block text-xs font-semibold text-slate-350">
              Article Title *
            </label>
            <input
              type="text"
              {...register("title")}
              className={`w-full px-4 py-3 bg-slate-950/50 focus:bg-slate-950 border ${errors.title ? "border-rose-500/50" : "border-slate-800"
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
            <label className="block text-xs font-semibold text-slate-355">
              Short Description / Summary
            </label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-355">
              Article Content *
            </label>
            <textarea
              rows={12}
              {...register("content")}
              className={`w-full p-4 bg-slate-950/50 focus:bg-slate-950 border ${errors.content ? "border-rose-500/50" : "border-slate-800"
                } focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none resize-none no-scrollbar`}
            />
            {errors.content && (
              <p className="text-[10px] text-rose-455 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-355">
              Display Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all">
                <Upload className="w-4 h-4 text-indigo-400" />
                Choose Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="relative group cursor-zoom-in" onClick={() => setIsZoomed(true)}>
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800 shadow-md transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-[10px] text-white font-semibold">
                    Enlarge
                  </div>
                </div>
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

            {/* Categories dropdown select */}
            <div className="space-y-2">
              <label className="block text-[10px] font-semibold text-slate-550 uppercase tracking-wider">
                Select Category *
              </label>
              <select
                value={selectedCategories[0] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue("categories", val ? [val] : [], { shouldValidate: true });
                }}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
              >
                <option value="">Select a category</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categories && (
                <p className="text-[10px] text-rose-455 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.categories.message}
                </p>
              )}
            </div>

            {/* Tags Select Autocomplete */}
            <div className="space-y-2 pt-2 relative">
              <label className="block text-[10px] font-semibold text-slate-555 uppercase tracking-wider">
                Select Tags *
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search tags..."
                  value={tagSearch}
                  onChange={(e) => {
                    setTagSearch(e.target.value);
                    setShowTagSuggestions(true);
                  }}
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowTagSuggestions(false), 200);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
                />

                {showTagSuggestions && tagSearch.trim() !== "" && (
                  <div className="absolute left-0 right-0 mt-1.5 max-h-40 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl z-20 shadow-2xl divide-y divide-slate-900/60 no-scrollbar">
                    {tagsList
                      .filter(
                        (t) =>
                          t.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
                          !selectedTags.includes(t.id)
                      )
                      .map((tag) => (
                        <button
                          type="button"
                          key={tag.id}
                          onClick={() => handleAddTag(tag.id)}
                          className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                          {tag.name}
                        </button>
                      ))}
                    {tagsList.filter(
                      (t) =>
                        t.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
                        !selectedTags.includes(t.id)
                    ).length === 0 && (
                        <p className="px-4 py-2.5 text-xs text-slate-500 italic">No matching tags found</p>
                      )}
                  </div>
                )}
              </div>

              {errors.tags && (
                <p className="text-[10px] text-rose-455 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.tags.message}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedTags.map((tagId) => {
                  const tagObj = tagsList.find((t) => t.id === tagId);
                  if (!tagObj) return null;
                  return (
                    <span
                      key={tagId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/10 text-[10px] font-semibold animate-in fade-in duration-150"
                    >
                      {tagObj.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tagId)}
                        className="text-indigo-455 hover:text-indigo-200 transition-colors ml-1 font-bold cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Publishing settings */}
          <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800/60 pb-3">
              Publishing Options
            </h3>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-550 uppercase tracking-wider">
                Language
              </label>
              <input
                type="text"
                {...register("language")}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all"
              />
            </div>

            {/* Status Option dropdown */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-550 uppercase tracking-wider">
                Publishing Status
              </label>
              <select
                value={isPublishedValue ? "true" : "false"}
                onChange={(e) => setValue("is_published", e.target.value === "true")}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>

            {/* Featured option dropdown */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-555 uppercase tracking-wider">
                Is Featured
              </label>
              <select
                value={isFeaturedValue ? "true" : "false"}
                onChange={(e) => setValue("is_featured", e.target.value === "true")}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-855 rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
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
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Lightbox / Zoom Overlay */}
      {isZoomed && imagePreview && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsZoomed(false)} />
          <div className="relative max-w-3xl max-h-[85vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-850 z-10 p-2 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={imagePreview}
              alt="Enlarged Preview"
              className="max-w-full max-h-[80vh] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}