# CITRA Backend

Backend for CITRA (CT Image Transform & Region Analyzer) built with FastAPI.

## Setup & Run with `uv`

This project uses [uv](https://github.com/astral-sh/uv) for fast Python package management.

### Installation

If you haven't installed `uv` yet:
```powershell
pip install uv
```

### Running the server

To run the backend server:
```powershell
uv run python src/main.py
```
Or:
```powershell
uv run uvicorn src.main:app --reload
```

The server will be available at `http://localhost:8000`.

### Adding dependencies

To add new packages:
```powershell
uv add <package_name>
```
