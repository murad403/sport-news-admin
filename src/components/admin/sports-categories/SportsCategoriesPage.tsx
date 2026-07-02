"use client";

import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, Tag, BookOpen, BarChart3, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

interface SportsCategory {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
  createdAt: string;
}

export default function SportsCategoriesPage() {
  const { toast } = useToast();

  // Local state for categories list
  const [categories, setCategories] = useState<SportsCategory[]>([
    { id: "cat-1", name: "Soccer", slug: "soccer", articleCount: 520, createdAt: "Jun 12, 2025" },
    { id: "cat-2", name: "Tennis", slug: "tennis", articleCount: 210, createdAt: "Jul 02, 2025" },
    { id: "cat-3", name: "Basketball", slug: "basketball", articleCount: 340, createdAt: "Aug 15, 2025" },
    { id: "cat-4", name: "F1", slug: "f1", articleCount: 178, createdAt: "Oct 05, 2025" },
  ]);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal control states
  const [selectedCat, setSelectedCat] = useState<SportsCategory | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // CRUD handlers
  const handleAddCategory = (name: string) => {
    // Check duplication
    const duplicate = categories.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      toast("Category name already exists!", "error");
      return;
    }

    const newCategory: SportsCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      articleCount: 0,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setCategories((prev) => [...prev, newCategory]);
    toast(`Category "${name}" created successfully!`, "success");
    setIsAddOpen(false);
  };

  const handleEditCategory = (newName: string) => {
    if (!selectedCat) return;

    // Check duplication excluding current editing category
    const duplicate = categories.some(
      (c) => c.id !== selectedCat.id && c.name.toLowerCase() === newName.toLowerCase()
    );
    if (duplicate) {
      toast("Category name already exists!", "error");
      return;
    }

    setCategories((prev) =>
      prev.map((c) =>
        c.id === selectedCat.id
          ? {
              ...c,
              name: newName,
              slug: newName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
            }
          : c
      )
    );

    toast(`Category updated to "${newName}" successfully!`, "success");
    setIsEditOpen(false);
    setSelectedCat(null);
  };

  const handleDeleteCategory = () => {
    if (!selectedCat) return;

    setCategories((prev) => prev.filter((c) => c.id !== selectedCat.id));
    toast(`Category "${selectedCat.name}" deleted successfully!`, "success");
    setIsDeleteOpen(false);
    setSelectedCat(null);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics summaries
  const totalCategories = categories.length;
  const totalArticles = categories.reduce((acc, c) => acc + c.articleCount, 0);
  const topCategory = [...categories].sort((a, b) => b.articleCount - a.articleCount)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sports Categories</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure sports categories used for classifying news articles and managing portal feeds.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Categories Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Categories</span>
            <p className="text-2xl font-bold text-white mt-1">{totalCategories}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300">
            <Tag className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Total Categorized Articles Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Categorized Articles</span>
            <p className="text-2xl font-bold text-white mt-1">{totalArticles}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Highest Share Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Dominant Category</span>
            <p className="text-sm font-bold text-white mt-1.5 truncate max-w-[160px]">
              {topCategory ? `${topCategory.name} (${topCategory.articleCount})` : "None"}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300">
            <BarChart3 className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search categories or slugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/40 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Slug Link</th>
                <th className="pb-3 px-2">Total Articles</th>
                <th className="pb-3 px-2">Created Date</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-xs">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-slate-400">No categories found</p>
                      <p className="text-[10px] text-slate-500">Try modifying your search filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-900/20 transition-colors group animate-in fade-in duration-200">
                    {/* Category Name */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-300 uppercase">
                          {cat.name.slice(0, 2)}
                        </div>
                        <span className="font-semibold text-slate-200">{cat.name}</span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-2">
                      <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-1 rounded-lg border border-slate-900">
                        /{cat.slug}
                      </span>
                    </td>

                    {/* Article Count */}
                    <td className="py-4 px-2 font-semibold text-slate-300">
                      {cat.articleCount}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-2 text-slate-500">
                      {cat.createdAt}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedCat(cat);
                            setIsEditOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="Edit Name"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCat(cat);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-450 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AddCategoryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddCategory}
      />

      {/* Edit Modal */}
      {selectedCat && (
        <EditCategoryModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedCat(null);
          }}
          onConfirm={handleEditCategory}
          currentName={selectedCat.name}
        />
      )}

      {/* Delete Modal */}
      {selectedCat && (
        <DeleteCategoryModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedCat(null);
          }}
          onConfirm={handleDeleteCategory}
          categoryName={selectedCat.name}
        />
      )}
    </div>
  );
}