import streamlit as st
import cv2
import numpy as np
import mediapipe as mp
import math
import random
import os
import urllib.request

# --- STREAMLIT PAGE CONFIG ---
st.set_page_config(
    page_title="Hand Gesture Fire FX | Streamlit Studio",
    page_icon="🔥",
    layout="wide"
)

st.title("🔥 Hand Gesture Fire FX - AI Studio")
st.markdown("Real-time AI Hand Gesture Fire & Dual-Hand Fusion Engine")

# --- SIDEBAR CONTROLS ---
st.sidebar.header("✨ Fire Parameters")
mode = st.sidebar.selectbox("Fire Mode", ["Witch Green Fire", "Dual Hand Fusion", "Cosmic Blue", "Dark Inferno"])
particle_density = st.sidebar.slider("Particle Density", 20, 200, 100) / 100.0
flame_scale = st.sidebar.slider("Flame Size Scale", 0.5, 2.0, 1.0)
fusion_threshold = st.sidebar.slider("Fusion Proximity (px)", 80, 300, 160)

# --- MODEL DOWNLOAD ---
model_filename = 'hand_landmarker.task'
if not os.path.exists(model_filename):
    with st.spinner("Downloading MediaPipe AI Model asset..."):
        url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        urllib.request.urlretrieve(url, model_filename)

st.info("💡 To run the full web app with 60 FPS performance and 0 installation, open `index.html` or deploy to GitHub Pages!")
st.markdown("### Deployment Instructions")
st.code("""
# Static Web App (GitHub Pages / Vercel / Netlify)
Open index.html in any browser!

# Streamlit Local Launcher
streamlit run app.py
""", language="bash")
