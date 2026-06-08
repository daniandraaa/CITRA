import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { PipelineStep } from '../../types';

interface StepCardProps {
  step: PipelineStep;
  index: number;
  onUpdate: (id: string, updates: Partial<PipelineStep>) => void;
  onRemove: (id: string) => void;
}

const StepCard = ({ step, index, onUpdate, onRemove }: StepCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const getModuleLabel = (module: string) => {
    const labels: Record<string, string> = {
      'windowing': 'WINDOWING',
      'noise-removal': 'DENOISE',
      'edge-detection': 'EDGE DETECTION',
      'segmentation': 'ROI SEGMENTATION'
    };
    return labels[module] || module.toUpperCase();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border ${isDragging ? 'border-cyan-500 shadow-lg' : 'border-gray-300'} mb-3`}
    >
      <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab hover:bg-gray-200 p-1 mr-2 text-gray-400"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <span className="text-xs font-mono font-bold text-slate-400 mr-3">
          {(index + 1).toString().padStart(2, '0')}
        </span>
        
        <div className="flex-1 font-bold text-sm text-slate-800 uppercase tracking-wide">
          {getModuleLabel(step.module)}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdate(step.id, { enabled: !step.enabled })}
            className={`text-xs font-bold px-2 py-1 border ${step.enabled ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
          >
            {step.enabled ? 'ON' : 'OFF'}
          </button>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:bg-gray-200"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={() => onRemove(step.id)}
            className="p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-white space-y-4 border-t border-gray-100">
          {step.module === 'windowing' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight block mb-2">PRESET</label>
              <select 
                value={step.config.preset || 'lung'}
                onChange={(e) => onUpdate(step.id, { config: { ...step.config, preset: e.target.value }})}
                className="w-full p-2 border border-gray-300 text-sm font-bold text-slate-700 bg-gray-50"
              >
                <option value="lung">LUNG VIEW</option>
                <option value="bone">BONE VIEW</option>
                <option value="soft_tissue">SOFT TISSUE</option>
              </select>
            </div>
          )}
          
          {step.module === 'noise-removal' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight block mb-2">METHOD</label>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdate(step.id, { config: { ...step.config, method: 'gaussian' }})}
                  className={`flex-1 py-2 text-sm font-bold border ${step.config.method === 'gaussian' ? 'bg-cyan-600 border-cyan-700 text-white' : 'bg-gray-50 border-gray-200 text-slate-500'}`}
                >
                  GAUSSIAN
                </button>
                <button
                  onClick={() => onUpdate(step.id, { config: { ...step.config, method: 'median' }})}
                  className={`flex-1 py-2 text-sm font-bold border ${step.config.method === 'median' ? 'bg-cyan-600 border-cyan-700 text-white' : 'bg-gray-50 border-gray-200 text-slate-500'}`}
                >
                  MEDIAN
                </button>
              </div>
            </div>
          )}
          
          {step.module === 'edge-detection' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight block mb-2">ALGORITHM</label>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdate(step.id, { config: { ...step.config, method: 'sobel' }})}
                  className={`flex-1 py-2 text-sm font-bold border ${step.config.method === 'sobel' ? 'bg-cyan-600 border-cyan-700 text-white' : 'bg-gray-50 border-gray-200 text-slate-500'}`}
                >
                  SOBEL
                </button>
                <button
                  onClick={() => onUpdate(step.id, { config: { ...step.config, method: 'canny' }})}
                  className={`flex-1 py-2 text-sm font-bold border ${step.config.method === 'canny' ? 'bg-cyan-600 border-cyan-700 text-white' : 'bg-gray-50 border-gray-200 text-slate-500'}`}
                >
                  CANNY
                </button>
              </div>
            </div>
          )}
          
          {step.module === 'segmentation' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">MIN THRESHOLD</label>
                  <span className="text-xs font-mono font-bold text-cyan-600">{step.config.min_thresh || 100}</span>
                </div>
                <input
                  type="range" min="0" max="255"
                  value={step.config.min_thresh || 100}
                  onChange={(e) => onUpdate(step.id, { config: { ...step.config, min_thresh: parseInt(e.target.value) }})}
                  className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer accent-cyan-600"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">MAX THRESHOLD</label>
                  <span className="text-xs font-mono font-bold text-cyan-600">{step.config.max_thresh || 200}</span>
                </div>
                <input
                  type="range" min="0" max="255"
                  value={step.config.max_thresh || 200}
                  onChange={(e) => onUpdate(step.id, { config: { ...step.config, max_thresh: parseInt(e.target.value) }})}
                  className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer accent-cyan-600"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepCard;
