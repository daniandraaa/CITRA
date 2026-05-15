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
    <div className="bg-white rounded-none border border-gray-300 shadow-sm h-[calc(100vh-10rem)] min-h-[600px] flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">VISUAL_DIAGNOSTIC_CANVAS</h3>
        {processedImage && (
          <a href={processedImage} download={`citra_${activeTab}.png`} className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-none transition-colors">
            <Download className="w-4 h-4" /> EXPORT_RESULT
          </a>
        )}
      </div>

      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center p-6 gap-6 relative overflow-hidden bg-[#f0f2f5]">
        {!originalImage ? (
          <div className="text-center opacity-40">
            <LayoutGrid className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">System Idle</p>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase">Awaiting source input...</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row gap-6">
            
            {/* Before */}
            <div className="flex-1 flex flex-col">
              <div className="bg-slate-800 px-4 py-1.5 flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-widest">SOURCE_RAW</span>
                <span className="text-xs text-slate-400 font-mono">CH_01</span>
              </div>
              <div className="flex-1 bg-black overflow-hidden relative flex items-center justify-center border border-slate-800">
                <img src={originalImage} alt="Original CT" className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            {/* After */}
            <div className="flex-1 flex flex-col relative">
              <div className="bg-cyan-900 px-4 py-1.5 flex justify-between items-center">
                <span className="text-xs font-bold text-cyan-200 uppercase tracking-widest">PROC_RESULT</span>
                <span className="text-xs text-cyan-400 font-mono">DEV_V01</span>
              </div>
              <div className={`flex-1 bg-black overflow-hidden relative flex items-center justify-center border border-cyan-900/50 transition-all ${loading ? 'opacity-40 grayscale' : ''}`}>
                <img src={processedImage || originalImage} alt="Processed CT" className="max-w-full max-h-full object-contain" />
              </div>
              
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                   <div className="bg-white p-6 rounded-none shadow-2xl flex items-center gap-4 border-2 border-cyan-600">
                     <RefreshCw className="w-6 h-6 text-cyan-600 animate-spin" />
                     <span className="font-black text-slate-900 text-xs uppercase tracking-widest">Calculating Pipeline...</span>
                   </div>
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
      
      {/* Footer Info */}
      {originalImage && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Resolution: 512 x 512 px</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Depth: 16-bit simulation</span>
          </div>
          <span className="text-xs font-bold text-cyan-600 uppercase animate-pulse">Real-time pipeline active</span>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
