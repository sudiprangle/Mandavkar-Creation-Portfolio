import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { GalleryPhoto, CategoryItem } from '../../types';
import { updatePhoto, deletePhoto } from '../../services/store';
import { EditPhotoModal } from './EditPhotoModal';

interface ManageGalleryProps {
  photos: GalleryPhoto[];
  categories: CategoryItem[];
  initialCategoryFilter?: string;
  onPhotosUpdated: (photos: GalleryPhoto[]) => void;
  onNavigateUpload: () => void;
}

export const ManageGallery: React.FC<ManageGalleryProps> = ({
  photos,
  categories,
  initialCategoryFilter = 'All',
  onPhotosUpdated,
  onNavigateUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhoto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Available categories list
  const categoryOptions = useMemo(() => {
    return ['All', ...categories.map((c) => c.name)];
  }, [categories]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesSearch =
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.description && photo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'published'
          ? photo.is_published
          : !photo.is_published;

      const matchesCategory =
        categoryFilter === 'All' ? true : photo.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [photos, searchQuery, statusFilter, categoryFilter]);

  const handleTogglePublish = async (photo: GalleryPhoto) => {
    try {
      const updated = await updatePhoto(photo.id, {
        is_published: !photo.is_published,
      });

      const updatedList = photos.map((p) => (p.id === photo.id ? updated : p));
      onPhotosUpdated(updatedList);

      setNotification({
        type: 'success',
        message: `Photograph "${photo.title}" marked as ${
          updated.is_published ? 'Published (visible in gallery)' : 'Draft (hidden from public)'
        }.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update publication status',
      });
    }
  };

  const handleSaveEdit = async (id: string, updates: Partial<GalleryPhoto>) => {
    const updated = await updatePhoto(id, updates);
    const updatedList = photos.map((p) => (p.id === id ? updated : p));
    onPhotosUpdated(updatedList);
    setNotification({
      type: 'success',
      message: `Updated "${updated.title}" successfully.`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;
    setIsDeleting(true);
    try {
      await deletePhoto(photoToDelete.id, photoToDelete.storage_path);
      const updatedList = photos.filter((p) => p.id !== photoToDelete.id);
      onPhotosUpdated(updatedList);
      setNotification({
        type: 'success',
        message: `Deleted "${photoToDelete.title}" and its storage file safely.`,
      });
      setPhotoToDelete(null);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete photo',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="font-serif-luxury text-3xl text-white font-normal uppercase tracking-wide">
            Manage Gallery Photos
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Organize, publish, edit, or remove photos across all studio photography collections.
          </p>
        </div>

        <button
          onClick={onNavigateUpload}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-xs ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
              : 'bg-red-950/40 border border-red-800/60 text-red-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0d0d10] border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos by title or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status buttons */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-[11px] font-medium rounded transition-colors uppercase tracking-wider cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({photos.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 text-[11px] font-medium rounded transition-colors uppercase tracking-wider cursor-pointer ${
                statusFilter === 'published'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Published ({photos.filter((p) => p.is_published).length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 text-[11px] font-medium rounded transition-colors uppercase tracking-wider cursor-pointer ${
                statusFilter === 'draft'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Drafts ({photos.filter((p) => !p.is_published).length})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Photos Table */}
      {filteredPhotos.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950">
          <p className="text-zinc-400 text-xs">No photographs match the current filters or search query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0f0f13] shadow-md">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-950/60 text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                <th className="py-3 px-4">Photo Preview</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Added</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredPhotos.map((photo) => (
                <tr key={photo.id} className="hover:bg-zinc-900/40 transition-colors">
                  {/* Thumbnail Preview */}
                  <td className="py-3 px-4 w-24">
                    <div className="w-16 h-12 rounded overflow-hidden bg-black border border-zinc-800">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Title and Description */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-white text-sm">{photo.title}</div>
                    {photo.description && (
                      <p className="text-zinc-400 text-xs truncate max-w-xs mt-0.5">
                        {photo.description}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-zinc-300 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {photo.category}
                    </span>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        photo.is_published
                          ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                          : 'bg-amber-950/70 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      {photo.is_published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-zinc-400 font-mono text-[11px] tabular-nums">
                    {new Date(photo.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Publish / Unpublish Toggle */}
                      <button
                        onClick={() => handleTogglePublish(photo)}
                        title={photo.is_published ? 'Unpublish to draft' : 'Publish to gallery'}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          photo.is_published
                            ? 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800'
                            : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                        }`}
                      >
                        {photo.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingPhoto(photo)}
                        title="Edit title & metadata"
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setPhotoToDelete(photo)}
                        title="Delete photo"
                        className="p-1.5 text-red-400/80 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Photo Modal */}
      <EditPhotoModal
        photo={editingPhoto}
        categories={categories}
        isOpen={Boolean(editingPhoto)}
        onClose={() => setEditingPhoto(null)}
        onSave={handleSaveEdit}
      />

      {/* Confirm Delete Dialog Modal */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f13] border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif-luxury text-xl text-white font-medium">Delete Photograph</h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">"{photoToDelete.title}"</strong>? This will remove the photo metadata and delete the storage asset. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
