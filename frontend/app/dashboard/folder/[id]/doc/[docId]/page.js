'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function DocumentViewerPage() {
    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, [params.docId]);

    const fetchReport = async () => {
        try {
            const res = await fetch(`/api/reports/${params.docId}`);
            const data = await res.json();
            if (data.report) {
                setReport(data.report);
            }
        } catch (err) {
            console.error('Failed to fetch report:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-100px)]">
                <div className="h-12 w-48 skeleton rounded-xl mb-6" />
                <div className="flex-1 skeleton rounded-2xl mb-6" />
                <div className="h-40 skeleton rounded-2xl" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="max-w-6xl mx-auto text-center py-20">
                <h2 className="text-2xl font-bold text-white mb-4">Document Not Found</h2>
                <button onClick={() => router.push(`/dashboard/folder/${params.id}`)} className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors">
                    Back to Folder
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-100px)]">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6"
            >
                <div className="flex items-center gap-4">
                    <Link
                        href={`/dashboard/folder/${params.id}`}
                        className="p-2.5 glass rounded-xl text-surface-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold line-clamp-1">{report.title || report.name || 'Document'}</h1>
                            <p className="text-xs text-surface-400">
                                Uploaded on {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">Download</span>
                </a>
            </motion.div>

            {/* Document Viewer */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden mb-6 shadow-xl relative min-h-[400px] flex items-center justify-center"
            >
                {report.fileUrl ? (
                    report.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                        <img 
                            src={report.fileUrl} 
                            alt={report.title} 
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <iframe
                            src={report.fileUrl}
                            className="w-full h-full border-0"
                            title={report.title}
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center gap-3 text-surface-400">
                        <FileText size={48} className="opacity-20" />
                        <p>No preview available for this file type</p>
                    </div>
                )}
            </motion.div>

            {/* AI Summary Section below PDF */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 mb-12"
            >
                {/* Header with blue clinical theme */}
                <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-slate-900">Clinical AI Analysis</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Medical Insight Protocol</p>
                    </div>
                </div>

                {report.summary ? (
                    <div className="text-slate-800 leading-relaxed font-medium">
                        <ReactMarkdown 
                            components={{
                                p: ({node, ...props}) => <p className="mb-4 text-slate-700" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold text-blue-800 bg-blue-50/50 px-1 rounded border-b border-blue-100" {...props} />,
                                li: ({node, ...props}) => <li className="ml-4 list-disc text-slate-700 mb-2 marker:text-blue-500" {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-2xl font-black text-slate-900 mt-8 mb-4 border-l-4 border-blue-600 pl-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3 flex items-center gap-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2 underline underline-offset-8 decoration-blue-500/30" {...props} />,
                                ul: ({node, ...props}) => <ul className="mb-6 space-y-1" {...props} />
                            }}
                        >
                            {report.summary}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="text-slate-400 text-sm italic py-4 bg-slate-50 rounded-xl px-4 border border-dashed border-slate-200">
                        No AI analysis is available for this document. Please re-upload to trigger the clinical engine.
                    </div>
                )}
            </motion.div>
        </div>
    );
}
