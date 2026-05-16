'use client';
import { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';

export default function ScanUploadFAB({ folders, onUpload, lockedFolderId, lockedFolderName }) {
  const [open, setOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  const [selectedFolder, setSelectedFolder] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleFabClick = () => setOpen(!open);
  
  const handleUploadClick = () => {
    setOpen(false);
    setUploadModalOpen(true);
    if (lockedFolderId) {
      setSelectedFolder(lockedFolderId);
    } else if (folders?.length > 0) {
      setSelectedFolder(folders[0]._id);
    }
  };
  
  const submitUpload = async (e) => {
    e.preventDefault();
    if (!selectedFolder || !fileName || !file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', fileName);
    formData.append('folderId', selectedFolder);
    formData.append('report', file);
    
    await onUpload(formData);
    
    setUploadModalOpen(false);
    setFileName('');
    setFile(null);
    setLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
        {open && (
          <div className="flex flex-col gap-3 items-end animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="bg-surface-800 text-surface-foreground px-3 py-1.5 rounded-lg text-sm font-medium shadow-glass border border-surface-700/50">Upload File</span>
              <button 
                onClick={handleUploadClick}
                className="w-12 h-12 bg-surface-800 border border-surface-700/50 rounded-full flex items-center justify-center text-surface-foreground hover:bg-surface-700 transition-all shadow-glass hover:scale-110"
              >
                <Upload size={20} />
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={handleFabClick}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-medical ${open ? 'bg-surface-700 rotate-45' : 'bg-primary-500 hover:scale-105'}`}
        >
          <Plus size={28} />
        </button>
      </div>

      {uploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUploadModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-surface-800 border border-surface-700/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-surface-700/40">
              <h2 className="text-xl font-semibold text-surface-foreground flex items-center gap-2">
                <Upload size={20} className="text-primary-500" />
                Upload Document
              </h2>
              <button onClick={() => setUploadModalOpen(false)} className="text-surface-secondary hover:text-surface-foreground transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={submitUpload} className="p-5 space-y-5">
              {lockedFolderId ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                  <span className="text-lg">📁</span>
                  <div>
                    <p className="text-xs text-primary-500 font-medium">Uploading to folder</p>
                    <p className="text-sm text-surface-foreground font-semibold">{lockedFolderName || 'Current Folder'}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-surface-secondary mb-2">Select Folder</label>
                  <select 
                    value={selectedFolder} 
                    onChange={e => setSelectedFolder(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-700 border border-surface-700/60 rounded-xl text-surface-foreground focus:outline-none focus:border-primary-500 transition-all"
                    required
                  >
                    <option value="" disabled>Choose a folder...</option>
                    {folders?.map(f => (
                      <option key={f._id} value={f._id}>{f.icon} {f.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-surface-secondary mb-2">Document Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g., Blood Test Results"
                  className="w-full px-4 py-3 bg-surface-700 border border-surface-700/60 rounded-xl text-surface-foreground placeholder-surface-400 focus:outline-none focus:border-primary-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-secondary mb-2">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.docx,image/*"
                  className="w-full px-4 py-3 bg-surface-700 border border-surface-700/60 rounded-xl text-surface-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600 focus:outline-none transition-all cursor-pointer"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!fileName || !selectedFolder || !file || loading}
                  className="w-full px-4 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? 'Uploading safely...' : 'Upload to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
