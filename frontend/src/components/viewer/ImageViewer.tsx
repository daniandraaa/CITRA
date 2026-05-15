import { LayoutGrid, Download, RefreshCw } from 'lucide-react';
import type { ProcessingTab } from '../../types';

interface ImageViewerProps {
  originalImage: string | null;
  processedImage: string | null;
  activeTab: ProcessingTab;
  loading: boolean;
}

const ImageViewer = ({
  originalImage,
  processedImage,
  activeTab,
  loading,
}: ImageViewerProps) => {
  return (
    <div className="bg-slate-800/30 rounded-3xl border border-slate-700 p-2 shadow-2xl h-[calc(100vh-10rem)] min-h-[600px] flex flex-col relative overflow-hidden backdrop-blur-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
        <h3 className="text-sm font-medium text-slate-300">Visual Comparison</h3>
        {processedImage && (
          <a href={processedImage} download={`citra_${activeTab}.png`} className="text-xs flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md transition-colors">
            <Download className="w-3 h-3" /> Export
          </a>
        )}
      </div>

      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center p-6 gap-6 relative overflow-hidden">
        {!originalImage ? (
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
              <LayoutGrid className="w-10 h-10 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">No Image Loaded</p>
            <p className="text-slate-500 text-sm mt-1">Upload a CT scan to start processing</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row gap-6">
            
            {/* Before */}
            <div className="flex-1 flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center">Original</span>
              <div className="flex-1 rounded-2xl border border-slate-700 bg-black overflow-hidden relative group">
                <img src={originalImage} alt="Original CT" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* After */}
            <div className="flex-1 flex flex-col gap-2 relative">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest text-center">Processed</span>
              <div className={`flex-1 rounded-2xl border border-indigo-500/30 bg-black overflow-hidden relative shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all ${loading ? 'opacity-50 blur-sm' : ''}`}>
                <img src={processedImage || originalImage} alt="Processed CT" className="w-full h-full object-contain" />
              </div>
              
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mt-6">
                   <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
                     <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                     <span className="font-medium text-white text-sm">Processing matrix...</span>
                   </div>
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ImageViewer;
