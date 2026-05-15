import { Activity } from 'lucide-react';
import type { RoiData } from '../../types';

interface AnalysisReportProps {
  roiData: RoiData | null;
}

const AnalysisReport = ({ roiData }: AnalysisReportProps) => {
  if (!roiData) return null;

  return (
    <div className="bg-white rounded-none border border-cyan-600/30 p-6 shadow-sm animate-in fade-in duration-500">
      <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4" /> 03. Telemetry_Report
      </h3>
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-gray-50 border border-gray-200 p-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">ROI_DENSITY_PX</p>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">{roiData.pixels.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 p-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">VOX_COVERAGE_PCT</p>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">{roiData.percent}%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
