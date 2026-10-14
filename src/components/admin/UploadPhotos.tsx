import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Plus,
} from 'lucide-react';
import { uploadImageFile, addPhoto } from '../../services/store';
import { GalleryPhoto, CategoryItem } from '../../types';

interface UploadPhotosProps {
  categories: CategoryItem[];
  onPhotoAdded: (photo: GalleryPhoto) => void;
  onViewGallery: () => void;
}

interface StagedFile {
  id: string;
  file?: File;
  previewUrl: string;
  title: string;
  description: string;
  category: string;
  isPublished: boolean;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export const UploadPhotos: React.FC<UploadPhotosProps> = ({
  categories,
  onPhotoAdded,
  onViewGallery,
}) => {
  const defaultCategory = categories.length > 0 ? categories[0].name : 'Weddings';
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const [overallSuccessMessage, setOverallSuccessMessage] = useState('');
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newStaged: StagedFile[] = Array.from(files).map((file) => {
      const defaultTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      return {
        id: `staged-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        title: defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1),
        description: '',
        category: defaultCategory,
        isPublished: true,
        status: 'idle',
      };
    });

    setStagedFiles((prev) => [...prev, ...newStaged]);
    setOverallSuccessMessage('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleAddFromUrl = () => {
    if (!manualUrlInput.trim()) return;

    const newStaged: StagedFile = {
      id: `staged-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      previewUrl: manualUrlInput.trim(),
      title: 'Monochrome Wedding Frame',
      description: '',
      category: defaultCategory,
      isPublished: true,
      status: 'idle',
    };

    setStagedFiles((prev) => [...prev, newStaged]);
    setManualUrlInput('');
    setShowManualUrl(false);
  };

  const handleRemoveStaged = (id: string) => {
    setStagedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateStaged = (id: string, updates: Partial<StagedFile>) => {
    setStagedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleUploadAll = async () => {
    if (stagedFiles.length === 0) return;

    setIsUploadingAll(true);
    setOverallSuccessMessage('');
    let uploadedCount = 0;

    for (let i = 0; i < stagedFiles.length; i++) {
      const item = stagedFiles[i];
      if (item.status === 'success') continue;

      handleUpdateStaged(item.id, { status: 'uploading' });

      try {
        let finalImageUrl = item.previewUrl;
        let storagePath: string | undefined = undefined;

        if (item.file) {
          const uploadRes = await uploadImageFile(item.file);
          finalImageUrl = uploadRes.url;
          storagePath = uploadRes.path;
        }

        const created = await addPhoto({
          title: item.title.trim() || 'Untitled Photograph',
          description: item.description.trim() || undefined,
          category: item.category,
          image_url: finalImageUrl,
          storage_path: storagePath,
          is_published: item.isPublished,
        });

        onPhotoAdded(created);
        handleUpdateStaged(item.id, { status: 'success' });
        uploadedCount++;
      } catch (err: any) {
        handleUpdateStaged(item.id, {
          status: 'error',
          errorMessage: err.message || 'Upload failed',
        });
      }
    }

    setIsUploadingAll(false);
    if (uploadedCount > 0) {
      setOverallSuccessMessage(
        `Successfully uploaded and catalogued ${uploadedCount} photograph${
          uploadedCount > 1 ? 's' : ''
        }! Published photos appear in their respective category gallery.`
      );
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="font-serif-luxury text-3xl text-white font-normal uppercase tracking-wide">
            Upload Photographs
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Add high-resolution photography into categories. Published photos appear in public category galleries immediately.
          </p>
        </div>

        <button
          onClick={onViewGallery}
          className="text-xs text-amber-400 hover:text-amber-300 uppercase tracking-wider font-medium cursor-pointer self-start sm:self-auto"
        >
          View Live Gallery →
        </button>
      </div>

      {overallSuccessMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center justify-between gap-4 text-emerald-300 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{overallSuccessMessage}</span>
          </div>
          <button
            onClick={onViewGallery}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium tracking-wide uppercase text-[11px] shrink-0"
          >
            Go to Gallery
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-400 bg-amber-950/20'
            : 'border-zinc-800 hover:border-zinc-700 bg-[#0d0d10]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="font-serif-luxury text-xl text-white font-medium">
          Drag and drop your photographs here
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto font-light">
          Supports JPEG, PNG, WebP up to 15MB each. You can select single or multiple images.
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors">
            Browse Local Files
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowManualUrl(!showManualUrl);
            }}
            className="px-3 py-2 text-xs text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Add by Web URL</span>
          </button>
        </div>
      </div>

      {/* Manual URL Input */}
      {showManualUrl && (
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg flex items-center gap-3">
          <input
            type="url"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            placeholder="Paste image URL (e.g. https://...)"
            className="flex-1 px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleAddFromUrl}
            className="px-4 py-2 bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider rounded hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Staged Image Items Preview & Configuration */}
      {stagedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Staged Photos ({stagedFiles.length})
            </h3>
            <button
              onClick={() => setStagedFiles([])}
              className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {stagedFiles.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#0f0f13] border border-zinc-800/80 flex flex-col md:flex-row gap-5 items-start"
              >
                {/* Thumbnail Preview */}
                <div className="w-full md:w-40 aspect-[4/3] rounded-lg overflow-hidden bg-black border border-zinc-800 shrink-0 relative">
                  <img
                    src={item.previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStaged(item.id)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black rounded text-zinc-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Form Inputs for Metadata */}
                <div className="flex-1 w-full space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">
                        Photograph Title <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateStaged(item.id, { title: e.target.value })}
                        placeholder="e.g. Royal Courtyard Vow"
                        className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">
                        Category <span className="text-amber-400">*</span>
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateStaged(item.id, { category: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">
                      Optional Caption / Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleUpdateStaged(item.id, { description: e.target.value })
                      }
                      placeholder="e.g. Candid celebration with golden ambient backlighting..."
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Publication Toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <label className="text-[11px] text-zinc-300 flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isPublished}
                          onChange={(e) =>
                            handleUpdateStaged(item.id, { isPublished: e.target.checked })
                          }
                          className="rounded border-zinc-700 text-amber-400 focus:ring-0"
                        />
                        <span className="font-medium">
                          {item.isPublished ? 'Publish to Public Gallery' : 'Save as Draft'}
                        </span>
                      </label>
                    </div>

                    {item.status === 'uploading' && (
                      <span className="text-xs text-amber-400 animate-pulse font-mono">
                        Uploading...
                      </span>
                    )}
                    {item.status === 'success' && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-xs text-red-400 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" /> {item.errorMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 text-xs uppercase tracking-wider text-zinc-300 hover:text-white border border-zinc-800 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More</span>
            </button>

            <button
              onClick={handleUploadAll}
              disabled={isUploadingAll}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <UploadCloud className="w-4 h-4" />
              <span>
                {isUploadingAll
                  ? 'Saving to Database...'
                  : `Publish / Save ${stagedFiles.length} Photo${
                      stagedFiles.length > 1 ? 's' : ''
                    }`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
