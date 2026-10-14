import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Phone,
  MessageCircle,
  Clock,
  Trash2,
  CheckCircle,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { ContactEnquiry } from '../../types';
import { updateEnquiryStatus, deleteEnquiry } from '../../services/store';
import { EnquiryDetailModal } from './EnquiryDetailModal';

interface ClientEnquiriesProps {
  enquiries: ContactEnquiry[];
  onEnquiriesUpdated: (enquiries: ContactEnquiry[]) => void;
}

export const ClientEnquiries: React.FC<ClientEnquiriesProps> = ({
  enquiries,
  onEnquiriesUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<ContactEnquiry | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.phone.includes(searchQuery) ||
        (e.email && e.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' ? true : e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, searchQuery, statusFilter]);

  const handleStatusChange = async (
    id: string,
    status: 'new' | 'contacted' | 'completed',
    notes?: string
  ) => {
    const updated = await updateEnquiryStatus(id, status, notes);
    const updatedList = enquiries.map((e) => (e.id === id ? updated : e));
    onEnquiriesUpdated(updatedList);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry(updated);
    }
    setNotification(`Status for ${updated.name} updated to "${status}".`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id: string) => {
    await deleteEnquiry(id);
    const updatedList = enquiries.filter((e) => e.id !== id);
    onEnquiriesUpdated(updatedList);
    setEnquiryToDelete(null);
    setNotification('Enquiry deleted successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="font-serif-luxury text-3xl text-white font-normal uppercase tracking-wide">
            Client Enquiries
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review incoming booking leads, initiate WhatsApp dialogues, and track client communications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">Total Enquiries:</span>
          <span className="text-amber-400 font-bold tabular-nums">{enquiries.length}</span>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0d0d10] border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, phone, message..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-lg border border-zinc-800 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-[11px] font-medium rounded transition-colors uppercase tracking-wider whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({enquiries.length})
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1 text-[11px] font-medium rounded transition-colors uppercase tracking-wider whitespace-nowrap ${
              statusFilter === 'new'
                ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            New ({enquiries.filter((e) => e.status === 'new').length})
          </button>
          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-3 py-1 text-[11px] font-medium rounded transition-colors uppercase tracking-wider whitespace-nowrap ${
              statusFilter === 'contacted'
                ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Contacted ({enquiries.filter((e) => e.status === 'contacted').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 text-[11px] font-medium rounded transition-colors uppercase tracking-wider whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Completed ({enquiries.filter((e) => e.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Enquiries Table */}
      {filteredEnquiries.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950">
          <p className="text-zinc-400 text-xs">No client enquiries found in this view.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0f0f13] shadow-md">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-950/60 text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Message Preview</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredEnquiries.map((enquiry) => {
                const cleanPhone = enquiry.phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hello ${enquiry.name}, this is Mandavkar Creation regarding your enquiry.`
                )}`;

                return (
                  <tr
                    key={enquiry.id}
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className="hover:bg-zinc-900/40 transition-colors cursor-pointer"
                  >
                    {/* Client Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">{enquiry.name}</div>
                      {enquiry.email && (
                        <span className="text-[11px] text-zinc-500 font-mono block">
                          {enquiry.email}
                        </span>
                      )}
                    </td>

                    {/* Phone Number with Click-to-Call */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${enquiry.phone}`}
                          title="Call client"
                          className="font-mono text-zinc-300 hover:text-amber-400 transition-colors"
                        >
                          {enquiry.phone}
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open WhatsApp chat"
                          className="p-1 rounded bg-emerald-950/50 text-emerald-400 hover:bg-emerald-900 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Message Preview */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-zinc-300 text-xs truncate">{enquiry.message}</p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                          enquiry.status === 'new'
                            ? 'bg-amber-950/70 text-amber-400 border border-amber-800/60'
                            : enquiry.status === 'contacted'
                            ? 'bg-blue-950/70 text-blue-400 border border-blue-800/60'
                            : 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px] tabular-nums">
                      {new Date(enquiry.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          title="View Details"
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEnquiryToDelete(enquiry)}
                          title="Delete Enquiry"
                          className="p-1.5 text-red-400/80 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {/* Confirm Delete Enquiry Modal */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f13] border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif-luxury text-xl text-white font-medium">Delete Enquiry</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Are you sure you want to delete the enquiry from <strong>{enquiryToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEnquiryToDelete(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(enquiryToDelete.id)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
