# 🔥 Hand Gesture Fire FX & Fusion Engine

![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-brightgreen)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black)
![Netlify](https://img.shields.io/badge/Deployment-Netlify-blue)
![MediaPipe](https://img.shields.io/badge/AI Engine-MediaPipe-orange)
![HTML5 Canvas](https://img.shields.io/badge/Render-HTML5%20Canvas-red)

An interactive, high-performance **AI Hand Gesture Fire Studio** featuring real-time Green Witch Fire, Dual-Hand Fusion Fireball, and 360° Radial Spark Physics powered by MediaPipe and HTML5 Canvas API.

---

## 🌟 Live Demo & Deployment

This project is configured for **1-click Instant Deployment**:

### 🚀 Deploy to GitHub Pages (Recommended)
1. Push this repository to GitHub on `main` branch.
2. Go to **Settings > Pages** in your GitHub repository.
3. Select **GitHub Actions** as the source.
4. The included `.github/workflows/deploy.yml` workflow will deploy your live web application automatically!

### ⚡ Deploy to Vercel or Netlify
- **Vercel**: Import this repository directly into Vercel. `vercel.json` is pre-configured.
- **Netlify**: Connect repository to Netlify. `netlify.toml` is pre-configured.

---

## ✨ Features

- 🧙‍♀️ **Witch Green Fire Mode** (`magic.py` engine): Rising flame particles attached to finger and palm landmarks.
- 💥 **Dual-Hand Fusion Engine** (`upgraded` engine): Proximity detection between left & right hands triggers a massive compact fusion fireball.
- ⚡ **360° Radial Spark Engine**: Pure radial vector spark emission without gravity upon hand fusion.
- 🎨 **Elemental Presets**: Switch between **Witch Green**, **Fusion Orange**, **Cosmic Cyan**, and **Dark Inferno**.
- ⚙️ **Real-Time Sliders**: Adjust particle density, flame scale, and proximity thresholds live.
- 📸 **Snapshot Generator**: Capture high-resolution PNG photos of your fire hand gestures with 1 click.

---

## 💻 Local Quickstart

### Option 1: Browser (Zero Setup)
Simply open `index.html` in Chrome, Edge, Safari, or Firefox!

Or serve locally via Python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Option 2: Python Desktop Script
Run the Python OpenCV scripts directly:
```bash
# Green Witch Fire
python magic.py

# Fusion Fireball Engine
python upgraded
```

### Option 3: Streamlit Web App
```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## 📁 Repository Structure

```
├── index.html                # Main Web App Interface
├── style.css                 # Glassmorphic UI & Dark Theme System
├── app.js                    # MediaPipe Hands Tracking & Canvas Flame Physics Engine
├── app.py                    # Streamlit Python App
├── magic.py                  # Original Green Witch Fire Python Script
├── upgraded                  # Original Dual-Hand Fusion Fireball Python Script
├── requirements.txt          # Python dependencies
├── vercel.json               # Vercel deployment config
├── netlify.toml              # Netlify deployment config
└── .github/workflows/        # Automated GitHub Pages CI/CD workflow
    └── deploy.yml
```

---

## 📜 License
MIT License. Built for fun and creative AI expression!
