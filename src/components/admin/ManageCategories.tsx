import React, { useState } from 'react';
import {
  FolderPlus,
  Edit2,
  Trash2,
  Images,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  UploadCloud,
  Layers,
} from 'lucide-react';
import { CategoryItem, GalleryPhoto } from '../../types';
import { addCategory, updateCategory, deleteCategory, uploadImageFile } from '../../services/store';

interface ManageCategoriesProps {
  categories: CategoryItem[];
  photos: GalleryPhoto[];
  onCategoriesUpdated: (categories: CategoryItem[]) => void;
  onSelectCategoryFilter: (categoryName: string) => void;
}

export const ManageCategories: React.FC<ManageCategoriesProps> = ({
  categories,
  photos,
  onCategoriesUpdated,
  onSelectCategoryFilter,
}) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Calculate photo count per category
  const photoCounts: Record<string, number> = {};
  photos.forEach((p) => {
    photoCounts[p.category] = (photoCounts[p.category] || 0) + 1;
  });

  const handleOpenCreate = () => {
    setActiveCategory(null);
    setName('');
    setDescription('');
    setCoverImage('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');
    setError('');
    setModalMode('create');
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setActiveCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setCoverImage(cat.cover_image || '');
    setError('');
    setModalMode('edit');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImageFile(file);
      setCoverImage(url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload cover image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (modalMode === 'create') {
        const created = await addCategory({
          name: name.trim(),
          slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: description.trim() || undefined,
          cover_image: coverImage.trim() || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        });
        onCategoriesUpdated([...categories, created]);
        setNotification(`Category "${created.name}" created successfully.`);
      } else if (modalMode === 'edit' && activeCategory) {
        const updated = await updateCategory(activeCategory.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          cover_image: coverImage.trim(),
        });
        onCategoriesUpdated(categories.map((c) => (c.id === updated.id ? updated : c)));
        setNotification(`Category "${updated.name}" updated successfully.`);
      }
      setModalMode(null);
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      onCategoriesUpdated(categories.filter((c) => c.id !== categoryToDelete.id));
      setNotification(`Category "${categoryToDelete.name}" deleted. Any existing photos were preserved.`);
      setCategoryToDelete(null);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="font-serif-luxury text-3xl text-white font-normal uppercase tracking-wide">
            Manage Gallery Categories
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create, edit, or remove photography collections and assign album cover imagery.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = photoCounts[cat.name] || 0;
          return (
            <div
              key={cat.id}
              className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0f0f13] flex flex-col justify-between group hover:border-zinc-700 transition-colors"
            >
              {/* Category Cover Image */}
              <div className="relative aspect-[16/9] bg-zinc-950 overflow-hidden">
                <img
                  src={cat.cover_image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-amber-400 border border-zinc-700/60">
                  {count} Photos
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-serif-luxury text-xl text-white font-medium">{cat.name}</h3>
                </div>
              </div>

              {/* Details and Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <p className="text-xs text-zinc-400 font-light line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectCategoryFilter(cat.name)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium uppercase tracking-wider text-[11px]"
                  >
                    <Images className="w-3.5 h-3.5" />
                    <span>View Photos ({count})</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f13] border border-zinc-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-serif-luxury text-xl text-white font-medium">
                {modalMode === 'create' ? 'Add New Photography Category' : 'Edit Category'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Category Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Weddings, Pre-Wedding, Maternity"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Description / Story
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short introductory note displayed on the category cover..."
                  className="w-full px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Album Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400 mb-2"
                />

                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded cursor-pointer transition-colors flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Cover Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {coverImage && (
                    <div className="w-12 h-8 rounded overflow-hidden border border-zinc-700">
                      <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 rounded transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f13] border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif-luxury text-xl text-white font-medium">Delete Category</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to remove the category <strong className="text-white">"{categoryToDelete.name}"</strong>?
              Photos currently in this category will NOT be deleted; they will be safely kept and reassigned.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded transition-colors"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
