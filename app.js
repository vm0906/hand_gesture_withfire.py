/**
 * Hand Gesture Fire FX - Real-time AI Hand Gesture Fire FX & Fusion Engine
 * Powered by MediaPipe Hands and HTML5 Canvas API.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const videoElement = document.getElementById('webcam');
  const canvasElement = document.getElementById('output-canvas');
  const canvasCtx = canvasElement.getContext('2d');
  const startOverlay = document.getElementById('start-overlay');
  const btnStart = document.getElementById('btn-start');
  const statusBadge = document.getElementById('status-badge');
  const statusText = document.getElementById('status-text');
  const statusDot = statusBadge.querySelector('.status-dot');
  const fpsBadge = document.getElementById('fps-badge');
  const hudStats = document.getElementById('hud-stats');
  const hudHandsCount = document.getElementById('hud-hands-count');
  const hudFusionStatus = document.getElementById('hud-fusion-status');

  // Control Inputs
  const presetBtns = document.querySelectorAll('.btn-preset');
  const sliderParticleCount = document.getElementById('slider-particle-count');
  const sliderFlameSize = document.getElementById('slider-flame-size');
  const sliderFusionThreshold = document.getElementById('slider-fusion-threshold');
  const valParticleCount = document.getElementById('val-particle-count');
  const valFlameSize = document.getElementById('val-flame-size');
  const valFusionThreshold = document.getElementById('val-fusion-threshold');
  const btnToggleLandmarks = document.getElementById('btn-toggle-landmarks');
  const btnFlipCamera = document.getElementById('btn-flip-camera');
  const btnSnapshot = document.getElementById('btn-snapshot');

  // Engine Parameters
  let currentMode = 'witch'; // 'witch', 'fusion', 'cosmic', 'inferno'
  let particleDensity = 1.0;
  let flameScale = 1.0;
  let fusionThresholdPx = 160;
  let showLandmarks = false;
  let isFlipped = true;
  let isCameraActive = false;

  // Performance Tracking
  let lastFrameTime = performance.now();
  let frameCount = 0;
  let fps = 0;
  let timeMs = 0;

  // Spark Particle Storage
  let fusedSparks = [];
  const MAX_FUSED_SPARKS = 150;

  // MediaPipe Camera & Hands Instances
  let cameraInstance = null;
  let handsInstance = null;

  // Responsive Canvas Sizing
  function resizeCanvas() {
    const wrapper = document.getElementById('canvas-wrapper');
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    canvasElement.width = width;
    canvasElement.height = height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Color Palettes Definition
  const COLOR_PALETTES = {
    witch: {
      outer: 'rgba(0, 255, 136, 0.4)',
      mid: 'rgba(0, 200, 90, 0.6)',
      core: 'rgba(180, 255, 200, 0.9)',
      particles: ['#00ff88', '#00e676', '#69f0ae']
    },
    fusion: {
      outer: 'rgba(230, 45, 0, 0.5)',
      mid: 'rgba(255, 140, 0, 0.7)',
      core: 'rgba(255, 200, 0, 0.95)',
      particles: ['#ff4500', '#ff8c00', '#ffd700']
    },
    cosmic: {
      outer: 'rgba(0, 150, 255, 0.4)',
      mid: 'rgba(0, 225, 255, 0.7)',
      core: 'rgba(200, 250, 255, 0.95)',
      particles: ['#00b0ff', '#00e5ff', '#80d8ff']
    },
    inferno: {
      outer: 'rgba(180, 0, 80, 0.5)',
      mid: 'rgba(255, 42, 95, 0.7)',
      core: 'rgba(255, 150, 200, 0.95)',
      particles: ['#ff2a5f', '#ff5252', '#ff80ab']
    }
  };

  // --- WITCH GREEN FIRE PARTICLES ENGINE ---
  let witchParticles = [];
  function renderWitchFireParticles(ctx, handLandmarksList, width, height) {
    // Generate new upward rising particles at landmark nodes
    if (handLandmarksList) {
      handLandmarksList.forEach((landmarks) => {
        landmarks.forEach((pt) => {
          if (Math.random() < 0.35 * particleDensity) {
            const hx = (isFlipped ? (1 - pt.x) : pt.x) * width;
            const hy = pt.y * height;
            witchParticles.push({
              x: hx + (Math.random() * 24 - 12),
              y: hy - (Math.random() * 10),
              vx: (Math.random() * 2 - 1),
              vy: -(Math.random() * 3 + 1.5),
              radius: Math.random() * 4 + 2,
              life: 1.0,
              decay: Math.random() * 0.04 + 0.02,
              color: COLOR_PALETTES[currentMode].particles[Math.floor(Math.random() * 3)]
            });
          }
        });
      });
    }

    // Render & update active particles
    const active = [];
    witchParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life > 0 && p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height) {
        active.push(p);
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * flameScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    witchParticles = active;
  }

  // --- WAVY FLAMING ORB ENGINE ---
  function drawFlamingOrb(ctx, cx, cy, radius, isFused = false) {
    if (radius <= 0) return;

    const pal = COLOR_PALETTES[currentMode];
    const layers = isFused ? [
      { r: radius, color: pal.outer, waveAmp: 0.25 },
      { r: radius * 0.7, color: pal.mid, waveAmp: 0.18 },
      { r: radius * 0.4, color: pal.core, waveAmp: 0.10 }
    ] : [
      { r: radius, color: pal.outer, waveAmp: 0.22 },
      { r: radius * 0.7, color: pal.mid, waveAmp: 0.15 },
      { r: radius * 0.35, color: pal.core, waveAmp: 0.08 }
    ];

    const timePhase = timeMs / 100.0;

    layers.forEach((layer) => {
      const r = layer.r * flameScale;
      if (r <= 0) return;

      ctx.save();
      ctx.fillStyle = layer.color;
      ctx.shadowColor = layer.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();

      let firstPt = true;
      for (let angleDeg = 0; angleDeg < 360; angleDeg += 12) {
        const angleRad = (angleDeg * Math.PI) / 180;
        const wave1 = Math.sin(angleRad * 3 + timePhase);
        const wave2 = Math.cos(angleRad * 7 - timePhase * 1.5);
        const combinedWave = wave1 * 0.6 + wave2 * 0.4;
        const upwardBias = 1.0 - Math.sin(angleRad);
        const dynamicR = r + combinedWave * (r * layer.waveAmp) * (upwardBias * 0.8) + (Math.random() * 4 - 2);

        const x = cx + dynamicR * Math.cos(angleRad);
        const y = cy + dynamicR * Math.sin(angleRad) - r * 0.15 * upwardBias;

        if (firstPt) {
          ctx.moveTo(x, y);
          firstPt = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  // --- 360-DEGREE RADIAL SPARK ENGINE (NO GRAVITY) ---
  function renderRadialSparks(ctx, fusedCx, fusedCy, width, height) {
    if (fusedSparks.length < MAX_FUSED_SPARKS * particleDensity) {
      for (let i = 0; i < Math.floor(5 * particleDensity); i++) {
        const launchAngle = Math.random() * Math.PI * 2;
        const launchSpeed = Math.random() * 5 + 3.5;
        fusedSparks.push({
          x: fusedCx,
          y: fusedCy,
          vx: launchSpeed * Math.cos(launchAngle),
          vy: launchSpeed * Math.sin(launchAngle),
          life: 1.0,
          decay: Math.random() * 0.03 + 0.025,
          thickness: Math.floor(Math.random() * 2) + 1.5
        });
      }
    }

    const activeSparks = [];
    fusedSparks.forEach((s) => {
      const oldX = s.x;
      const oldY = s.y;

      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life > 0 && s.x >= 0 && s.x <= width && s.y >= 0 && s.y <= height) {
        activeSparks.push(s);

        const sparkColor = s.life > 0.5
          ? COLOR_PALETTES[currentMode].particles[1]
          : COLOR_PALETTES[currentMode].particles[0];

        ctx.save();
        ctx.globalAlpha = s.life;
        ctx.strokeStyle = sparkColor;
        ctx.shadowColor = sparkColor;
        ctx.shadowBlur = 8;
        ctx.lineWidth = s.thickness;
        ctx.beginPath();
        ctx.moveTo(oldX, oldY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.restore();
      }
    });
    fusedSparks = activeSparks;
  }

  // --- MAIN MEDIAPIPE RESULTS HANDLER ---
  function onResults(results) {
    // FPS Calculation
    const now = performance.now();
    frameCount++;
    if (now - lastFrameTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
      fpsBadge.textContent = `${fps} FPS`;
      frameCount = 0;
      lastFrameTime = now;
    }
    timeMs += 33;

    const width = canvasElement.width;
    const height = canvasElement.height;

    // Clear canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, width, height);

    // Draw video background
    if (results.image) {
      canvasCtx.save();
      if (isFlipped) {
        canvasCtx.translate(width, 0);
        canvasCtx.scale(-1, 1);
      }
      canvasCtx.drawImage(results.image, 0, 0, width, height);
      canvasCtx.restore();
    }

    // Process Hand Landmarks
    const handCount = results.multiHandLandmarks ? results.multiHandLandmarks.length : 0;
    hudHandsCount.textContent = handCount;

    const activeHands = [];

    if (results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((landmarks, idx) => {
        // Hand Skeleton Landmark Overlay Option
        if (showLandmarks) {
          canvasCtx.save();
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00ff88', lineWidth: 2 });
          drawLandmarks(canvasCtx, landmarks, { color: '#ff6b00', lineWidth: 1, radius: 3 });
          canvasCtx.restore();
        }

        // Calculate Palm Center (wrist[0], index_base[5], pinky_base[17])
        const wrist = landmarks[0];
        const indexBase = landmarks[5];
        const pinkyBase = landmarks[17];

        const rawPalmX = (wrist.x + indexBase.x + pinkyBase.x) / 3;
        const rawPalmY = (wrist.y + indexBase.y + pinkyBase.y) / 3;

        const palmX = (isFlipped ? (1 - rawPalmX) : rawPalmX) * width;
        const palmY = rawPalmY * height - 40;

        const handSize = Math.hypot(
          (indexBase.x - pinkyBase.x) * width,
          (indexBase.y - pinkyBase.y) * height
        );
        const radius = Math.max(35, Math.floor(handSize * 1.25));

        activeHands.push({ cx: palmX, cy: palmY, radius: radius, landmarks: landmarks });
      });
    }

    // --- DUAL HAND FUSION CHECK ---
    let handsAreFused = false;
    let fusedCx = 0;
    let fusedCy = 0;
    let fusedRadius = 0;

    if (activeHands.length >= 2) {
      const h1 = activeHands[0];
      const h2 = activeHands[1];
      const dist = Math.hypot(h1.cx - h2.cx, h1.cy - h2.cy);

      if (dist < fusionThresholdPx) {
        handsAreFused = true;
        fusedCx = Math.floor((h1.cx + h2.cx) / 2);
        fusedCy = Math.floor((h1.cy + h2.cy) / 2);
        fusedRadius = Math.floor((h1.radius + h2.radius) * 1.15);
      }
    }

    // Update HUD Fusion Status
    if (handsAreFused) {
      hudFusionStatus.textContent = 'FUSED 🔥';
      hudFusionStatus.className = 'hud-val fusion-on';
    } else {
      hudFusionStatus.textContent = 'INACTIVE';
      hudFusionStatus.className = 'hud-val fusion-off';
    }

    // Render Mode Visual Effects
    if (currentMode === 'witch') {
      renderWitchFireParticles(canvasCtx, results.multiHandLandmarks, width, height);
      activeHands.forEach((h) => {
        drawFlamingOrb(canvasCtx, h.cx, h.cy, h.radius * 0.7, false);
      });
    } else {
      if (handsAreFused) {
        drawFlamingOrb(canvasCtx, fusedCx, fusedCy, fusedRadius, true);
        renderRadialSparks(canvasCtx, fusedCx, fusedCy, width, height);
      } else {
        activeHands.forEach((h) => {
          drawFlamingOrb(canvasCtx, h.cx, h.cy, h.radius, false);
        });
      }
    }

    canvasCtx.restore();
  }

  // --- INITIALIZE MEDIAPIPE HANDS ENGINE ---
  function initMediaPipe() {
    handsInstance = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    handsInstance.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.55,
      minTrackingConfidence: 0.55
    });

    handsInstance.onResults(onResults);

    cameraInstance = new Camera(videoElement, {
      onFrame: async () => {
        if (isCameraActive) {
          await handsInstance.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720
    });
  }

  // --- START CAMERA BUTTON ---
  btnStart.addEventListener('click', async () => {
    try {
      btnStart.disabled = true;
      btnStart.querySelector('span').textContent = '⌛ Starting Engine...';

      if (!handsInstance) {
        initMediaPipe();
      }

      await cameraInstance.start();
      isCameraActive = true;

      startOverlay.classList.add('hidden');
      hudStats.classList.remove('hidden');

      statusText.textContent = 'Engine Active';
      statusDot.className = 'status-dot green pulse';
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Camera access failed. Please ensure webcam permissions are allowed.');
      btnStart.disabled = false;
      btnStart.querySelector('span').textContent = '🚀 Launch Camera Engine';
    }
  });

  // --- UI CONTROLS HANDLERS ---
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
    });
  });

  sliderParticleCount.addEventListener('input', (e) => {
    particleDensity = parseFloat(e.target.value) / 100.0;
    valParticleCount.textContent = `${e.target.value}%`;
  });

  sliderFlameSize.addEventListener('input', (e) => {
    flameScale = parseFloat(e.target.value);
    valFlameSize.textContent = `${flameScale.toFixed(1)}x`;
  });

  sliderFusionThreshold.addEventListener('input', (e) => {
    fusionThresholdPx = parseInt(e.target.value);
    valFusionThreshold.textContent = `${fusionThresholdPx}px`;
  });

  btnToggleLandmarks.addEventListener('click', () => {
    showLandmarks = !showLandmarks;
    btnToggleLandmarks.querySelector('span').textContent = showLandmarks
      ? '🖐️ Landmarks: ON'
      : '🖐️ Landmarks: OFF';
  });

  btnFlipCamera.addEventListener('click', () => {
    isFlipped = !isFlipped;
  });

  // Photo Snapshot Download
  btnSnapshot.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `hand-fire-fx-${Date.now()}.png`;
    link.href = canvasElement.toDataURL('image/png');
    link.click();
  });
});
