import { Activity, RefreshCw } from 'lucide-react';
import { usePipelineProcessing } from '../../hooks/usePipelineProcessing';
import UploadCard from '../processing/UploadCard';
import ImageViewer from '../viewer/ImageViewer';
import AnalysisReport from '../processing/AnalysisReport';
import PresetSelector from './PresetSelector';
import StepList from './StepList';
import { Toaster } from 'react-hot-toast';

const PipelinePage = () => {
  const {
    steps,
    setSteps,
    originalImage,
    processedImage,
    loading,
    roiData,
    loadPreset,
    handleFileUpload,
    runPipeline,
  } = usePipelineProcessing();

  return (
    <>
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Config & Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          <UploadCard onFileUpload={handleFileUpload} />

          <div className={`transition-opacity duration-300 ${!originalImage ? "opacity-50 pointer-events-none" : ""}`}>
            <PresetSelector onSelectPreset={loadPreset} />
            <StepList steps={steps} setSteps={setSteps} />

            {/* Run Button */}
            <button
              onClick={runPipeline}
              disabled={loading || !originalImage || steps.length === 0}
              className="w-full py-4 px-6 bg-slate-900 hover:bg-black text-white text-sm font-bold uppercase tracking-[0.2em] shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Activity className="w-5 h-5" />
              )}
              {loading ? "PROCESSING..." : "RUN PIPELINE"}
            </button>
          </div>
        </div>

        {/* Right Area - Canvas & Results */}
        <div className="lg:col-span-7 space-y-6">
          <ImageViewer
            originalImage={originalImage}
            processedImage={processedImage}
            activeTab="pipeline"
            loading={loading}
          />
          
          {roiData && (
            <AnalysisReport roiData={roiData} />
          )}
        </div>
      </div>
    </>
  );
};

export default PipelinePage;
