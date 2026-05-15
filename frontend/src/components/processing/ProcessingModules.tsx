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
    <div
      className={`bg-slate-800/50 rounded-2xl border border-slate-700 p-6 shadow-xl transition-opacity duration-300 ${!originalImage ? "opacity-50 pointer-events-none" : ""}`}
    >
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-purple-400" /> Processing
        Modules
      </h2>

      {/* Tabs */}
      <div className="flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-700 overflow-x-auto hide-scrollbar">
        {[
          { id: "windowing", icon: LayoutGrid, label: "Windowing" },
          { id: "noise", icon: Droplet, label: "Denoise" },
          { id: "edge", icon: Layers, label: "Edges" },
          { id: "segmentation", icon: Activity, label: "ROI" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProcessingTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
              activeTab === tab.id
                ? "bg-slate-700/80 text-white shadow-sm border border-slate-600"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
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
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-medium text-slate-300">
              Contrast Preset
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "lung", label: "Lung Window" },
                { id: "bone", label: "Bone Window" },
                { id: "soft_tissue", label: "Soft Tissue Window" },
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setWindowPreset(preset.id)}
                  className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-all border ${
                    windowPreset === preset.id
                      ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-200"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800"
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
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-medium text-slate-300">
              Filter Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setNoiseMethod("gaussian")}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                  noiseMethod === "gaussian"
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-200"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                Gaussian Blur
              </button>
              <button
                onClick={() => setNoiseMethod("median")}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                  noiseMethod === "median"
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-200"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                Median Filter
              </button>
            </div>
          </div>
        )}

        {/* Edge Detection */}
        {activeTab === "edge" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-medium text-slate-300">
              Detection Algorithm
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setEdgeMethod("sobel")}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                  edgeMethod === "sobel"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                Sobel Operator
              </button>
              <button
                onClick={() => setEdgeMethod("canny")}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                  edgeMethod === "canny"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                Canny Edge
              </button>
            </div>
          </div>
        )}

        {/* Segmentation */}
        {activeTab === "segmentation" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Min Threshold
                </label>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
                  {segMin}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={segMin}
                onChange={(e) => setSegMin(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Max Threshold
                </label>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
                  {segMax}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={segMax}
                onChange={(e) => setSegMax(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onApply}
          disabled={loading || !originalImage}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Activity className="w-5 h-5" />
          )}
          {loading ? "Processing..." : "Apply Filter"}
        </button>
      </div>
    </div>
  );
};

export default ProcessingModules;
