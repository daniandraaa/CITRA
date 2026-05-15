import { Activity } from 'lucide-react';
import type { RoiData } from '../../types';

interface AnalysisReportProps {
  roiData: RoiData | null;
}

const AnalysisReport = ({ roiData }: AnalysisReportProps) => {
  if (!roiData) return null;

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-emerald-500/30 p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4" /> Analysis Report
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">ROI Area (Pixels)</p>
          <p className="text-xl font-bold text-white font-mono">{roiData.pixels.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Total Coverage</p>
          <p className="text-xl font-bold text-white font-mono">{roiData.percent}%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
