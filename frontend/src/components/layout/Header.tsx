import { Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  originalImage: string | null;
  onReset: () => void;
}

const Header = ({ originalImage, onReset }: HeaderProps) => {
  return (
    <header className="border-b border-gray-300 bg-white sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600 p-2 rounded-none">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            CITRA <span className="font-light text-slate-400">v0.1</span>
          </h1>
          <div className="h-6 w-[1px] bg-gray-300 mx-3 hidden sm:block"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 hidden sm:block">
            CT Diagnostic System
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={onReset}
            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-600 transition-colors flex items-center gap-2"
            disabled={!originalImage}
          >
            <RefreshCw className="w-4 h-4" /> Reset Session
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
