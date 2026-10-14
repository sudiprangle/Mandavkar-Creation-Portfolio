import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { GalleryPhoto, CategoryItem } from '../../types';

interface EditPhotoModalProps {
  photo: GalleryPhoto | null;
  categories: CategoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<GalleryPhoto>) => Promise<void>;
}

export const EditPhotoModal: React.FC<EditPhotoModalProps> = ({
  photo,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Weddings');
  const [isPublished, setIsPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (photo) {
      setTitle(photo.title);
      setDescription(photo.description || '');
      setCategory(photo.category || (categories[0]?.name || 'Weddings'));
      setIsPublished(photo.is_published);
      setError('');
    }
  }, [photo, categories]);

  if (!isOpen || !photo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onSave(photo.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        is_published: isPublished,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update photo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f13] border border-zinc-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <h3 className="font-serif-luxury text-xl text-white font-medium">Edit Photograph</h3>
          <button
            onClick={onClose}
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

          {/* Photo Thumbnail */}
          <div className="flex items-center gap-4 p-3 bg-zinc-950 rounded-lg border border-zinc-800/80">
            <div className="w-16 h-16 rounded overflow-hidden bg-black shrink-0">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-400 font-mono">Current Photo</p>
              <p className="text-sm text-white font-medium truncate">{photo.title}</p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Description / Caption
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 text-xs text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-zinc-700 text-amber-400 focus:ring-0"
              />
              <span className="font-medium">Published (Visible in Public Gallery)</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
