# 🎨 CartoonizeMe — AI Art Studio

A full-stack Streamlit application with **10 artistic effects**, premium dark UI, and full user authentication.

## 🚀 Quick Start

```bash
# 1. Unzip and enter folder
cd cartoonize_app

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run
streamlit run app.py
# Opens at http://localhost:8501
```

## 🎨 10 Artistic Effects

| Effect | Description |
|--------|-------------|
| 🎨 Classic Cartoon | Flat colors + bold outlines. The iconic cartoon look |
| 💧 Watercolor | Soft dreamy painting via cv2.stylization |
| 🖌️ Oil Painting | Rich textured strokes with vibrant color boost |
| ✏️ Pencil Sketch | B&W hand-drawn look via cv2.pencilSketch |
| 🖍️ Pencil Color | Colored pencil with sketch texture |
| ⚡ Neon Glow | Dark cyberpunk with glowing edges |
| 🌸 Anime Style | Sharp lines + vibrant colors + outlines |
| 📷 Vintage Retro | Sepia tones + vignette |
| 👾 Pixelate | 8-bit pixel art effect |
| 💥 Comic Book | Pop-art saturated colors + thick outlines |

## 📁 Structure

```
cartoonize_app/
├── app.py                        # Entry point
├── requirements.txt
├── .streamlit/config.toml        # Dark theme config
├── database/db.py                # SQLite — Users, Transactions, ImageHistory
├── backend/
│   ├── auth.py                   # Registration, login, hashing, lockout
│   └── image_processor.py       # All 10 effects
├── frontend/
│   ├── register_page.py         # Registration UI
│   ├── login_page.py            # Login UI  
│   ├── dashboard_page.py        # User dashboard
│   ├── image_processing_page.py # Art Studio
│   └── other_pages.py           # Gallery + Profile
└── utils/styles.py              # Global CSS (glassmorphism dark theme)
```

## 🛠️ Tech Stack
Python 3.8+ · Streamlit · OpenCV-contrib · Pillow · NumPy · SQLite
