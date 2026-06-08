import { Zap } from 'lucide-react';
import type { RecommendedPreset } from '../../types';
import { RECOMMENDED_PRESETS } from './presets';

interface PresetSelectorProps {
  onSelectPreset: (preset: RecommendedPreset) => void;
}

const PresetSelector = ({ onSelectPreset }: PresetSelectorProps) => {
  return (
    <div className="bg-white p-6 border border-gray-300 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-amber-500" />
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
          Recommended Presets
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {RECOMMENDED_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="flex flex-col text-left p-4 border border-gray-200 hover:border-cyan-600 hover:bg-cyan-50 transition-all group"
          >
            <span className="text-sm font-bold text-slate-800 group-hover:text-cyan-700">
              {preset.name}
            </span>
            <span className="text-xs text-slate-500 mt-1 mb-3">
              {preset.description}
            </span>
            <div className="flex flex-wrap gap-1 mt-auto">
              {preset.steps.map((step, idx) => (
                <span key={idx} className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-gray-100 text-slate-600 border border-gray-200">
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
