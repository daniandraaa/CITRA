import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src import manual_processing as mp
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
    result = mp.apply_windowing(img, preset)
    
    return {"image": encode_image(result)}

@app.post("/api/process/noise-removal")
async def noise_removal(image_id: str = Form(...), method: str = Form(...)):
    if image_id not in IMAGE_STORE:
        raise HTTPException(status_code=404, detail="Image not found")
        
    img = IMAGE_STORE[image_id]
    
    if method == 'gaussian':
        result = mp.apply_gaussian_blur(img, 5, 1.0)
    elif method == 'median':
        result = mp.apply_median_filter(img, 5)
    else:
        result = img
        
    return {"image": encode_image(result)}

@app.post("/api/process/edge-detection")
async def edge_detection(image_id: str = Form(...), method: str = Form(...)):
    if image_id not in IMAGE_STORE:
        raise HTTPException(status_code=404, detail="Image not found")
        
    img = IMAGE_STORE[image_id]
    
    if method == 'sobel':
        result = mp.apply_sobel(img)
    elif method == 'canny':
        result = mp.apply_canny(img, 50, 150)
    else:
        result = img
        
    return {"image": encode_image(result)}

@app.post("/api/process/segmentation")
async def segmentation(image_id: str = Form(...), min_thresh: int = Form(...), max_thresh: int = Form(...)):
    if image_id not in IMAGE_STORE:
        raise HTTPException(status_code=404, detail="Image not found")
        
    img = IMAGE_STORE[image_id]
    
    blended, area_pixels, area_percent = mp.apply_segmentation(img, min_thresh, max_thresh)
    
    return {
        "image": encode_image(blended),
        "area_pixels": int(area_pixels),
        "area_percent": round(area_percent, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
