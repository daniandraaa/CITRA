import { useRef, type ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface UploadCardProps {
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

const UploadCard = ({ onFileUpload }: UploadCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full blur-2xl"></div>
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-indigo-400" /> Data Source
      </h2>
      <div 
        className="border-2 border-dashed border-slate-600 hover:border-indigo-500 bg-slate-800/30 rounded-xl p-8 text-center cursor-pointer transition-colors group"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="bg-slate-700/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
          <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
        </div>
        <p className="text-sm font-medium text-slate-300">Click to upload CT Scan</p>
        <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG formats</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileUpload} 
          accept="image/png, image/jpeg" 
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default UploadCard;
