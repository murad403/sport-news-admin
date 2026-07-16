"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Tag, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CustomPagination from "@/components/shared/CustomPagination";
import { Category } from "@/redux/features/categories/categories.type";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/features/categories/categories.api";

export default function SportsCategoriesPage() {
  const { toast } = useToast();

  // Search filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch categories using RTK Query
  const { data, isLoading } = useGetCategoriesQuery({
    page,
    search: debouncedSearch,
  });

  const categories = data?.results || [];
  const totalCategories = data?.count || 0;

  // Mutation hooks
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Modal control states
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // CRUD handlers
  const handleAddCategory = async (name: string) => {
    try {
      await addCategory({ name }).unwrap();
      toast(`Category "${name}" created successfully!`, "success");
      setIsAddOpen(false);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to create category.";
      toast(errorMsg, "error");
    }
  };

  const handleEditCategory = async (newName: string) => {
    if (!selectedCat) return;
    try {
      await updateCategory({ id: selectedCat.slug, name: newName }).unwrap();
      toast(`Category updated to "${newName}" successfully!`, "success");
      setIsEditOpen(false);
      setSelectedCat(null);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to update category.";
      toast(errorMsg, "error");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCat) return;
    try {
      await deleteCategory(selectedCat.slug).unwrap();
      toast(`Category "${selectedCat.name}" deleted successfully!`, "success");
      setIsDeleteOpen(false);
      setSelectedCat(null);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to delete category.";
      toast(errorMsg, "error");
    }
  };

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
      <div className="max-w-xs">
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
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-550 outline-none transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/40 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">Name</th>
                <th className="pb-3 px-2">Slug</th>
                <th className="pb-3 px-2 whitespace-nowrap">News Count</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-[10px] text-slate-500 mt-1">Loading categories...</p>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-slate-400">No categories found</p>
                      <p className="text-[10px] text-slate-500">Try modifying your search filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-900/20 transition-colors group animate-in fade-in duration-200">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-300 uppercase">
                          {cat.name.slice(0, 2)}
                        </div>
                        <span className="font-semibold text-slate-200">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-1 rounded-lg border border-slate-900">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-semibold text-slate-300">
                      {cat.news_count ?? 0}
                    </td>
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

        {/* Custom Pagination */}
        <CustomPagination
          count={totalCategories}
          page={page}
          pageSize={20}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* Add Modal */}
      <AddCategoryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddCategory}
        isLoading={isAdding}
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
          isLoading={isUpdating}
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
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}