import { useState } from 'react';
import type { PipelineStep, RecommendedPreset, RoiData } from '../types';
import { toast } from 'react-hot-toast';

export const usePipelineProcessing = () => {
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roiData, setRoiData] = useState<RoiData | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);

  const loadPreset = (preset: RecommendedPreset) => {
    // Clone steps to ensure new IDs for dnd-kit
    const newSteps = preset.steps.map((step, idx) => ({
      ...step,
      id: `step_${Date.now()}_${idx}`
    }));
    setSteps(newSteps);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setOriginalImage(URL.createObjectURL(file));
    setProcessedImage(null);
    setRoiData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setImageId(data.id);
      setOriginalImage(data.image); // Use backend version for consistency
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const runPipeline = async () => {
    if (!imageId || steps.length === 0) return;

    setLoading(true);
    setRoiData(null);
    
    // Filter out disabled steps
    const activeSteps = steps.filter(s => s.enabled);
    
    if (activeSteps.length === 0) {
      setProcessedImage(originalImage);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/process/pipeline", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_id: imageId,
          steps: activeSteps.map(s => ({
            module: s.module,
            config: s.config
          }))
        }),
      });

      if (!response.ok) throw new Error("Pipeline processing failed");

      const data = await response.json();
      setProcessedImage(data.image);
      
      if (data.area_pixels !== undefined) {
        setRoiData({
          pixels: data.area_pixels,
          percent: data.area_percent
        });
      }
      
      toast.success("Pipeline executed successfully");
    } catch (error) {
      console.error("Error processing pipeline:", error);
      toast.error("Pipeline execution failed");
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setRoiData(null);
    setImageId(null);
  };

  return {
    steps,
    setSteps,
    originalImage,
    processedImage,
    loading,
    roiData,
    imageId,
    loadPreset,
    handleFileUpload,
    runPipeline,
    resetSession
  };
};
