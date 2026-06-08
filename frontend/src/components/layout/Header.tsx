import { Activity, RefreshCw, Settings2, Zap } from 'lucide-react';
import type { AppMode } from '../../types';

interface HeaderProps {
  originalImage: string | null;
  onReset: () => void;
  appMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Header = ({ originalImage, onReset, appMode, onModeChange }: HeaderProps) => {
  return (
    <header className="border-b border-gray-300 bg-white sticky top-0 z-10 shadow-sm">
      {/* Top Bar - Logo & Reset */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600 p-2 rounded-none">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            CITRA <span className="font-light text-slate-400">v0.1</span>
          </h1>
          <div className="h-5 w-[1px] bg-gray-300 mx-3 hidden sm:block"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:block">
            CT Diagnostic System
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={onReset}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-600 transition-colors flex items-center gap-2"
            disabled={!originalImage}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Session
          </button>
        </div>
      </div>
      
      {/* Bottom Bar - Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
        <button
          onClick={() => onModeChange('per-module')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${
            appMode === 'per-module' 
              ? 'border-cyan-600 text-cyan-700 bg-cyan-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-gray-50'
          }`}
        >
          <Settings2 className="w-4 h-4" /> Per-Module
        </button>
        <button
          onClick={() => onModeChange('pipeline')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${
            appMode === 'pipeline' 
              ? 'border-cyan-600 text-cyan-700 bg-cyan-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-gray-50'
          }`}
        >
          <Zap className="w-4 h-4" /> Pipeline
        </button>
      </div>
    </header>
  );
};

export default Header;
