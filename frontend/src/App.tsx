import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Upload, SlidersHorizontal, Activity, Droplet, LayoutGrid, Download, RefreshCw, Layers } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [imageId, setImageId] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'windowing' | 'noise' | 'edge' | 'segmentation'>('windowing');

  // Parameters
  const [windowPreset, setWindowPreset] = useState<string>('soft_tissue');
  const [noiseMethod, setNoiseMethod] = useState<string>('gaussian');
  const [edgeMethod, setEdgeMethod] = useState<string>('sobel');
  const [segMin, setSegMin] = useState<number>(100);
  const [segMax, setSegMax] = useState<number>(200);
  const [roiData, setRoiData] = useState<{ pixels: number; percent: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageId(response.data.id);
      setOriginalImage(response.data.image);
      setProcessedImage(response.data.image); // Reset processed to original
      setRoiData(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const processImage = async (endpoint: string, data: Record<string, any>) => {
    if (!imageId) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('image_id', imageId);
    Object.entries(data).forEach(([key, value]) => formData.append(key, value.toString()));

    try {
      const response = await axios.post(`${API_BASE}/process/${endpoint}`, formData);
      setProcessedImage(response.data.image);
      
      if (endpoint === 'segmentation') {
        setRoiData({
          pixels: response.data.area_pixels,
          percent: response.data.area_percent
        });
      } else {
        setRoiData(null);
      }
    } catch (error) {
      console.error(`Error processing ${endpoint}:`, error);
      alert(`Failed to process: ${endpoint}`);
    } finally {
      setLoading(false);
    }
  };

  // Triggers processing when parameters or active tab change (and we have an image)
  // Actually, we should trigger when the user clicks 'Apply' to avoid too many requests,
  // but for sliders, maybe debounced? Let's use an explicit "Apply" button or useEffect with deps.
  // For simplicity, we'll use a "Apply Process" button for heavy tasks, or direct trigger for others.
  
  const handleApply = () => {
    switch (activeTab) {
      case 'windowing':
        processImage('windowing', { preset: windowPreset });
        break;
      case 'noise':
        processImage('noise-removal', { method: noiseMethod });
        break;
      case 'edge':
        processImage('edge-detection', { method: edgeMethod });
        break;
      case 'segmentation':
        processImage('segmentation', { min_thresh: segMin, max_thresh: segMax });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              CITRA
            </h1>
            <span className="text-xs font-medium bg-slate-800 px-2 py-1 rounded-md text-slate-400 border border-slate-700 ml-2">
              CT Image Analyzer
            </span>
          </div>
          <div>
            <button 
              onClick={() => setProcessedImage(originalImage)}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              disabled={!originalImage}
            >
              <RefreshCw className="w-4 h-4" /> Reset Image
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Upload Card */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full blur-2xl"></div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" /> Data Source
              </h2>
              <div 
                className="border-2 border-dashed border-slate-600 hover:border-indigo-500 bg-slate-800/30 rounded-xl p-8 text-center cursor-pointer transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-slate-700/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-slate-300">Click to upload CT Scan</p>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG formats</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/png, image/jpeg" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Processing Modules */}
            <div className={`bg-slate-800/50 rounded-2xl border border-slate-700 p-6 shadow-xl transition-opacity duration-300 ${!originalImage ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-400" /> Processing Modules
              </h2>

              {/* Tabs */}
              <div className="flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-700 overflow-x-auto hide-scrollbar">
                {[
                  { id: 'windowing', icon: LayoutGrid, label: 'Windowing' },
                  { id: 'noise', icon: Droplet, label: 'Denoise' },
                  { id: 'edge', icon: Layers, label: 'Edges' },
                  { id: 'segmentation', icon: Activity, label: 'ROI' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                      activeTab === tab.id 
                        ? 'bg-slate-700/80 text-white shadow-sm border border-slate-600' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
                {activeTab === 'windowing' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <label className="block text-sm font-medium text-slate-300">Contrast Preset</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'lung', label: 'Lung Window' },
                        { id: 'bone', label: 'Bone Window' },
                        { id: 'soft_tissue', label: 'Soft Tissue Window' }
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setWindowPreset(preset.id)}
                          className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-all border ${
                            windowPreset === preset.id
                              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Noise Removal */}
                {activeTab === 'noise' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <label className="block text-sm font-medium text-slate-300">Filter Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setNoiseMethod('gaussian')}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                          noiseMethod === 'gaussian' ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Gaussian Blur
                      </button>
                      <button
                        onClick={() => setNoiseMethod('median')}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                          noiseMethod === 'median' ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Median Filter
                      </button>
                    </div>
                  </div>
                )}

                {/* Edge Detection */}
                {activeTab === 'edge' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <label className="block text-sm font-medium text-slate-300">Detection Algorithm</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setEdgeMethod('sobel')}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                          edgeMethod === 'sobel' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Sobel Operator
                      </button>
                      <button
                        onClick={() => setEdgeMethod('canny')}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                          edgeMethod === 'canny' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Canny Edge
                      </button>
                    </div>
                  </div>
                )}

                {/* Segmentation */}
                {activeTab === 'segmentation' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-300">Min Threshold</label>
                        <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">{segMin}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="255" 
                        value={segMin} 
                        onChange={(e) => setSegMin(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-300">Max Threshold</label>
                        <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">{segMax}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="255" 
                        value={segMax} 
                        onChange={(e) => setSegMax(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button 
                  onClick={handleApply}
                  disabled={loading || !originalImage}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Activity className="w-5 h-5" />
                  )}
                  {loading ? 'Processing...' : 'Apply Filter'}
                </button>
                
              </div>
            </div>

            {/* Analysis Report (Only shows for Segmentation) */}
            {roiData && (
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
            )}

          </div>

          {/* Right Area - Canvas View */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-800/30 rounded-3xl border border-slate-700 p-2 shadow-2xl h-[calc(100vh-10rem)] min-h-[600px] flex flex-col relative overflow-hidden backdrop-blur-sm">
              
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                <h3 className="text-sm font-medium text-slate-300">Visual Comparison</h3>
                {processedImage && (
                  <a href={processedImage} download={`citra_${activeTab}.png`} className="text-xs flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md transition-colors">
                    <Download className="w-3 h-3" /> Export
                  </a>
                )}
              </div>

              {/* Viewport */}
              <div className="flex-1 flex items-center justify-center p-6 gap-6 relative overflow-hidden">
                {!originalImage ? (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                      <LayoutGrid className="w-10 h-10 text-slate-500" />
                    </div>
                    <p className="text-slate-400 font-medium">No Image Loaded</p>
                    <p className="text-slate-500 text-sm mt-1">Upload a CT scan to start processing</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col md:flex-row gap-6">
                    
                    {/* Before */}
                    <div className="flex-1 flex flex-col gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center">Original</span>
                      <div className="flex-1 rounded-2xl border border-slate-700 bg-black overflow-hidden relative group">
                        <img src={originalImage} alt="Original CT" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    {/* After */}
                    <div className="flex-1 flex flex-col gap-2 relative">
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest text-center">Processed</span>
                      <div className={`flex-1 rounded-2xl border border-indigo-500/30 bg-black overflow-hidden relative shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all ${loading ? 'opacity-50 blur-sm' : ''}`}>
                        <img src={processedImage || originalImage} alt="Processed CT" className="w-full h-full object-contain" />
                      </div>
                      
                      {/* Loading Overlay */}
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mt-6">
                           <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
                             <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                             <span className="font-medium text-white text-sm">Processing matrix...</span>
                           </div>
                        </div>
                      )}
                    </div>
                    
                  </div>
                )}
              </div>
              
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;
