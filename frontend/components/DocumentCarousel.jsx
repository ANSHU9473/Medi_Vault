'use client';
import { useState } from 'react';
import { FileText, Trash2, Calendar, Eye, Edit2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DocumentCarousel({ documents, folderId, onDelete, onRename }) {
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState('');

  const startEditing = (doc) => {
    setEditingId(doc._id);
    setTempTitle(doc.title || doc.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempTitle('');
  };

  const handleRenameSubmit = async (docId) => {
    if (!tempTitle.trim()) return;
    await onRename(docId, tempTitle);
    setEditingId(null);
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-20 glass rounded-3xl border border-surface-700/50">
        <FileText className="w-16 h-16 text-surface-700 dark:text-surface-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-surface-foreground mb-2">No documents</h3>
        <p className="text-sm text-surface-secondary">Scan or upload a new record to add it to this folder</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {documents.map((doc, idx) => (
        <motion.div
          key={doc._id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="glass border border-surface-700/50 hover:border-primary-500/50 rounded-2xl p-5 group flex flex-col justify-between transition-all"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.preventDefault(); startEditing(doc); }}
                  className="p-2 text-surface-secondary hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors"
                  title="Rename Document"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); onDelete?.(doc._id); }}
                  className="p-2 text-surface-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {editingId === doc._id ? (
              <div className="mb-3 space-y-2">
                <input
                  autoFocus
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit(doc._id);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  className="w-full px-3 py-1.5 bg-surface-700 border border-primary-500/50 rounded-lg text-sm text-surface-foreground focus:outline-none"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRenameSubmit(doc._id)}
                    className="flex-1 py-1 bg-primary-500 text-white rounded-md text-xs font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Check size={12} /> Save
                  </button>
                  <button 
                    onClick={cancelEditing}
                    className="flex-1 py-1 bg-surface-700 text-surface-secondary rounded-md text-xs font-medium hover:bg-surface-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h4 
                className="font-semibold text-surface-foreground mb-1 line-clamp-2 cursor-pointer hover:text-primary-500 transition-colors" 
                title={doc.title || doc.name}
                onClick={() => startEditing(doc)}
              >
                {doc.title || doc.name}
              </h4>
            )}

            <div className="flex items-center gap-2 text-xs text-surface-secondary mb-4">
              <Calendar size={14} />
              <span>{new Date(doc.createdAt || Date.now()).toLocaleDateString()}</span>
              <span className="w-1 h-1 rounded-full bg-surface-700 mx-1" />
              <span className="uppercase">{doc.fileType?.split('/')[1] || doc.type?.split('/')[1] || 'PDF'}</span>
            </div>
          </div>
          
          <div className="mt-2">
            <Link 
              href={`/dashboard/folder/${folderId}/doc/${doc._id}`}
              className="w-full py-2.5 bg-surface-700 hover:bg-surface-600 text-surface-secondary hover:text-surface-foreground rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              View Document
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
