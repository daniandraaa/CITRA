import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import base64
import os
import tempfile
import uuid

app = FastAPI(title="CITRA - CT Image Transform & Region Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for simplicity (not suitable for production)
IMAGE_STORE = {}

def encode_image(img_array):
    """Encodes a numpy image array to base64 string."""
    _, buffer = cv2.imencode('.png', img_array)
    img_b64 = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/png;base64,{img_b64}"

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File is not an image")
    
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE) # Convert to grayscale directly as it's a CT scan
    
    if img is None:
        raise HTTPException(status_code=400, detail="Could not read image")
        
    image_id = str(uuid.uuid4())
    IMAGE_STORE[image_id] = img
    
    return {
        "id": image_id,
        "image": encode_image(img),
        "message": "Image uploaded successfully"
    }

@app.post("/api/process/windowing")
async def windowing(image_id: str = Form(...), preset: str = Form(...)):
    if image_id not in IMAGE_STORE:
        raise HTTPException(status_code=404, detail="Image not found")
        
    img = IMAGE_STORE[image_id]
    
    # Simple simulation of windowing via histogram stretching/clipping on 8-bit image
    # Note: Real CT uses 16-bit Hounsfield Units, this is a simplified version for 8-bit.
    result = img.copy()
    if preset == 'lung':
        # Darker contrast
        result = cv2.convertScaleAbs(result, alpha=1.5, beta=-100)
    elif preset == 'bone':
        # High contrast
        result = cv2.convertScaleAbs(result, alpha=2.0, beta=-50)
    elif preset == 'soft_tissue':
        # Moderate contrast
        result = cv2.convertScaleAbs(result, alpha=1.2, beta=10)
    
    return {"image": encode_image(result)}

@app.post("/api/process/noise-removal")
async def noise_removal(image_id: str = Form(...), method: str = Form(...)):
    if image_id not in IMAGE_STORE:
        raise HTTPException(status_code=404, detail="Image not found")
        
    img = IMAGE_STORE[image_id]
    
    if method == 'gaussian':
        result = cv2.GaussianBlur(img, (5, 5), 0)
    elif method == 'median':
        result = cv2.medianBlur(img, 5)
    else:
        result = img
        
    return {"image": encode_image(result)}

@app.post("/api/process/edge-detection")
async def edge_detection(image_id: str = Form(...), method: str = Form(...)):
    if image_id not in IMAGE_STORE:
        raise HTTPException(status_code=404, detail="Image not found")
        
    img = IMAGE_STORE[image_id]
    
    if method == 'sobel':
        sobelx = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
        magnitude = cv2.magnitude(sobelx, sobely)
        result = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    elif method == 'canny':
        result = cv2.Canny(img, 100, 200)
    else:
        result = img
        
    return {"image": encode_image(result)}

@app.post("/api/process/segmentation")
async def segmentation(image_id: str = Form(...), min_thresh: int = Form(...), max_thresh: int = Form(...)):
    if image_id not in IMAGE_STORE:
        raise HTTPException(status_code=404, detail="Image not found")
        
    img = IMAGE_STORE[image_id]
    
    # Thresholding between min and max
    _, thresh_min = cv2.threshold(img, min_thresh, 255, cv2.THRESH_TOZERO)
    _, result = cv2.threshold(thresh_min, max_thresh, 255, cv2.THRESH_TOZERO_INV)
    
    # Convert back to binary mask for clear visualization of ROI
    _, mask = cv2.threshold(result, 1, 255, cv2.THRESH_BINARY)
    
    # Apply colormap to highlight ROI
    color_mask = cv2.applyColorMap(mask, cv2.COLORMAP_JET)
    
    # Blend with original
    img_color = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    blended = cv2.addWeighted(img_color, 0.7, color_mask, 0.3, 0)
    
    # Calculate area
    area_pixels = cv2.countNonZero(mask)
    total_pixels = img.shape[0] * img.shape[1]
    area_percent = (area_pixels / total_pixels) * 100
    
    return {
        "image": encode_image(blended),
        "area_pixels": int(area_pixels),
        "area_percent": round(area_percent, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
