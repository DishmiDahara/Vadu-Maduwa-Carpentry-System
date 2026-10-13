import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  DoorOpen,
  DoorClosed,
  Boxes,
  Eye,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

// Generates procedural authentic timber textures for all 6 faces of the 3D woodwork
function createFaceTextures(woodType, finish, loadedImage = null) {
  const speciesPalettes = {
    teak: {
      base: '#B87B37',
      dark: '#7D4718',
      light: '#DCA25F',
      accent: '#5E3310',
      grainOpacity: 0.22,
      brass: '#E2B755'
    },
    mahogany: {
      base: '#6E2316',
      dark: '#451008',
      light: '#943826',
      accent: '#2F0804',
      grainOpacity: 0.18,
      brass: '#E8C16A'
    },
    jackwood: {
      base: '#C89324',
      dark: '#875C0C',
      light: '#E6B448',
      accent: '#5E3D04',
      grainOpacity: 0.25,
      brass: '#D4AF37'
    },
    satinwood: {
      base: '#D6A668',
      dark: '#9E6E32',
      light: '#EFC991',
      accent: '#6E491A',
      grainOpacity: 0.16,
      brass: '#F0D078'
    }
  };

  const pal = speciesPalettes[woodType] || speciesPalettes.teak;

  // Helper to draw realistic wood grain onto any 2D canvas
  const drawWoodGrain = (ctx, w, h, isEndGrain = false) => {
    // Base gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, pal.base);
    bgGrad.addColorStop(0.5, pal.light);
    bgGrad.addColorStop(1, pal.base);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    if (isEndGrain) {
      // Annular growth rings for end grain
      ctx.save();
      ctx.strokeStyle = pal.dark;
      ctx.globalAlpha = pal.grainOpacity * 1.5;
      ctx.lineWidth = 1.5;
      const cx = w * 0.5;
      const cy = h * 1.8;
      for (let r = 20; r < Math.max(w, h) * 2; r += 8 + (r % 6)) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    // Longitudinal timber fibers
    ctx.save();
    ctx.fillStyle = pal.dark;
    ctx.globalAlpha = pal.grainOpacity;
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * w;
      const stripeW = 2 + Math.random() * 8;
      ctx.fillRect(x, 0, stripeW, h);
    }

    // Soft grain lines
    ctx.strokeStyle = pal.accent;
    ctx.globalAlpha = pal.grainOpacity * 0.8;
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let currX = x;
      for (let y = 0; y < h; y += 40) {
        currX += (Math.random() - 0.5) * 4;
        ctx.lineTo(currX, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  // 1. FRONT FACE TEXTURE (Uses customer uploaded design or catalogue design)
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = 1024;
  frontCanvas.height = 2048;
  const fCtx = frontCanvas.getContext('2d');
  drawWoodGrain(fCtx, 1024, 2048);

  const frameBorder = 80;
  const innerW = 1024 - frameBorder * 2;
  const innerH = 2048 - frameBorder * 2;

  if (loadedImage && loadedImage.complete && loadedImage.naturalWidth > 0) {
    // RENDER CUSTOMER DESIGN / CATALOGUE IMAGE ONTO FRONT FACE
    fCtx.save();
    // Bevel frame recess shadow
    fCtx.fillStyle = 'rgba(0,0,0,0.45)';
    fCtx.fillRect(frameBorder - 10, frameBorder - 10, innerW + 20, innerH + 20);

    // Inner bevel moulding
    fCtx.strokeStyle = pal.dark;
    fCtx.lineWidth = 8;
    fCtx.strokeRect(frameBorder - 4, frameBorder - 4, innerW + 8, innerH + 8);

    // Clip to inner panel area
    fCtx.beginPath();
    fCtx.rect(frameBorder, frameBorder, innerW, innerH);
    fCtx.clip();

    // Center-crop / fit image preserving aspect ratio
    const imgRatio = loadedImage.naturalWidth / loadedImage.naturalHeight;
    const boxRatio = innerW / innerH;
    let sx = 0, sy = 0, sw = loadedImage.naturalWidth, sh = loadedImage.naturalHeight;

    if (imgRatio > boxRatio) {
      sw = loadedImage.naturalHeight * boxRatio;
      sx = (loadedImage.naturalWidth - sw) / 2;
    } else {
      sh = loadedImage.naturalWidth / boxRatio;
      sy = (loadedImage.naturalHeight - sh) / 2;
    }

    fCtx.drawImage(loadedImage, sx, sy, sw, sh, frameBorder, frameBorder, innerW, innerH);

    // Overlay authentic timber species tint onto design (Teak, Mahogany, Jackwood, Satinwood)
    fCtx.globalCompositeOperation = 'multiply';
    fCtx.fillStyle = pal.base;
    fCtx.globalAlpha = 0.28;
    fCtx.fillRect(frameBorder, frameBorder, innerW, innerH);

    // Soft grain blend overlay
    fCtx.globalCompositeOperation = 'source-over';
    fCtx.fillStyle = pal.dark;
    fCtx.globalAlpha = 0.08;
    for (let i = 0; i < 40; i++) {
      const rx = frameBorder + Math.random() * innerW;
      fCtx.fillRect(rx, frameBorder, 2 + Math.random() * 4, innerH);
    }
    fCtx.restore();

    // Architectural inner highlight border
    fCtx.save();
    fCtx.strokeStyle = 'rgba(255,255,255,0.28)';
    fCtx.lineWidth = 4;
    fCtx.strokeRect(frameBorder + 2, frameBorder + 2, innerW - 4, innerH - 4);
    fCtx.restore();
  } else {
    // FALLBACK PROCEDURAL CARVED WOODWORK IF NO IMAGE IS READY
    fCtx.save();
    fCtx.strokeStyle = 'rgba(0,0,0,0.45)';
    fCtx.lineWidth = 12;
    fCtx.strokeRect(frameBorder, frameBorder, innerW, innerH);

    const drawRaisedPanel = (x, y, pw, ph, isArch = false) => {
      fCtx.save();
      fCtx.fillStyle = 'rgba(0,0,0,0.35)';
      fCtx.fillRect(x - 14, y - 14, pw + 28, ph + 28);
      const fieldGrad = fCtx.createLinearGradient(x, y, x, y + ph);
      fieldGrad.addColorStop(0, pal.light);
      fieldGrad.addColorStop(0.5, pal.base);
      fieldGrad.addColorStop(1, pal.dark);
      fCtx.fillStyle = fieldGrad;
      fCtx.fillRect(x, y, pw, ph);

      fCtx.strokeStyle = 'rgba(255,255,255,0.3)';
      fCtx.lineWidth = 4;
      fCtx.strokeRect(x + 12, y + 12, pw - 24, ph - 24);

      if (isArch) {
        fCtx.strokeStyle = pal.accent;
        fCtx.lineWidth = 6;
        fCtx.beginPath();
        fCtx.arc(x + pw / 2, y + 120, pw * 0.38, Math.PI, 0);
        fCtx.stroke();
      }
      fCtx.restore();
    };

    drawRaisedPanel(150, 160, 330, 720, true);
    drawRaisedPanel(544, 160, 330, 720, true);

    // Center lotus motif
    fCtx.save();
    fCtx.fillStyle = pal.dark;
    fCtx.beginPath();
    fCtx.arc(512, 1024, 75, 0, Math.PI * 2);
    fCtx.fill();
    fCtx.restore();

    drawRaisedPanel(150, 1140, 330, 740, false);
    drawRaisedPanel(544, 1140, 330, 740, false);
    fCtx.restore();
  }

  // Brass keyhole escutcheon plate on front face
  fCtx.save();
  fCtx.fillStyle = pal.brass;
  fCtx.shadowColor = 'rgba(0,0,0,0.6)';
  fCtx.shadowBlur = 12;
  fCtx.fillRect(820, 960, 48, 130);
  fCtx.fillStyle = '#111';
  fCtx.beginPath();
  fCtx.arc(844, 1000, 8, 0, Math.PI * 2);
  fCtx.rect(841, 1000, 6, 22);
  fCtx.fill();
  fCtx.restore();

  // 2. BACK FACE TEXTURE (Interior Solid Wood Framing & Workshop Heritage Stamp)
  const backCanvas = document.createElement('canvas');
  backCanvas.width = 1024;
  backCanvas.height = 2048;
  const bCtx = backCanvas.getContext('2d');
  drawWoodGrain(bCtx, 1024, 2048);

  bCtx.save();
  bCtx.strokeStyle = 'rgba(0,0,0,0.35)';
  bCtx.lineWidth = 10;
  bCtx.strokeRect(120, 140, 784, 1768);

  const drawBackPanel = (x, y, pw, ph) => {
    bCtx.save();
    bCtx.fillStyle = 'rgba(0,0,0,0.2)';
    bCtx.fillRect(x, y, pw, ph);
    bCtx.strokeStyle = 'rgba(255,255,255,0.18)';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(x + 8, y + 8, pw - 16, ph - 16);
    bCtx.restore();
  };

  drawBackPanel(160, 180, 320, 780);
  drawBackPanel(544, 180, 320, 780);
  drawBackPanel(160, 1080, 320, 780);
  drawBackPanel(544, 1080, 320, 780);

  // Workshop heritage burn stamp in center
  bCtx.save();
  bCtx.fillStyle = pal.dark;
  bCtx.font = 'bold 28px sans-serif';
  bCtx.textAlign = 'center';
  bCtx.fillText('වඩු මඩුව • MASTER CARPENTRY', 512, 1000);
  bCtx.font = 'bold 18px monospace';
  bCtx.fillStyle = pal.accent;
  bCtx.fillText('100% SEASONED SOLID TIMBER', 512, 1035);
  bCtx.font = '16px monospace';
  bCtx.fillText('KALUTARA WORKSHOP HERITAGE', 512, 1065);
  bCtx.fillText('LIFETIME STRUCTURAL WARRANTY', 512, 1090);
  bCtx.restore();

  // Interior brass handle plate
  bCtx.save();
  bCtx.fillStyle = pal.brass;
  bCtx.shadowColor = 'rgba(0,0,0,0.6)';
  bCtx.shadowBlur = 10;
  bCtx.fillRect(160, 960, 48, 130);
  bCtx.fillStyle = '#111';
  bCtx.beginPath();
  bCtx.arc(184, 1000, 8, 0, Math.PI * 2);
  bCtx.fill();
  bCtx.restore();

  bCtx.restore();

  // 3. RIGHT SIDE (Lock Edge, 90°)
  const lockCanvas = document.createElement('canvas');
  lockCanvas.width = 256;
  lockCanvas.height = 2048;
  const lCtx = lockCanvas.getContext('2d');
  drawWoodGrain(lCtx, 256, 2048);

  // Brass Mortise Lock Faceplate
  lCtx.save();
  const plateY = 880;
  const plateH = 280;
  lCtx.fillStyle = pal.brass;
  lCtx.shadowColor = 'rgba(0,0,0,0.7)';
  lCtx.shadowBlur = 12;
  lCtx.fillRect(58, plateY, 140, plateH);

  // Screws on faceplate
  lCtx.fillStyle = '#654321';
  lCtx.beginPath();
  lCtx.arc(128, plateY + 25, 6, 0, Math.PI * 2);
  lCtx.arc(128, plateY + plateH - 25, 6, 0, Math.PI * 2);
  lCtx.fill();

  // Bevelled brass latch bolt
  lCtx.fillStyle = '#C4972A';
  lCtx.fillRect(80, plateY + 65, 96, 45);

  // Rectangular deadbolt
  lCtx.fillStyle = '#9E781A';
  lCtx.fillRect(75, plateY + 160, 106, 55);
  lCtx.restore();

  // 4. LEFT SIDE (Hinge Edge, 270°)
  const hingeCanvas = document.createElement('canvas');
  hingeCanvas.width = 256;
  hingeCanvas.height = 2048;
  const hCtx = hingeCanvas.getContext('2d');
  drawWoodGrain(hCtx, 256, 2048);

  // Three Brass Butt Hinges
  const drawHinge = (hy) => {
    hCtx.save();
    hCtx.fillStyle = pal.brass;
    hCtx.shadowColor = 'rgba(0,0,0,0.7)';
    hCtx.shadowBlur = 10;
    hCtx.fillRect(48, hy, 160, 160);

    hCtx.fillStyle = '#B38B22';
    hCtx.fillRect(40, hy - 8, 26, 176);

    hCtx.fillStyle = '#5A3816';
    hCtx.beginPath();
    hCtx.arc(95, hy + 35, 6, 0, Math.PI * 2);
    hCtx.arc(160, hy + 35, 6, 0, Math.PI * 2);
    hCtx.arc(95, hy + 125, 6, 0, Math.PI * 2);
    hCtx.arc(160, hy + 125, 6, 0, Math.PI * 2);
    hCtx.fill();
    hCtx.restore();
  };

  drawHinge(240); // Top hinge
  drawHinge(944); // Middle hinge
  drawHinge(1648); // Bottom hinge

  // 5. TOP & BOTTOM (End Grain)
  const endCanvas = document.createElement('canvas');
  endCanvas.width = 512;
  endCanvas.height = 256;
  const eCtx = endCanvas.getContext('2d');
  drawWoodGrain(eCtx, 512, 256, true);

  return {
    front: new THREE.CanvasTexture(frontCanvas),
    back: new THREE.CanvasTexture(backCanvas),
    lockSide: new THREE.CanvasTexture(lockCanvas),
    hingeSide: new THREE.CanvasTexture(hingeCanvas),
    endGrain: new THREE.CanvasTexture(endCanvas)
  };
}

export default function ThreeCarpentryViewer({
  woodType = 'teak',
  finish = 'natural',
  selectedWork = 'door',
  activeImage = null,
  designTitle = '',
  length = 210,
  width = 105,
  height = 4.5,
  isStudio = false,
  onOpenStudio = () => {}
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const doorGroupRef = useRef(null);
  const turntableRef = useRef(null);
  const materialsRef = useRef([]);

  // Loaded customer/catalogue image state
  const [loadedImage, setLoadedImage] = useState(null);

  // Viewer Orbit & Animation States
  const [rotationY, setRotationY] = useState(0); // Horizontal Angle (0 - 360 deg)
  const [rotationX, setRotationX] = useState(0); // Vertical Tilt (-35 to +35 deg)
  const [zoom, setZoom] = useState(1);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('front');

  // Drag tracking
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotY: 0, rotX: 0 });

  // Load active design image asynchronously for 3D texture
  useEffect(() => {
    if (!activeImage) {
      setLoadedImage(null);
      return;
    }
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!isCancelled) {
        setLoadedImage(img);
      }
    };
    img.onerror = () => {
      console.warn("Could not load texture image, using authentic grain fallback:", activeImage);
      if (!isCancelled) setLoadedImage(null);
    };
    img.src = activeImage;

    return () => {
      isCancelled = true;
    };
  }, [activeImage]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const widthPx = container.clientWidth || 600;
    const heightPx = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, widthPx / heightPx, 0.1, 100);
    camera.position.set(0, -0.15, 7.6);
    camera.lookAt(0, -0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.6);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfff5ea, 1.2);
    fillLight.position.set(0, -6, 5);
    scene.add(fillLight);

    // 5. Turntable Pedestal
    const turntableGroup = new THREE.Group();
    turntableRef.current = turntableGroup;
    scene.add(turntableGroup);

    // Walnut circular wood turntable
    const cylinderGeo = new THREE.CylinderGeometry(2.3, 2.4, 0.18, 64);
    const cylinderMat = new THREE.MeshStandardMaterial({
      color: 0x221309,
      roughness: 0.45,
      metalness: 0.1
    });
    const turntableMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    turntableMesh.position.y = -2.55;
    turntableMesh.receiveShadow = true;
    turntableGroup.add(turntableMesh);

    // Inlaid Brass Ring on Turntable
    const brassRingGeo = new THREE.TorusGeometry(2.15, 0.035, 16, 64);
    const brassRingMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.25,
      metalness: 0.85
    });
    const brassRing = new THREE.Mesh(brassRingGeo, brassRingMat);
    brassRing.rotation.x = Math.PI / 2;
    brassRing.position.y = -2.45;
    turntableGroup.add(brassRing);

    // 6. Volumetric 3D Carpentry Door Assembly with Real Left-Edge Hinge Pivot
    const doorHingePivot = new THREE.Group();
    doorHingePivot.position.set(-1.05, 0, 0); // Left hinge axis
    doorGroupRef.current = doorHingePivot;
    turntableGroup.add(doorHingePivot);

    // Proportions: Width ~2.1, Height ~4.2, Thickness ~0.22
    const doorGeo = new THREE.BoxGeometry(2.1, 4.2, 0.22);

    // Generate Face Textures
    const textures = createFaceTextures(woodType, finish, loadedImage);
    const roughnessVal = finish === 'gloss' ? 0.22 : finish === 'matte' ? 0.75 : 0.45;

    // Six distinct physical faces:
    // [0: Right (Lock Edge), 1: Left (Hinge Edge), 2: Top, 3: Bottom, 4: Front, 5: Back]
    const materials = [
      new THREE.MeshStandardMaterial({ map: textures.lockSide, roughness: roughnessVal }), // 0: Right (Lock)
      new THREE.MeshStandardMaterial({ map: textures.hingeSide, roughness: roughnessVal }), // 1: Left (Hinge)
      new THREE.MeshStandardMaterial({ map: textures.endGrain, roughness: roughnessVal }),  // 2: Top
      new THREE.MeshStandardMaterial({ map: textures.endGrain, roughness: roughnessVal }),  // 3: Bottom
      new THREE.MeshStandardMaterial({ map: textures.front, roughness: roughnessVal }),     // 4: Front
      new THREE.MeshStandardMaterial({ map: textures.back, roughness: roughnessVal })       // 5: Back
    ];
    materialsRef.current = materials;

    const doorMesh = new THREE.Mesh(doorGeo, materials);
    doorMesh.castShadow = true;
    doorMesh.receiveShadow = true;
    doorMesh.position.set(1.05, -0.35, 0); // Centered relative to world (0, 0, 0)
    doorHingePivot.add(doorMesh);

    // 7. Add 3D Brass Lever Handles (Front & Back)
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.2,
      metalness: 0.9
    });

    const create3DHandle = (isBack = false) => {
      const hGroup = new THREE.Group();
      // Backplate
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.03), handleMat);
      hGroup.add(plate);

      // Lever post
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 16), handleMat);
      post.rotation.x = Math.PI / 2;
      post.position.set(0, 0.08, 0.04);
      hGroup.add(post);

      // Lever bar
      const lever = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.03), handleMat);
      lever.position.set(isBack ? -0.14 : 0.14, 0.08, 0.08);
      hGroup.add(lever);

      return hGroup;
    };

    // Front Handle
    const frontHandle = create3DHandle(false);
    frontHandle.position.set(1.05 + 0.72, -0.35, 0.125);
    doorHingePivot.add(frontHandle);

    // Back Handle
    const backHandle = create3DHandle(true);
    backHandle.position.set(1.05 + 0.72, -0.35, -0.125);
    backHandle.rotation.y = Math.PI;
    doorHingePivot.add(backHandle);

    // Resize Handler with ResizeObserver
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw > 0 && nh > 0) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = null;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      camera.lookAt(0, -0.4, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      doorGeo.dispose();
      materials.forEach(m => m.dispose());
      container.innerHTML = '';
    };
  }, []);

  // Update Textures when woodType, finish, or loadedImage changes
  useEffect(() => {
    if (!materialsRef.current || materialsRef.current.length === 0) return;
    const textures = createFaceTextures(woodType, finish, loadedImage);
    const roughnessVal = finish === 'gloss' ? 0.22 : finish === 'matte' ? 0.75 : 0.45;

    materialsRef.current[0].map = textures.lockSide;
    materialsRef.current[1].map = textures.hingeSide;
    materialsRef.current[2].map = textures.endGrain;
    materialsRef.current[3].map = textures.endGrain;
    materialsRef.current[4].map = textures.front;
    materialsRef.current[5].map = textures.back;

    materialsRef.current.forEach(m => {
      m.roughness = roughnessVal;
      m.needsUpdate = true;
    });
  }, [woodType, finish, loadedImage]);

  // Apply Rotation (Yaw & Pitch) and Zoom to 3D Turntable Assembly
  useEffect(() => {
    if (turntableRef.current) {
      turntableRef.current.rotation.y = (rotationY * Math.PI) / 180;
      turntableRef.current.rotation.x = (rotationX * Math.PI) / 180;
    }
    if (cameraRef.current) {
      cameraRef.current.position.z = 7.6 / zoom;
      cameraRef.current.lookAt(0, -0.4, 0);
    }
  }, [rotationY, rotationX, zoom]);

  // Auto-Spin interval
  useEffect(() => {
    let timer = null;
    if (isAutoSpin) {
      timer = setInterval(() => {
        setRotationY(prev => (prev + 1) % 360);
      }, 25);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoSpin]);

  // Handle Swing Open Door (Clean rotation around left hinge axis)
  useEffect(() => {
    if (!doorGroupRef.current) return;
    if (isDoorOpen) {
      doorGroupRef.current.rotation.y = -Math.PI / 3.5; // ~50 degrees open
    } else {
      doorGroupRef.current.rotation.y = 0;
    }
  }, [isDoorOpen]);

  // Mouse & Touch 3D Orbit Drag Handlers
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.no-drag')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotY: rotationY,
      rotX: rotationX
    };
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Horizontal rotation (Yaw)
    const newY = Math.round((dragStartRef.current.rotY + deltaX * 0.75) % 360 + 360) % 360;
    // Vertical tilt (Pitch, clamped between -35 and +35 degrees)
    const newX = Math.max(-35, Math.min(35, dragStartRef.current.rotX + deltaY * 0.45));

    setRotationY(newY);
    setRotationX(newX);
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (e.currentTarget.releasePointerCapture) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
    }
  };

  // Preset Angle Switches
  const setPresetAngle = (preset, y, x = 0) => {
    setActivePreset(preset);
    setIsAutoSpin(false);
    setRotationY(y);
    setRotationX(x);
  };

  // Helper to determine currently visible face for user inspection
  const getVisibleSideInfo = (deg) => {
    const norm = ((deg % 360) + 360) % 360;
    if (norm >= 315 || norm < 45) {
      return { label: 'Front Carved Face', badge: 'bg-amber-400 text-stone-950', hint: 'Showing uploaded/catalogue design with solid timber rails' };
    }
    if (norm >= 45 && norm < 135) {
      return { label: 'Right Side (Lock Edge)', badge: 'bg-emerald-400 text-stone-950', hint: `Solid timber thickness (${height} cm) & brass mortise lock` };
    }
    if (norm >= 135 && norm < 225) {
      return { label: 'Back (Interior Profile)', badge: 'bg-blue-400 text-stone-950', hint: 'Rear solid hardwood framing & workshop heritage seal' };
    }
    return { label: 'Left Side (Hinge Edge)', badge: 'bg-purple-400 text-stone-950', hint: 'Solid timber edge with 3 heavy-duty brass butt hinges' };
  };

  const visibleSide = getVisibleSideInfo(rotationY);

  return (
    <div className={`relative w-full ${isStudio ? 'h-full' : 'h-[460px] sm:h-[520px]'} flex flex-col justify-between overflow-hidden select-none`}>
      {/* 1. 3D WebGL Canvas Container with Drag Event Handlers */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-10"
      />

      {/* 2. Top Interactive HUD & Controls */}
      <div 
        className="relative z-30 flex items-center justify-between gap-2 p-3 pointer-events-auto no-drag"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Auto-Spin Toggle Badge */}
        <button
          type="button"
          onClick={() => setIsAutoSpin(prev => !prev)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md transition-all cursor-pointer ${
            isAutoSpin
              ? 'bg-amber-400 text-stone-950 border-2 border-white ring-2 ring-amber-400/50 shadow-amber-400/40 font-black'
              : 'bg-black/75 text-amber-300 border border-white/20 hover:bg-black/90'
          }`}
          title="Click to toggle 3D Auto-Spin"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} />
          <span>{isAutoSpin ? '3D Spinning' : '3D Orbit View'}</span>
          <span className={`w-2 h-2 rounded-full ${isAutoSpin ? 'bg-emerald-400 animate-ping' : 'bg-amber-400/70'}`} />
        </button>

        {/* 6-Angle View Presets for All Sides */}
        <div 
          className="hidden sm:flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-xs"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="text-amber-300 font-mono font-bold text-[11px] mr-1">
            📐 {Math.round(rotationY)}°
          </span>

          <button
            type="button"
            onClick={() => setPresetAngle('front', 0, 0)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              rotationY === 0 && rotationX === 0 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'
            }`}
            title="Front carved face"
          >
            Front (0°)
          </button>

          <button
            type="button"
            onClick={() => setPresetAngle('lock', 90, 0)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              rotationY === 90 && rotationX === 0 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'
            }`}
            title="Right lock edge with brass mortise latch"
          >
            Lock Side (90°)
          </button>

          <button
            type="button"
            onClick={() => setPresetAngle('back', 180, 0)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              rotationY === 180 && rotationX === 0 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'
            }`}
            title="Back interior face"
          >
            Back (180°)
          </button>

          <button
            type="button"
            onClick={() => setPresetAngle('hinge', 270, 0)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              rotationY === 270 && rotationX === 0 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'
            }`}
            title="Left edge with 3 brass butt hinges"
          >
            Hinge Side (270°)
          </button>

          <button
            type="button"
            onClick={() => setPresetAngle('iso', 45, 18)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              rotationY === 45 && rotationX === 18 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'
            }`}
            title="3D Isometric perspective"
          >
            3D Tilt
          </button>
        </div>

        {/* Step Buttons & Fullscreen */}
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setIsAutoSpin(false);
              setRotationY(prev => (prev - 15 + 360) % 360);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-black/75 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-black/90 flex items-center justify-center text-xs cursor-pointer"
            title="Rotate Left (-15°)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAutoSpin(false);
              setRotationY(prev => (prev + 15) % 360);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-black/75 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-black/90 flex items-center justify-center text-xs cursor-pointer"
            title="Rotate Right (+15°)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Swing Door Open Button */}
          <button
            type="button"
            onClick={() => setIsDoorOpen(prev => !prev)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isDoorOpen
                ? 'bg-amber-500 text-stone-950 border-white'
                : 'bg-black/75 text-amber-300 border-white/20 hover:bg-black'
            }`}
            title="Swing door open on hinges"
          >
            {isDoorOpen ? <DoorOpen className="w-3.5 h-3.5" /> : <DoorClosed className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isDoorOpen ? 'Open' : 'Swing'}</span>
          </button>

          {!isStudio && (
            <button
              type="button"
              onClick={onOpenStudio}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-black/75 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-amber-400 hover:text-stone-950 transition-all cursor-pointer shadow"
              title="Open Fullscreen 3D Inspection Studio"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Real-Time Physical Timber Thickness & Active Side Callout */}
      <div className="relative z-20 self-center flex flex-col items-center gap-1 pointer-events-none select-none">
        <div className="bg-black/80 backdrop-blur-md text-white border border-white/25 px-3.5 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-2 shadow-lg">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${visibleSide.badge}`}>
            {visibleSide.label}
          </span>
          <span className="text-amber-200/90 hidden sm:inline">• {visibleSide.hint}</span>
        </div>
        <div className="text-[10px] text-amber-300/80 bg-black/60 px-2.5 py-0.5 rounded-full font-mono">
          Drag horizontally or vertically to orbit 360° • Timber Depth: {height} cm
        </div>
      </div>

      {/* 4. Bottom Controls: Quick Angle Switchers & Zoom */}
      <div 
        className="relative z-30 flex items-center justify-between gap-2 p-3 pointer-events-auto no-drag"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Quick Angle Jump Badges for Mobile */}
        <div className="flex sm:hidden items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setPresetAngle('front', 0, 0)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
              rotationY === 0 ? 'bg-amber-400 text-black' : 'bg-black/60 text-gray-300 border border-white/10'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setPresetAngle('lock', 90, 0)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
              rotationY === 90 ? 'bg-amber-400 text-black' : 'bg-black/60 text-gray-300 border border-white/10'
            }`}
          >
            Lock Side
          </button>
          <button
            type="button"
            onClick={() => setPresetAngle('back', 180, 0)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
              rotationY === 180 ? 'bg-amber-400 text-black' : 'bg-black/60 text-gray-300 border border-white/10'
            }`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setPresetAngle('hinge', 270, 0)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
              rotationY === 270 ? 'bg-amber-400 text-black' : 'bg-black/60 text-gray-300 border border-white/10'
            }`}
          >
            Hinge Side
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-amber-200/80 bg-black/60 px-3 py-1 rounded-full border border-white/15">
          <span className="font-bold text-amber-400">{designTitle || 'Custom Carpentry'}</span>
          <span>•</span>
          <span>H: {length}cm</span>
          <span>•</span>
          <span>W: {width}cm</span>
          <span>•</span>
          <span>T: {height}cm</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/75 border border-white/20 rounded-full px-2 py-1 ml-auto">
          <button
            type="button"
            onClick={() => setZoom(prev => Math.max(0.8, Number((prev - 0.2).toFixed(1))))}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 hover:text-amber-400 transition-colors text-gray-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-bold text-amber-300 w-8 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(prev => Math.min(1.8, Number((prev + 0.2).toFixed(1))))}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 hover:text-amber-400 transition-colors text-gray-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
