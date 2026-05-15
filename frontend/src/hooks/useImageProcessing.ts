import { useState } from 'react';
import axios from 'axios';
import type { ProcessingEndpoint, RoiData } from '../types';

const API_BASE = 'http://localhost:8000/api';

export const useImageProcessing = () => {
  const [imageId, setImageId] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [roiData, setRoiData] = useState<RoiData | null>(null);

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
      setProcessedImage(response.data.image);
      setRoiData(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const processImage = async (endpoint: ProcessingEndpoint, data: Record<string, string | number | boolean>) => {
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

  const resetImage = () => {
    setProcessedImage(originalImage);
    setRoiData(null);
  };

  return {
    originalImage,
    processedImage,
    loading,
    roiData,
    handleFileUpload,
    processImage,
    resetImage
  };
};
