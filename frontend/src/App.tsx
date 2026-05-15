import { useState } from "react";
import Header from "./components/layout/Header";
import UploadCard from "./components/processing/UploadCard";
import ProcessingModules from "./components/processing/ProcessingModules";
import AnalysisReport from "./components/processing/AnalysisReport";
import ImageViewer from "./components/viewer/ImageViewer";
import { useImageProcessing } from "./hooks/useImageProcessing";
import type { ProcessingTab } from "./types";

function App() {
  const [activeTab, setActiveTab] = useState<ProcessingTab>("windowing");

  // Parameters
  const [windowPreset, setWindowPreset] = useState<string>("soft_tissue");
  const [noiseMethod, setNoiseMethod] = useState<string>("gaussian");
  const [edgeMethod, setEdgeMethod] = useState<string>("sobel");
  const [segMin, setSegMin] = useState<number>(100);
  const [segMax, setSegMax] = useState<number>(200);

  const {
    originalImage,
    processedImage,
    loading,
    roiData,
    handleFileUpload,
    processImage,
    resetImage,
  } = useImageProcessing();

  const handleApply = () => {
    switch (activeTab) {
      case "windowing":
        processImage("windowing", { preset: windowPreset });
        break;
      case "noise":
        processImage("noise-removal", { method: noiseMethod });
        break;
      case "edge":
        processImage("edge-detection", { method: edgeMethod });
        break;
      case "segmentation":
        processImage("segmentation", {
          min_thresh: segMin,
          max_thresh: segMax,
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-slate-800 font-sans selection:bg-cyan-500/30">
      <Header originalImage={originalImage} onReset={resetImage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-6">
            <UploadCard onFileUpload={handleFileUpload} />

            <ProcessingModules
              originalImage={originalImage}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              windowPreset={windowPreset}
              setWindowPreset={setWindowPreset}
              noiseMethod={noiseMethod}
              setNoiseMethod={setNoiseMethod}
              edgeMethod={edgeMethod}
              setEdgeMethod={setEdgeMethod}
              segMin={segMin}
              setSegMin={setSegMin}
              segMax={segMax}
              setSegMax={setSegMax}
              loading={loading}
              onApply={handleApply}
            />

            <AnalysisReport roiData={roiData} />
          </div>

          {/* Right Area - Canvas View */}
          <div className="lg:col-span-8 space-y-6">
            <ImageViewer
              originalImage={originalImage}
              processedImage={processedImage}
              activeTab={activeTab}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
