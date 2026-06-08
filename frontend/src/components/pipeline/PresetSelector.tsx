import { Zap } from 'lucide-react';
import type { RecommendedPreset } from '../../types';
import { RECOMMENDED_PRESETS } from './presets';

interface PresetSelectorProps {
  onSelectPreset: (preset: RecommendedPreset) => void;
}

const PresetSelector = ({ onSelectPreset }: PresetSelectorProps) => {
  return (
    <div className="bg-white p-5 border border-gray-300 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
            Recommended Presets
          </h2>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">SCROLL ➔</span>
      </div>
      
      <div className="flex overflow-x-auto gap-3 pb-3 snap-x scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {RECOMMENDED_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="min-w-[240px] flex-shrink-0 flex flex-col text-left p-4 border border-gray-200 hover:border-cyan-500 hover:bg-cyan-50 hover:shadow-md transition-all group snap-start bg-white"
          >
            <span className="text-sm font-bold text-slate-800 group-hover:text-cyan-700">
              {preset.name}
            </span>
            <span className="text-xs text-slate-500 mt-1 mb-3 line-clamp-2">
              {preset.description}
            </span>
            <div className="flex flex-wrap gap-1 mt-auto">
              {preset.steps.map((step, idx) => (
                <span key={idx} className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 group-hover:bg-cyan-100/50 text-slate-600 group-hover:text-cyan-700 border border-slate-200 group-hover:border-cyan-200 transition-colors">
                  {step.module.split('-')[0].toUpperCase()}
                  {idx < preset.steps.length - 1 && " →"}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetSelector;
