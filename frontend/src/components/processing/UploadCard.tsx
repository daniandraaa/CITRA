import { useRef, type ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface UploadCardProps {
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

const UploadCard = ({ onFileUpload }: UploadCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-none border border-gray-300 p-6 shadow-sm relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <Upload className="w-5 h-5 text-cyan-600" /> 01. Input Source
        </h2>
        <span className="text-xs text-slate-400 font-mono">STATUS: READY</span>
      </div>
      
      <div 
        className="border border-dashed border-gray-300 hover:border-cyan-500 bg-gray-50 rounded-none p-8 text-center cursor-pointer transition-all group"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-gray-400 group-hover:text-cyan-600 mx-auto mb-3 transition-colors" />
        <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">Select CT DICOM/Image</p>
        <p className="text-xs text-slate-400 mt-1 uppercase">RAW DATA INTAKE</p>
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
