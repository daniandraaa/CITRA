import {
  SlidersHorizontal,
  LayoutGrid,
  Droplet,
  Layers,
  Activity,
  RefreshCw,
} from "lucide-react";
import type { ProcessingTab } from "../../types";

interface ProcessingModulesProps {
  originalImage: string | null;
  activeTab: ProcessingTab;
  setActiveTab: (tab: ProcessingTab) => void;
  windowPreset: string;
  setWindowPreset: (preset: string) => void;
  noiseMethod: string;
  setNoiseMethod: (method: string) => void;
  edgeMethod: string;
  setEdgeMethod: (method: string) => void;
  segMin: number;
  setSegMin: (val: number) => void;
  segMax: number;
  setSegMax: (val: number) => void;
  loading: boolean;
  onApply: () => void;
}

const ProcessingModules = ({
  originalImage,
  activeTab,
  setActiveTab,
  windowPreset,
  setWindowPreset,
  noiseMethod,
  setNoiseMethod,
  edgeMethod,
  setEdgeMethod,
  segMin,
  setSegMin,
  segMax,
  setSegMax,
  loading,
  onApply,
}: ProcessingModulesProps) => {
  return (
    <div className={`bg-white rounded-none border border-gray-300 p-6 shadow-sm transition-opacity duration-300 ${!originalImage ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-600" /> 02. Processing
        </h2>
        <span className="text-xs text-slate-400 font-mono">MODULE: {activeTab.toUpperCase()}</span>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-none p-1 mb-6 border border-gray-200">
        {[
          { id: "windowing", icon: LayoutGrid, label: "WINDOW" },
          { id: "noise", icon: Droplet, label: "DENOISE" },
          { id: "edge", icon: Layers, label: "EDGES" },
          { id: "segmentation", icon: Activity, label: "ROI" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProcessingTab)}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-none text-xs font-black tracking-tighter transition-all flex-1 border ${
              activeTab === tab.id
                ? "bg-white text-cyan-600 shadow-sm border-gray-300"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* Windowing */}
        {activeTab === "windowing" && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">PRESET_SELECT</label>
            <div className="flex flex-col gap-1.5">
              {[
                { id: "lung", label: "LUNG_VIEW" },
                { id: "bone", label: "BONE_VIEW" },
                { id: "soft_tissue", label: "SOFT_TISSUE" },
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setWindowPreset(preset.id)}
                  className={`px-4 py-3 text-left text-sm font-bold transition-all border ${
                    windowPreset === preset.id
                      ? "bg-cyan-600 border-cyan-700 text-white"
                      : "bg-gray-50 border-gray-200 text-slate-500 hover:bg-gray-100"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Noise Removal */}
        {activeTab === "noise" && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">FILTER_ALGO</label>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => setNoiseMethod("gaussian")}
                className={`px-4 py-3 text-sm font-bold border ${
                  noiseMethod === "gaussian" ? "bg-cyan-600 border-cyan-700 text-white" : "bg-gray-50 border-gray-200 text-slate-500 hover:bg-gray-100"
                }`}
              >
                GAUSSIAN_BLUR
              </button>
              <button
                onClick={() => setNoiseMethod("median")}
                className={`px-4 py-3 text-sm font-bold border ${
                  noiseMethod === "median" ? "bg-cyan-600 border-cyan-700 text-white" : "bg-gray-50 border-gray-200 text-slate-500 hover:bg-gray-100"
                }`}
              >
                MEDIAN_FILTER
              </button>
            </div>
          </div>
        )}

        {/* Edge Detection */}
        {activeTab === "edge" && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">EDGE_ALGO</label>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => setEdgeMethod("sobel")}
                className={`px-4 py-3 text-sm font-bold border ${
                  edgeMethod === "sobel" ? "bg-cyan-600 border-cyan-700 text-white" : "bg-gray-50 border-gray-200 text-slate-500 hover:bg-gray-100"
                }`}
              >
                SOBEL_OPERATOR
              </button>
              <button
                onClick={() => setEdgeMethod("canny")}
                className={`px-4 py-3 text-sm font-bold border ${
                  edgeMethod === "canny" ? "bg-cyan-600 border-cyan-700 text-white" : "bg-gray-50 border-gray-200 text-slate-500 hover:bg-gray-100"
                }`}
              >
                CANNY_DETECTOR
              </button>
            </div>
          </div>
        )}

        {/* Segmentation */}
        {activeTab === "segmentation" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">THRESH_MIN</label>
                <span className="text-xs font-mono font-bold text-cyan-600">{segMin}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={segMin}
                onChange={(e) => setSegMin(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer accent-cyan-600"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">THRESH_MAX</label>
                <span className="text-xs font-mono font-bold text-cyan-600">{segMax}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={segMax}
                onChange={(e) => setSegMax(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer accent-cyan-600"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onApply}
          disabled={loading || !originalImage}
          className="w-full py-4 px-6 bg-slate-900 hover:bg-black text-white text-sm font-bold uppercase tracking-[0.2em] rounded-none shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Activity className="w-5 h-5" />
          )}
          {loading ? "PROCESSING..." : "EXECUTE_COMMAND"}
        </button>
      </div>
    </div>
  );
};

export default ProcessingModules;
