import { Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  originalImage: string | null;
  onReset: () => void;
}

const Header = ({ originalImage, onReset }: HeaderProps) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CITRA
          </h1>
          <span className="text-xs font-medium bg-slate-800 px-2 py-1 rounded-md text-slate-400 border border-slate-700 ml-2">
            CT Image Analyzer
          </span>
        </div>
        <div>
          <button 
            onClick={onReset}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            disabled={!originalImage}
          >
            <RefreshCw className="w-4 h-4" /> Reset Image
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
