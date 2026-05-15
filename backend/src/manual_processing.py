import numpy as np

def apply_windowing(img: np.ndarray, preset: str) -> np.ndarray:
    """
    I.S.: Citra grayscale (img) dan jenis preset ('lung', 'bone', 'soft_tissue') diberikan.
    F.S.: Mengembalikan citra hasil windowing (penyesuaian kontras & kecerahan) yang dihitung secara manual menggunakan operasi matriks dasar.
    """
    if preset == 'lung':
        alpha, beta = 1.5, -100
    elif preset == 'bone':
        alpha, beta = 2.0, -50
    elif preset == 'soft_tissue':
        alpha, beta = 1.2, 10
    else:
        alpha, beta = 1.0, 0
        
    # Perhitungan manual: g(x, y) = alpha * f(x, y) + beta
    result = img.astype(np.float32) * alpha + beta
    result = np.clip(result, 0, 255).astype(np.uint8)
    return result

def manual_convolve2d(image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    """
    I.S.: Citra 2D dan matriks kernel diberikan.
    F.S.: Mengembalikan hasil konvolusi 2D secara manual menggunakan manipulasi stride array NumPy (tanpa modul filter eksternal).
    """
    pad_h = kernel.shape[0] // 2
    pad_w = kernel.shape[1] // 2
    padded = np.pad(image, ((pad_h, pad_h), (pad_w, pad_w)), mode='edge').astype(np.float32)
    
    shape = image.shape + kernel.shape
    strides = padded.strides + padded.strides
    windows = np.lib.stride_tricks.as_strided(padded, shape=shape, strides=strides)
    
    # Konvolusi (dot product) per area (jendela) citra dengan kernel
    return np.sum(windows * kernel, axis=(2, 3))

def apply_gaussian_blur(img: np.ndarray, kernel_size: int = 5, sigma: float = 1.0) -> np.ndarray:
    """
    I.S.: Citra grayscale (img) diberikan.
    F.S.: Mengembalikan citra yang telah dihaluskan (blur) menggunakan perhitungan matriks Gaussian secara manual.
    """
    # 1. Membangun kernel Gaussian 2D manual
    ax = np.linspace(-(kernel_size - 1) / 2., (kernel_size - 1) / 2., kernel_size)
    xx, yy = np.meshgrid(ax, ax)
    kernel = np.exp(-0.5 * (np.square(xx) + np.square(yy)) / np.square(sigma))
    kernel = kernel / np.sum(kernel) # Normalisasi kernel
    
    # 2. Mengaplikasikan konvolusi
    result = manual_convolve2d(img, kernel)
    return np.clip(result, 0, 255).astype(np.uint8)

def apply_median_filter(img: np.ndarray, kernel_size: int = 5) -> np.ndarray:
    """
    I.S.: Citra grayscale (img) diberikan.
    F.S.: Mengembalikan citra hasil perhitungan filter Median (non-linear) dengan pendekatan windowing array.
    """
    pad = kernel_size // 2
    padded = np.pad(img, pad, mode='edge')
    
    shape = img.shape + (kernel_size, kernel_size)
    strides = padded.strides + padded.strides
    windows = np.lib.stride_tricks.as_strided(padded, shape=shape, strides=strides)
    
    # Mengambil nilai median pada setiap window secara berurutan
    result = np.median(windows, axis=(2, 3))
    return result.astype(np.uint8)

def apply_sobel(img: np.ndarray) -> np.ndarray:
    """
    I.S.: Citra grayscale diberikan.
    F.S.: Mengembalikan citra dengan batas tepi (edge) yang diperjelas menggunakan perhitungan gradien Sobel manual.
    """
    # Operator gradien X dan Y manual
    kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float32)
    ky = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float32)
    
    gx = manual_convolve2d(img, kx)
    gy = manual_convolve2d(img, ky)
    
    # Magnitudo gradien: sqrt(Gx^2 + Gy^2)
    magnitude = np.sqrt(np.square(gx) + np.square(gy))
    magnitude = (magnitude / np.max(magnitude)) * 255.0
    return magnitude.astype(np.uint8)

def apply_canny(img: np.ndarray, low_threshold: float = 50.0, high_threshold: float = 150.0) -> np.ndarray:
    """
    I.S.: Citra grayscale diberikan.
    F.S.: Mengembalikan citra biner berisi tepi objek menggunakan pendekatan Canny manual (vektorisasi Non-Maximum Suppression).
    """
    # 1. Gaussian Blur
    blurred = apply_gaussian_blur(img, kernel_size=5, sigma=1.4)
    
    # 2. Perhitungan Gradien (Sobel)
    kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float32)
    ky = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float32)
    gx = manual_convolve2d(blurred, kx)
    gy = manual_convolve2d(blurred, ky)
    
    magnitude = np.sqrt(np.square(gx) + np.square(gy))
    angle = np.arctan2(gy, gx) * 180. / np.pi
    angle[angle < 0] += 180
    
    # 3. Non-maximum Suppression secara manual (vektorisasi array)
    M, N = magnitude.shape
    nms = np.zeros((M, N), dtype=np.float32)
    
    mask_0 = ((angle >= 0) & (angle < 22.5)) | ((angle >= 157.5) & (angle <= 180))
    mask_45 = (angle >= 22.5) & (angle < 67.5)
    mask_90 = (angle >= 67.5) & (angle < 112.5)
    mask_135 = (angle >= 112.5) & (angle < 157.5)
    
    mag_pad = np.pad(magnitude, 1, mode='constant')
    C = magnitude
    
    L = mag_pad[1:M+1, 0:N]
    R = mag_pad[1:M+1, 2:N+2]
    nms[mask_0 & (C >= L) & (C >= R)] = C[mask_0 & (C >= L) & (C >= R)]
    
    TR = mag_pad[0:M, 2:N+2]
    BL = mag_pad[2:M+2, 0:N]
    nms[mask_45 & (C >= TR) & (C >= BL)] = C[mask_45 & (C >= TR) & (C >= BL)]
    
    T = mag_pad[0:M, 1:N+1]
    B = mag_pad[2:M+2, 1:N+1]
    nms[mask_90 & (C >= T) & (C >= B)] = C[mask_90 & (C >= T) & (C >= B)]
    
    TL = mag_pad[0:M, 0:N]
    BR = mag_pad[2:M+2, 2:N+2]
    nms[mask_135 & (C >= TL) & (C >= BR)] = C[mask_135 & (C >= TL) & (C >= BR)]
    
    # 4. Hysteresis Thresholding Sederhana
    res = np.zeros_like(nms, dtype=np.uint8)
    res[nms >= high_threshold] = 255
    res[(nms >= low_threshold) & (nms < high_threshold)] = 255 # Promote weak edges to strong
    
    return res

def apply_segmentation(img: np.ndarray, min_thresh: int, max_thresh: int):
    """
    I.S.: Citra grayscale dan rentang batas atas/bawah (threshold) diberikan.
    F.S.: Melakukan segmentasi (masking) ROI manual dan mengembalikan (citra_blended_BGR, pixel_area, persentase_area).
    """
    # Thresholding logika dasar NumPy
    mask = np.zeros_like(img, dtype=np.uint8)
    mask[(img >= min_thresh) & (img <= max_thresh)] = 255
    
    # Hitung area statistik
    area_pixels = np.sum(mask == 255)
    total_pixels = img.shape[0] * img.shape[1]
    area_percent = (area_pixels / total_pixels) * 100
    
    # Blend mask dengan original menjadi citra berwarna (BGR manual)
    img_color = np.stack((img, img, img), axis=-1).astype(np.float32)
    color_mask = np.zeros_like(img_color)
    color_mask[mask == 255] = [0, 0, 255] # Mask merah di BGR
    
    alpha = 0.7
    blended = img_color.copy()
    blended[mask == 255] = alpha * img_color[mask == 255] + (1 - alpha) * color_mask[mask == 255]
    
    blended = np.clip(blended, 0, 255).astype(np.uint8)
    
    return blended, area_pixels, area_percent
