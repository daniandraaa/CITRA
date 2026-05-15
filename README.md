# CITRA

## Deskripsi Aplikasi

CITRA adalah aplikasi web untuk analisis citra CT sederhana. Pengguna bisa mengunggah gambar CT, lalu menerapkan beberapa pemrosesan citra, seperti windowing, pengurangan noise, deteksi tepi, dan segmentasi ROI.

Frontend dibangun dengan React + Vite, sedangkan backend menggunakan FastAPI, OpenCV, dan NumPy untuk memproses gambar.

## Fitur Utama

- Upload citra CT dalam format JPG atau PNG
- Windowing untuk preset lung, bone, dan soft tissue
- Noise removal dengan Gaussian Blur atau Median Filter
- Edge detection dengan Sobel atau Canny
- Segmentasi ROI dan perhitungan luas area

## Kebutuhan

- Node.js dan npm
- Python 3.10+ (disarankan)
- uv (pengganti pip yang lebih cepat)

## Cara Menjalankan Lokal

### 1. Jalankan backend

Masuk ke folder backend dan jalankan server menggunakan `uv`.

```powershell
cd backend
uv run python src/main.py
```
*(Atau `uv run uvicorn src.main:app --reload` untuk development)*

### 2. Jalankan frontend

Buka terminal baru, lalu jalankan aplikasi React/Vite.

```powershell
cd frontend
npm install
npm run dev
```

### 3. Buka aplikasi

Setelah kedua server aktif, buka alamat yang ditampilkan Vite, biasanya:

```text
http://localhost:5173
```

Frontend akan memanggil backend di:

```text
http://localhost:8000/api
```

## Catatan

- Pastikan backend berjalan sebelum mengunggah gambar dari frontend.
- Jika ingin memakai gambar selain CT, pastikan formatnya didukung oleh browser dan OpenCV.
