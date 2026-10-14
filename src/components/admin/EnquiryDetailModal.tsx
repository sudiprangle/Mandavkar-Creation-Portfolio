import React, { useState } from 'react';
import { X, Phone, Mail, MessageCircle, CheckCircle, Clock, Trash2, ArrowUpRight, Save } from 'lucide-react';
import { ContactEnquiry } from '../../types';

interface EnquiryDetailModalProps {
  enquiry: ContactEnquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: 'new' | 'contacted' | 'completed', notes?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  enquiry,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}) => {
  const [notes, setNotes] = useState(enquiry?.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen || !enquiry) return null;

  // Clean phone number for WhatsApp
  const cleanPhone = enquiry.phone.replace(/[^0-9]/g, '');
  const whatsappGreeting = encodeURIComponent(
    `Hello ${enquiry.name}, this is Mandavkar Creation following up regarding your photography inquiry.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappGreeting}`;

  const handleUpdate = async (status: 'new' | 'contacted' | 'completed') => {
    setIsUpdating(true);
    try {
      await onStatusChange(enquiry.id, status, notes);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await onDelete(enquiry.id);
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f13] border border-zinc-800 rounded-xl max-w-xl w-full p-6 shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-luxury text-2xl text-white font-medium">
                {enquiry.name}
              </h3>
              <span
                className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                  enquiry.status === 'new'
                    ? 'bg-amber-950/70 text-amber-400 border border-amber-800/60'
                    : enquiry.status === 'contacted'
                    ? 'bg-blue-950/70 text-blue-400 border border-blue-800/60'
                    : 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                }`}
              >
                {enquiry.status}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
              Received on{' '}
              {new Date(enquiry.created_at).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`tel:${enquiry.phone}`}
            className="p-3 bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-lg flex items-center justify-between text-zinc-200 hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Call Client</span>
                <span className="text-xs font-medium font-mono">{enquiry.phone}</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-emerald-950/30 border border-emerald-800/40 hover:border-emerald-600 rounded-lg flex items-center justify-between text-emerald-300 hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-400 block">WhatsApp</span>
                <span className="text-xs font-medium">Open Direct Chat</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>

        {enquiry.email && (
          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <a href={`mailto:${enquiry.email}`} className="hover:underline">
              {enquiry.email}
            </a>
          </div>
        )}

        {/* Client Message */}
        <div>
          <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
            Client Message
          </label>
          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800/80 text-zinc-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-light">
            {enquiry.message}
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
            Internal Studio Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes (e.g. Quoted ₹1.5L for Udaipur wedding package, follow-up scheduled for Friday)..."
            className="w-full px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
          />
        </div>

        {/* Status Actions */}
        <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">Mark Status:</span>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdate('new')}
              className={`px-2.5 py-1 text-[11px] uppercase font-mono rounded cursor-pointer ${
                enquiry.status === 'new'
                  ? 'bg-amber-400 text-black font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              New
            </button>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdate('contacted')}
              className={`px-2.5 py-1 text-[11px] uppercase font-mono rounded cursor-pointer ${
                enquiry.status === 'contacted'
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              Contacted
            </button>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdate('completed')}
              className={`px-2.5 py-1 text-[11px] uppercase font-mono rounded cursor-pointer ${
                enquiry.status === 'completed'
                  ? 'bg-emerald-500 text-white font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              Completed
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="text-xs text-red-400/80 hover:text-red-300 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        {/* Confirm Delete prompt */}
        {showConfirmDelete && (
          <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-lg text-xs space-y-3">
            <p className="text-red-300">
              Permanently delete this enquiry from <strong>{enquiry.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-medium"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
