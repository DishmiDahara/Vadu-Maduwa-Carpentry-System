import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  DoorOpen,
  DoorClosed,
  Compass,
  Layers,
  Sparkles,
  Boxes,
  Upload,
  Sun
} from 'lucide-react';

// ============================================================================
// SPECIES COLOR PALETTES
// ============================================================================
const SPECIES_PALETTES = {
  teak: {
    name: 'Sri Lankan Teak',
    frameBase: '#5C3A21',
    frameDark: '#3A2210',
    frameLight: '#7A4F2E',
    backPanel: '#3D2314',
    hardware: '#1A1614',
    brass: '#D4AF37'
  },
  mahogany: {
    name: 'Red Mahogany',
    frameBase: '#542218',
    frameDark: '#33110A',
    frameLight: '#753224',
    backPanel: '#36150E',
    hardware: '#1A1614',
    brass: '#E2B755'
  },
  jackwood: {
    name: 'Golden Jackwood',
    frameBase: '#78521A',
    frameDark: '#4A300B',
    frameLight: '#996B26',
    backPanel: '#4D3310',
    hardware: '#1A1614',
    brass: '#D4AF37'
  },
  satinwood: {
    name: 'Ceylon Satinwood',
    frameBase: '#825B32',
    frameDark: '#52371B',
    frameLight: '#A37545',
    backPanel: '#54391E',
    hardware: '#1A1614',
    brass: '#F0D078'
  }
};

export const CARPENTRY_CATEGORIES = [
  { id: 'door', label: 'Wooden Door' },
  { id: 'pantry', label: 'Pantry Cupboard' },
  { id: 'kitchen_cabinet', label: 'Kitchen Cabinet' },
  { id: 'window', label: 'Window' },
  { id: 'staircase', label: 'Staircase' },
  { id: 'wardrobe', label: 'Wardrobe' },
  { id: 'bedroom_cupboard', label: 'Bedroom Cupboard' },
  { id: 'table', label: 'Table' },
  { id: 'chair', label: 'Chair' },
  { id: 'custom_furniture', label: 'Custom Furniture' }
];

export function normalizeCategoryKey(selectedWork = 'door') {
  const key = String(selectedWork).toLowerCase().trim();
  if (key.includes('pantry')) return 'pantry';
  if (key.includes('kitchen') || key.includes('cabinet')) return 'kitchen_cabinet';
  if (key.includes('window')) return 'window';
  if (key.includes('stair')) return 'staircase';
  if (key.includes('wardrobe') || key.includes('almariya')) return 'wardrobe';
  if (key.includes('bedroom') || key.includes('cupboard')) return 'bedroom_cupboard';
  if (key.includes('table') || key.includes('desk') || key.includes('dining')) return 'table';
  if (key.includes('chair') || key.includes('seat') || key.includes('bench')) return 'chair';
  if (
    key.includes('custom') ||
    key.includes('furniture') ||
    key.includes('general') ||
    key.includes('ceiling') ||
    key.includes('uluwahu')
  ) {
    return 'custom_furniture';
  }
  return 'door';
}

// ============================================================================
// WOOD-CHROMA & FOREGROUND SEGMENTATION ANALYZER
// Automatically strips out grey/white walls, concrete floors, shadows, and
// watermarks around the carpentry product in any uploaded or catalogue photo,
// isolating the exact wooden product and extracting its 3D relief & wood tones.
// ============================================================================
export function analyzeUploadedReferenceImage(img) {
  const fallback = {
    hasImage: false,
    cropBox: { x: 0, y: 0, w: 1, h: 1 },
    fgAspect: 0.5,
    frameBaseHex: null,
    frameDarkHex: null,
    frameLightHex: null,
    backPanelHex: null
  };

  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) {
    return fallback;
  }

  try {
    const sw = 128;
    const sh = 128;
    const c = document.createElement('canvas');
    c.width = sw;
    c.height = sh;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, sw, sh);
    const data = ctx.getImageData(0, 0, sw, sh).data;

    const colWoodCount = new Float32Array(sw);
    const rowWoodCount = new Float32Array(sh);
    const woodSamples = [];
    let totalWoodPixels = 0;

    // 1. Scan for warm wood chroma (separates wooden doors/furniture from grey/white walls & floors)
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const idx = (y * sw + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        if (a < 64) continue;

        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const warmth = r - b;
        const rgDiff = r - g;

        // Warm wood pixels have strong red-over-blue warmth and positive red-over-green
        if (warmth >= 28 && rgDiff >= 6 && lum > 16 && lum < 232) {
          colWoodCount[x]++;
          rowWoodCount[y]++;
          totalWoodPixels++;

          if (x > sw * 0.1 && x < sw * 0.9 && y > sh * 0.1 && y < sh * 0.9) {
            woodSamples.push({ r, g, b, lum });
          }
        }
      }
    }

    let minX = 0, maxX = sw - 1, minY = 0, maxY = sh - 1;

    if (totalWoodPixels > sw * sh * 0.06) {
      // Find peak column & row wood density
      let maxCol = 0;
      let maxRow = 0;
      for (let x = 0; x < sw; x++) if (colWoodCount[x] > maxCol) maxCol = colWoodCount[x];
      for (let y = 0; y < sh; y++) if (rowWoodCount[y] > maxRow) maxRow = rowWoodCount[y];

      const colThresh = maxCol * 0.28;
      const rowThresh = maxRow * 0.28;

      // Find longest contiguous horizontal span of wood columns (isolates door from wall)
      let bestColStart = 0, bestColEnd = sw - 1, bestColLen = 0;
      let curStart = -1;
      for (let x = 0; x < sw; x++) {
        if (colWoodCount[x] >= colThresh) {
          if (curStart === -1) curStart = x;
          const len = x - curStart + 1;
          if (len > bestColLen) {
            bestColLen = len;
            bestColStart = curStart;
            bestColEnd = x;
          }
        } else {
          curStart = -1;
        }
      }

      // Find longest contiguous vertical span of wood rows (isolates door from top wall/bottom floor)
      let bestRowStart = 0, bestRowEnd = sh - 1, bestRowLen = 0;
      curStart = -1;
      for (let y = 0; y < sh; y++) {
        if (rowWoodCount[y] >= rowThresh) {
          if (curStart === -1) curStart = y;
          const len = y - curStart + 1;
          if (len > bestRowLen) {
            bestRowLen = len;
            bestRowStart = curStart;
            bestRowEnd = y;
          }
        } else {
          curStart = -1;
        }
      }

      if (bestColLen > sw * 0.16 && bestRowLen > sh * 0.2) {
        // Inset by 1.5% so zero wall/floor edge pixels bleed onto the 3D model
        const padX = Math.max(1, Math.round(bestColLen * 0.018));
        const padY = Math.max(1, Math.round(bestRowLen * 0.018));
        minX = bestColStart + padX;
        maxX = bestColEnd - padX;
        minY = bestRowStart + padY;
        maxY = bestRowEnd - padY;
      }
    } else {
      // Fallback for painted/grey/black/white non-wood doors on a uniform studio wall
      let bgR = 0, bgG = 0, bgB = 0, cnt = 0;
      for (let y = 0; y < sh; y++) {
        for (const x of [0, 1, sw - 2, sw - 1]) {
          const idx = (y * sw + x) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
          cnt++;
        }
      }
      bgR /= cnt;
      bgG /= cnt;
      bgB /= cnt;

      let fMinX = sw, fMaxX = 0, fMinY = sh, fMaxY = 0;
      for (let y = 2; y < sh - 2; y++) {
        for (let x = 2; x < sw - 2; x++) {
          const idx = (y * sw + x) * 4;
          const dist = Math.hypot(data[idx] - bgR, data[idx + 1] - bgG, data[idx + 2] - bgB);
          if (dist > 28) {
            if (x < fMinX) fMinX = x;
            if (x > fMaxX) fMaxX = x;
            if (y < fMinY) fMinY = y;
            if (y > fMaxY) fMaxY = y;
          }
        }
      }
      if (fMaxX - fMinX > sw * 0.18 && fMaxY - fMinY > sh * 0.2) {
        minX = fMinX + 2;
        maxX = fMaxX - 2;
        minY = fMinY + 2;
        maxY = fMaxY - 2;
      }
    }

    const cropBox = {
      x: Math.max(0, minX / sw),
      y: Math.max(0, minY / sh),
      w: Math.max(0.15, Math.min(1, (maxX - minX + 1) / sw)),
      h: Math.max(0.15, Math.min(1, (maxY - minY + 1) / sh))
    };

    const fgAspect =
      (img.naturalWidth * cropBox.w) / Math.max(1, img.naturalHeight * cropBox.h);

    woodSamples.sort((a, b) => a.lum - b.lum);
    const toHex = (px) =>
      '#' +
      [px.r, px.g, px.b]
        .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
        .join('');

    let frameBaseHex = null;
    let frameDarkHex = null;
    let frameLightHex = null;
    let backPanelHex = null;

    if (woodSamples.length > 25) {
      const darkPx = woodSamples[Math.floor(woodSamples.length * 0.2)];
      const midPx = woodSamples[Math.floor(woodSamples.length * 0.5)];
      const lightPx = woodSamples[Math.floor(woodSamples.length * 0.78)];

      frameDarkHex = toHex({ r: darkPx.r * 0.78, g: darkPx.g * 0.72, b: darkPx.b * 0.66 });
      backPanelHex = toHex({ r: midPx.r * 0.7, g: midPx.g * 0.64, b: midPx.b * 0.58 });
      frameBaseHex = toHex({ r: midPx.r * 0.9, g: midPx.g * 0.84, b: midPx.b * 0.78 });
      frameLightHex = toHex({ r: lightPx.r * 1.0, g: lightPx.g * 0.94, b: lightPx.b * 0.86 });
    }

    return {
      hasImage: true,
      cropBox,
      fgAspect,
      frameBaseHex,
      frameDarkHex,
      frameLightHex,
      backPanelHex
    };
  } catch (e) {
    return fallback;
  }
}

// ============================================================================
// SKETCHFAB-GRADE 3D TEXTURE, BUMP & 3D DISPLACEMENT RELIEF GENERATOR
// ============================================================================
function createSketchfabCarpentryMaterials(
  woodType,
  finish,
  loadedImage,
  analysis,
  matchPhotoWood = true,
  anisotropy = 4
) {
  const basePal = SPECIES_PALETTES[woodType] || SPECIES_PALETTES.teak;
  const pal = { ...basePal };

  if (matchPhotoWood && analysis?.hasImage && analysis.frameBaseHex) {
    pal.frameBase = analysis.frameBaseHex;
    pal.frameDark = analysis.frameDarkHex || basePal.frameDark;
    pal.frameLight = analysis.frameLightHex || basePal.frameLight;
    pal.backPanel = analysis.backPanelHex || basePal.backPanel;
  }

  if (finish === 'walnut') {
    pal.frameBase = '#472916';
    pal.frameDark = '#291509';
    pal.frameLight = '#633B22';
    pal.backPanel = '#331C0E';
  } else if (finish === 'teak_stain') {
    pal.frameBase = '#8A5220';
    pal.frameDark = '#54300E';
    pal.frameLight = '#AD6B30';
    pal.backPanel = '#5E3614';
  }

  // Linear wood grain for outer 3D frame (Left/Right jambs, Top header, sides, steps)
  const drawLinearWoodGrain = (ctx, w, h, vertical = true, baseCol = pal.frameBase) => {
    const grad = vertical
      ? ctx.createLinearGradient(0, 0, w, 0)
      : ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, baseCol);
    grad.addColorStop(0.35, pal.frameLight);
    grad.addColorStop(0.65, baseCol);
    grad.addColorStop(1, pal.frameDark);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    const numStreaks = 150;
    for (let i = 0; i < numStreaks; i++) {
      const ratio = i / numStreaks;
      ctx.fillStyle = i % 3 === 0 ? pal.frameDark : pal.frameLight;
      ctx.globalAlpha = 0.06 + ((i * 13) % 10) * 0.012;
      const pos = ratio * (vertical ? w : h);
      const thick = 1 + ((i * 7) % 4);
      if (vertical) ctx.fillRect(pos, 0, thick, h);
      else ctx.fillRect(0, pos, w, thick);
    }
    ctx.restore();
  };

  // Smooth dark-brown wood surface for recessed 180° back (matching Sketchfab Screenshots 2 & 3)
  const drawRecessedBackSurface = (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, pal.backPanel);
    grad.addColorStop(0.5, pal.frameBase);
    grad.addColorStop(1, pal.frameDark);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.fillStyle = pal.frameDark;
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 90; i++) {
      const x = (i / 90) * w;
      ctx.fillRect(x, 0, 2, h);
    }

    const edgeGrad = ctx.createLinearGradient(0, 0, w, 0);
    edgeGrad.addColorStop(0, 'rgba(0,0,0,0.32)');
    edgeGrad.addColorStop(0.06, 'rgba(0,0,0,0)');
    edgeGrad.addColorStop(0.94, 'rgba(0,0,0,0)');
    edgeGrad.addColorStop(1, 'rgba(0,0,0,0.32)');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  };

  // Cropped front design surface + 3D relief heightmap for vertex displacement
  const drawFrontDesignSurface = (ctx, bumpCtx, w, h, sliceRect = null) => {
    drawLinearWoodGrain(ctx, w, h, h >= w, pal.frameBase);
    bumpCtx.fillStyle = '#808080';
    bumpCtx.fillRect(0, 0, w, h);

    if (loadedImage && loadedImage.complete && loadedImage.naturalWidth > 0) {
      const cb = analysis?.cropBox || { x: 0, y: 0, w: 1, h: 1 };
      const sub = sliceRect || { x: 0, y: 0, w: 1, h: 1 };

      const sx = Math.round(loadedImage.naturalWidth * (cb.x + cb.w * sub.x));
      const sy = Math.round(loadedImage.naturalHeight * (cb.y + cb.h * sub.y));
      const sw = Math.max(8, Math.round(loadedImage.naturalWidth * (cb.w * sub.w)));
      const sh = Math.max(8, Math.round(loadedImage.naturalHeight * (cb.h * sub.h)));

      ctx.save();
      ctx.drawImage(loadedImage, sx, sy, sw, sh, 0, 0, w, h);

      if (finish === 'walnut' || finish === 'teak_stain') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = pal.frameLight;
        ctx.globalAlpha = 0.22;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();

      // Inner rabbet shadow where the recessed panel meets the 3D outer frame
      ctx.save();
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = Math.max(6, Math.round(w * 0.01));
      ctx.strokeRect(0, 0, w, h);
      ctx.restore();

      // 3D Height / Relief Map for real 3D mesh displacement + bump normals
      bumpCtx.save();
      bumpCtx.filter = 'grayscale(100%) contrast(155%) blur(1px)';
      bumpCtx.drawImage(loadedImage, sx, sy, sw, sh, 0, 0, w, h);
      // Taper edges of displacement map to neutral so outer edges meet frame cleanly
      bumpCtx.strokeStyle = '#808080';
      bumpCtx.lineWidth = Math.max(16, Math.round(w * 0.035));
      bumpCtx.strokeRect(0, 0, w, h);
      bumpCtx.restore();
    } else {
      // Fallback Sketchfab modern door design (matching Screenshot 1)
      drawLinearWoodGrain(ctx, w, h, false, pal.frameBase);
      ctx.save();
      const stripW = Math.round(w * 0.72);
      ctx.fillStyle = '#EAE6DF';
      [0.25, 0.5, 0.75].forEach((ry) => {
        ctx.fillRect(0, Math.round(h * ry) - 5, stripW, 10);
      });
      const slatStartX = stripW;
      const slatAreaW = w - stripW;
      ctx.fillStyle = pal.frameDark;
      ctx.fillRect(slatStartX, 0, slatAreaW, h);
      for (let sx = slatStartX + 8; sx < w - 8; sx += 18) {
        ctx.fillStyle = pal.frameLight;
        ctx.fillRect(sx, 0, 8, h);
      }
      ctx.restore();
    }
  };

  const toTex = (canvas, isLinear = false) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = isLinear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    tex.anisotropy = anisotropy;
    tex.needsUpdate = true;
    return tex;
  };

  const vWoodCanvas = document.createElement('canvas');
  vWoodCanvas.width = 512;
  vWoodCanvas.height = 1024;
  drawLinearWoodGrain(vWoodCanvas.getContext('2d'), 512, 1024, true);

  const hWoodCanvas = document.createElement('canvas');
  hWoodCanvas.width = 1024;
  hWoodCanvas.height = 512;
  drawLinearWoodGrain(hWoodCanvas.getContext('2d'), 1024, 512, false);

  const backCanvas = document.createElement('canvas');
  backCanvas.width = 512;
  backCanvas.height = 1024;
  drawRecessedBackSurface(backCanvas.getContext('2d'), 512, 1024);

  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = 1024;
  frontCanvas.height = 1536;
  const frontBumpCanvas = document.createElement('canvas');
  frontBumpCanvas.width = 512;
  frontBumpCanvas.height = 768;
  drawFrontDesignSurface(
    frontCanvas.getContext('2d'),
    frontBumpCanvas.getContext('2d'),
    1024,
    1536
  );

  const upperFrontCanvas = document.createElement('canvas');
  upperFrontCanvas.width = 1024;
  upperFrontCanvas.height = 640;
  const upperBumpCanvas = document.createElement('canvas');
  upperBumpCanvas.width = 512;
  upperBumpCanvas.height = 320;
  drawFrontDesignSurface(
    upperFrontCanvas.getContext('2d'),
    upperBumpCanvas.getContext('2d'),
    1024,
    640,
    { x: 0, y: 0, w: 1, h: 0.46 }
  );

  const lowerFrontCanvas = document.createElement('canvas');
  lowerFrontCanvas.width = 1024;
  lowerFrontCanvas.height = 640;
  const lowerBumpCanvas = document.createElement('canvas');
  lowerBumpCanvas.width = 512;
  lowerBumpCanvas.height = 320;
  drawFrontDesignSurface(
    lowerFrontCanvas.getContext('2d'),
    lowerBumpCanvas.getContext('2d'),
    1024,
    640,
    { x: 0, y: 0.52, w: 1, h: 0.48 }
  );

  const vWoodTex = toTex(vWoodCanvas);
  const hWoodTex = toTex(hWoodCanvas);
  const backTex = toTex(backCanvas);
  const frontTex = toTex(frontCanvas);
  const frontBumpTex = toTex(frontBumpCanvas, true);
  const upperFrontTex = toTex(upperFrontCanvas);
  const lowerFrontTex = toTex(lowerFrontCanvas);

  const roughnessVal = finish === 'gloss' ? 0.2 : finish === 'matte' ? 0.65 : 0.38;
  const metalnessVal = finish === 'gloss' ? 0.06 : 0.02;

  const mats = {
    vFrame: new THREE.MeshStandardMaterial({
      map: vWoodTex,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    hFrame: new THREE.MeshStandardMaterial({
      map: hWoodTex,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    backSurface: new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: roughnessVal + 0.06,
      metalness: metalnessVal
    }),
    frontSurface: new THREE.MeshStandardMaterial({
      map: frontTex,
      bumpMap: frontBumpTex,
      bumpScale: 0.026,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    // High-density 3D vertex-displaced relief material for carved/panelled front surfaces
    frontReliefMeshMat: new THREE.MeshStandardMaterial({
      map: frontTex,
      bumpMap: frontBumpTex,
      bumpScale: 0.028,
      displacementMap: frontBumpTex,
      displacementScale: 0.045,
      displacementBias: -0.022,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    upperFrontSurface: new THREE.MeshStandardMaterial({
      map: upperFrontTex,
      bumpMap: frontBumpTex,
      bumpScale: 0.02,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    lowerFrontSurface: new THREE.MeshStandardMaterial({
      map: lowerFrontTex,
      bumpMap: frontBumpTex,
      bumpScale: 0.02,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    darkTrim: new THREE.MeshStandardMaterial({
      color: pal.frameDark,
      roughness: 0.45,
      metalness: 0.05
    }),
    hardwareBlack: new THREE.MeshStandardMaterial({
      color: 0x181512,
      roughness: 0.28,
      metalness: 0.75
    }),
    brass: new THREE.MeshStandardMaterial({
      color: pal.brass,
      roughness: 0.25,
      metalness: 0.85
    })
  };

  const disposeAll = () => {
    [
      vWoodTex,
      hWoodTex,
      backTex,
      frontTex,
      frontBumpTex,
      upperFrontTex,
      lowerFrontTex
    ].forEach((t) => t.dispose());
    Object.values(mats).forEach((m) => m.dispose());
  };

  return { mats, disposeAll };
}

// ============================================================================
// REUSABLE SKETCHFAB-STYLE 3D FRAMED CASING + 3D RELIEF SURFACE BUILDER
// ============================================================================
function createBox(w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createFramedRecessedUnit({
  totalW,
  totalH,
  frameD,
  jambW = 0.12,
  headerH = 0.12,
  bottomLegExt = 0.1,
  leafD = null,
  frontMat,
  mats,
  hasBottomRail = false,
  interactivePivotList = null,
  addVerticalPullHandle = false,
  add3DReliefMesh = true,
  numDoorSeams = 0
}) {
  const unitGroup = new THREE.Group();
  const actualLeafD = leafD || frameD * 0.5;

  // 1. Left Outer Jamb (Vertical wood grain, extends slightly at bottom like Sketchfab Screenshot 1 & 3)
  const leftJamb = createBox(jambW, totalH + bottomLegExt, frameD, mats.vFrame);
  leftJamb.position.set(-totalW / 2 + jambW / 2, -bottomLegExt / 2, 0);
  unitGroup.add(leftJamb);

  // 2. Right Outer Jamb (Vertical wood grain, extends slightly at bottom like Sketchfab Screenshot 1 & 3)
  const rightJamb = createBox(jambW, totalH + bottomLegExt, frameD, mats.vFrame);
  rightJamb.position.set(totalW / 2 - jambW / 2, -bottomLegExt / 2, 0);
  unitGroup.add(rightJamb);

  // 3. Top Header Bar (Horizontal wood grain across top face like Sketchfab Screenshot 3)
  const topHeader = createBox(totalW, headerH, frameD, [
    mats.vFrame,
    mats.vFrame,
    mats.hFrame,
    mats.hFrame,
    mats.hFrame,
    mats.hFrame
  ]);
  topHeader.position.set(0, totalH / 2 - headerH / 2, 0);
  unitGroup.add(topHeader);

  const bottomH = hasBottomRail ? headerH * 0.9 : 0;
  if (hasBottomRail) {
    const botRail = createBox(totalW - jambW * 2, bottomH, frameD * 0.94, mats.hFrame);
    botRail.position.set(0, -totalH / 2 + bottomH / 2, 0);
    unitGroup.add(botRail);
  }

  // 4. Inner Recessed Leaf / Body
  const innerW = totalW - jambW * 2;
  const innerH = totalH - headerH - bottomH;
  const innerY = (bottomH - headerH) / 2;

  const pivotGroup = new THREE.Group();
  pivotGroup.position.set(-innerW / 2, innerY, 0);
  unitGroup.add(pivotGroup);

  if (interactivePivotList) {
    interactivePivotList.push({ group: pivotGroup, openRotY: -Math.PI * 0.36 });
  }

  const leafMaterials = [
    mats.vFrame,
    mats.vFrame,
    mats.hFrame,
    mats.hFrame,
    frontMat,        // Front (0°)
    mats.backSurface // Back (180°): Smooth dark-brown wood surface (Sketchfab Screenshots 2 & 3)
  ];

  const leafMesh = createBox(innerW, innerH, actualLeafD, leafMaterials);
  leafMesh.position.set(innerW / 2, 0, 0);
  pivotGroup.add(leafMesh);

  // High-Resolution 3D Displaced Relief Mesh on the front surface (96x144 = 13,824 vertices)
  // Gives real 3D physical relief depth to all carvings, panels, and slats in the uploaded photo!
  if (add3DReliefMesh && mats.frontReliefMeshMat) {
    const reliefGeo = new THREE.PlaneGeometry(innerW - 0.02, innerH - 0.02, 84, 128);
    const reliefMesh = new THREE.Mesh(reliefGeo, mats.frontReliefMeshMat);
    reliefMesh.position.set(innerW / 2, 0, actualLeafD / 2 + 0.004);
    reliefMesh.castShadow = true;
    reliefMesh.receiveShadow = true;
    pivotGroup.add(reliefMesh);
  }

  // Vertical 3D door divider seams & handles for multi-door cupboards/wardrobes
  if (numDoorSeams > 0) {
    for (let i = 1; i <= numDoorSeams; i++) {
      const seamX = (innerW / (numDoorSeams + 1)) * i;
      const seam = createBox(0.025, innerH, actualLeafD + 0.02, mats.darkTrim);
      seam.position.set(seamX, 0, 0);
      pivotGroup.add(seam);

      const pull = createBox(0.035, Math.min(0.65, innerH * 0.28), 0.045, mats.hardwareBlack);
      pull.position.set(seamX - 0.08, 0, actualLeafD / 2 + 0.03);
      pivotGroup.add(pull);
    }
  }

  // 5. Sleek 3D Vertical Pull Handle + Lock Escutcheon (Matching Sketchfab Screenshot 1)
  if (addVerticalPullHandle) {
    const handleX = innerW - Math.min(0.22, innerW * 0.11);
    const handleY = -innerH * 0.04;
    const barH = Math.min(1.42, innerH * 0.34);

    const frontBar = createBox(0.052, barH, 0.045, mats.hardwareBlack);
    frontBar.position.set(handleX, handleY, actualLeafD / 2 + 0.055);
    pivotGroup.add(frontBar);

    [-barH * 0.36, barH * 0.36].forEach((sy) => {
      const standoff = createBox(0.04, 0.04, 0.05, mats.hardwareBlack);
      standoff.position.set(handleX, handleY + sy, actualLeafD / 2 + 0.025);
      pivotGroup.add(standoff);
    });

    const lockCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.03, 16),
      mats.hardwareBlack
    );
    lockCyl.rotation.x = Math.PI / 2;
    lockCyl.position.set(handleX + 0.075, handleY - 0.05, actualLeafD / 2 + 0.015);
    pivotGroup.add(lockCyl);

    const backBar = createBox(0.048, barH * 0.55, 0.04, mats.hardwareBlack);
    backBar.position.set(handleX, handleY, -actualLeafD / 2 - 0.03);
    pivotGroup.add(backBar);
  }

  return unitGroup;
}

// ============================================================================
// 3D GEOMETRY BUILDERS FOR ALL 10 CARPENTRY CATEGORIES
// ============================================================================
function buildSketchfabCategoryModel(categoryKey, mats, interactivePivots) {
  const root = new THREE.Group();

  // 1. WOODEN DOORS ('door') — Sketchfab Modern/Carved Door Architecture (Screenshots 1, 2, 3)
  if (categoryKey === 'door') {
    const doorModel = createFramedRecessedUnit({
      totalW: 2.32,
      totalH: 4.36,
      frameD: 0.36,
      jambW: 0.12,
      headerH: 0.13,
      bottomLegExt: 0.11,
      leafD: 0.18,
      frontMat: mats.frontSurface,
      mats,
      hasBottomRail: false,
      interactivePivotList: interactivePivots,
      addVerticalPullHandle: true,
      add3DReliefMesh: true
    });
    root.add(doorModel);
    return root;
  }

  // 2. PANTRY CUPBOARDS ('pantry')
  if (categoryKey === 'pantry') {
    const totalW = 3.5;

    const lowerUnit = createFramedRecessedUnit({
      totalW,
      totalH: 1.72,
      frameD: 1.32,
      jambW: 0.12,
      headerH: 0.1,
      bottomLegExt: 0.1,
      leafD: 1.14,
      frontMat: mats.lowerFrontSurface,
      mats,
      hasBottomRail: true,
      add3DReliefMesh: false,
      numDoorSeams: 2
    });
    lowerUnit.position.set(0, -1.25, 0);
    root.add(lowerUnit);

    const counter = createBox(totalW + 0.12, 0.1, 1.44, mats.hFrame);
    counter.position.set(0, -0.35, 0.02);
    root.add(counter);

    const backWall = createFramedRecessedUnit({
      totalW,
      totalH: 0.9,
      frameD: 0.22,
      jambW: 0.1,
      headerH: 0.06,
      bottomLegExt: 0,
      leafD: 0.12,
      frontMat: mats.hFrame,
      mats,
      hasBottomRail: false,
      add3DReliefMesh: false
    });
    backWall.position.set(0, 0.12, -0.52);
    root.add(backWall);

    const upperUnit = createFramedRecessedUnit({
      totalW,
      totalH: 1.52,
      frameD: 0.88,
      jambW: 0.12,
      headerH: 0.12,
      bottomLegExt: 0,
      leafD: 0.72,
      frontMat: mats.upperFrontSurface,
      mats,
      hasBottomRail: true,
      add3DReliefMesh: false,
      numDoorSeams: 2
    });
    upperUnit.position.set(0, 1.32, -0.22);
    root.add(upperUnit);

    return root;
  }

  // 3. KITCHEN CABINETS ('kitchen_cabinet')
  if (categoryKey === 'kitchen_cabinet') {
    const cabW = 3.45;
    const cabUnit = createFramedRecessedUnit({
      totalW: cabW,
      totalH: 2.25,
      frameD: 1.45,
      jambW: 0.13,
      headerH: 0.12,
      bottomLegExt: 0.14,
      leafD: 1.25,
      frontMat: mats.frontSurface,
      mats,
      hasBottomRail: true,
      add3DReliefMesh: true,
      numDoorSeams: 2
    });
    cabUnit.position.set(0, -0.15, 0);
    root.add(cabUnit);

    const topSlab = createBox(cabW + 0.16, 0.12, 1.58, mats.hFrame);
    topSlab.position.set(0, 1.02, 0);
    root.add(topSlab);

    return root;
  }

  // 4. WINDOWS ('window')
  if (categoryKey === 'window') {
    const winW = 3.1;
    const winH = 3.15;
    const winUnit = createFramedRecessedUnit({
      totalW: winW,
      totalH: winH,
      frameD: 0.38,
      jambW: 0.14,
      headerH: 0.14,
      bottomLegExt: 0,
      leafD: 0.18,
      frontMat: mats.frontSurface,
      mats,
      hasBottomRail: true,
      interactivePivotList: interactivePivots,
      add3DReliefMesh: true,
      numDoorSeams: 1
    });
    root.add(winUnit);

    const sill = createBox(winW + 0.28, 0.12, 0.52, mats.hFrame);
    sill.position.set(0, -winH / 2 - 0.04, 0.04);
    root.add(sill);

    return root;
  }

  // 5. STAIRCASES ('staircase')
  if (categoryKey === 'staircase') {
    const stairGroup = new THREE.Group();
    stairGroup.position.set(0, -1.75, 0.72);
    root.add(stairGroup);

    const numSteps = 6;
    const stepW = 2.15;
    const treadD = 0.52;
    const riserH = 0.5;

    [-stepW / 2 - 0.06, stepW / 2 + 0.06].forEach((sx) => {
      const len = Math.hypot(numSteps * treadD, numSteps * riserH) + 0.4;
      const stringer = createBox(0.12, 0.34, len, mats.vFrame);
      stringer.position.set(sx, (numSteps * riserH) / 2 - 0.2, -(numSteps * treadD) / 2 + 0.2);
      stringer.rotation.x = Math.atan2(riserH, treadD);
      stairGroup.add(stringer);
    });

    for (let i = 0; i < numSteps; i++) {
      const y = (i + 1) * riserH;
      const z = -i * treadD;

      const tread = createBox(stepW, 0.085, treadD + 0.05, [
        mats.vFrame,
        mats.vFrame,
        mats.hFrame,
        mats.backSurface,
        mats.hFrame,
        mats.backSurface
      ]);
      tread.position.set(0, y, z);
      stairGroup.add(tread);

      const riser = createBox(stepW, riserH, 0.06, [
        mats.vFrame,
        mats.vFrame,
        mats.hFrame,
        mats.hFrame,
        mats.vFrame,
        mats.backSurface
      ]);
      riser.position.set(0, y - riserH / 2, z + treadD / 2 - 0.03);
      stairGroup.add(riser);

      // Lathe-style turned balusters on Left & Right
      [-stepW / 2 + 0.08, stepW / 2 - 0.08].forEach((bx) => {
        const baluster = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.045, 1.25, 16),
          mats.vFrame
        );
        baluster.position.set(bx, y + 0.62, z);
        stairGroup.add(baluster);
      });
    }

    const topY = numSteps * riserH;
    const topZ = -(numSteps - 1) * treadD - 0.18;
    [
      [-stepW / 2 + 0.08, 0.85, 0.26],
      [stepW / 2 - 0.08, 0.85, 0.26],
      [-stepW / 2 + 0.08, topY + 0.75, topZ],
      [stepW / 2 - 0.08, topY + 0.75, topZ]
    ].forEach(([nx, ny, nz]) => {
      const post = createBox(0.18, 1.65, 0.18, mats.vFrame);
      post.position.set(nx, ny, nz);
      stairGroup.add(post);

      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), mats.vFrame);
      ball.position.set(nx, ny + 0.92, nz);
      stairGroup.add(ball);
    });

    [-stepW / 2 + 0.08, stepW / 2 - 0.08].forEach((hx) => {
      const railLen = Math.hypot(numSteps * treadD, numSteps * riserH) + 0.35;
      const rail = createBox(0.12, 0.1, railLen, mats.hFrame);
      rail.position.set(hx, (numSteps * riserH) / 2 + 1.32, -(numSteps * treadD) / 2 + 0.22);
      rail.rotation.x = Math.atan2(riserH, treadD);
      stairGroup.add(rail);
    });

    return root;
  }

  // 6. WARDROBES ('wardrobe')
  if (categoryKey === 'wardrobe') {
    const wardrobeUnit = createFramedRecessedUnit({
      totalW: 2.95,
      totalH: 4.25,
      frameD: 1.22,
      jambW: 0.12,
      headerH: 0.13,
      bottomLegExt: 0.12,
      leafD: 1.04,
      frontMat: mats.frontSurface,
      mats,
      hasBottomRail: true,
      add3DReliefMesh: true,
      numDoorSeams: 2
    });
    root.add(wardrobeUnit);
    return root;
  }

  // 7. BEDROOM CUPBOARDS ('bedroom_cupboard')
  if (categoryKey === 'bedroom_cupboard') {
    const cupboardUnit = createFramedRecessedUnit({
      totalW: 2.45,
      totalH: 3.85,
      frameD: 1.12,
      jambW: 0.12,
      headerH: 0.12,
      bottomLegExt: 0.12,
      leafD: 0.94,
      frontMat: mats.frontSurface,
      mats,
      hasBottomRail: true,
      add3DReliefMesh: true,
      numDoorSeams: 1
    });
    root.add(cupboardUnit);
    return root;
  }

  // 8. TABLES ('table')
  if (categoryKey === 'table') {
    const tW = 3.55;
    const tD = 2.15;
    const tH = 2.05;

    const topUnit = createFramedRecessedUnit({
      totalW: tW,
      totalH: tD,
      frameD: 0.18,
      jambW: 0.14,
      headerH: 0.14,
      bottomLegExt: 0,
      leafD: 0.12,
      frontMat: mats.frontSurface,
      mats,
      hasBottomRail: true,
      add3DReliefMesh: true
    });
    topUnit.rotation.x = -Math.PI / 2;
    topUnit.position.set(0, tH / 2 - 0.1, 0);
    root.add(topUnit);

    const legH = tH;
    [
      [-tW / 2 + 0.16, -0.1, tD / 2 - 0.16],
      [tW / 2 - 0.16, -0.1, tD / 2 - 0.16],
      [-tW / 2 + 0.16, -0.1, -tD / 2 + 0.16],
      [tW / 2 - 0.16, -0.1, -tD / 2 + 0.16]
    ].forEach(([lx, ly, lz]) => {
      const leg = createBox(0.16, legH, 0.16, mats.vFrame);
      leg.position.set(lx, ly, lz);
      root.add(leg);
    });

    return root;
  }

  // 9. CHAIRS ('chair')
  if (categoryKey === 'chair') {
    const sW = 1.75;
    const sD = 1.65;
    const seatY = -0.5;

    const backrest = createFramedRecessedUnit({
      totalW: sW,
      totalH: 2.25,
      frameD: 0.2,
      jambW: 0.12,
      headerH: 0.12,
      bottomLegExt: 1.65,
      leafD: 0.1,
      frontMat: mats.frontSurface,
      mats,
      hasBottomRail: true,
      add3DReliefMesh: true
    });
    backrest.position.set(0, 0.65, -sD / 2 + 0.1);
    root.add(backrest);

    const seat = createBox(sW, 0.14, sD, [
      mats.vFrame,
      mats.vFrame,
      mats.hFrame,
      mats.backSurface,
      mats.hFrame,
      mats.backSurface
    ]);
    seat.position.set(0, seatY, 0.04);
    root.add(seat);

    [-sW / 2 + 0.08, sW / 2 - 0.08].forEach((fx) => {
      const fLeg = createBox(0.12, 1.6, 0.12, mats.vFrame);
      fLeg.position.set(fx, -1.3, sD / 2 - 0.06);
      root.add(fLeg);
    });

    return root;
  }

  // 10. CUSTOM WOODEN FURNITURE ('custom_furniture')
  const customUnit = createFramedRecessedUnit({
    totalW: 3.1,
    totalH: 3.65,
    frameD: 1.15,
    jambW: 0.13,
    headerH: 0.13,
    bottomLegExt: 0.12,
    leafD: 0.96,
    frontMat: mats.frontSurface,
    mats,
    hasBottomRail: true,
    addVerticalPullHandle: true,
    add3DReliefMesh: true,
    numDoorSeams: 1
  });
  root.add(customUnit);
  return root;
}

// ============================================================================
// MAIN REACT COMPONENT: ThreeCarpentryViewer (Sketchfab 3D Studio Edition)
// ============================================================================
export default function ThreeCarpentryViewer({
  woodType = 'teak',
  finish = 'natural',
  selectedWork = 'door',
  onSelectWork = null,
  onUploadPhoto = null,
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
  const pivotRootRef = useRef(null);
  const modelRootRef = useRef(null);
  const interactivePivotsRef = useRef([]);

  const [loadedImage, setLoadedImage] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [matchPhotoWood, setMatchPhotoWood] = useState(true);
  const [darkStudioBg, setDarkStudioBg] = useState(false);

  // Default 3D Tilted View (Matching Sketchfab Screenshot 1)
  const [rotationY, setRotationY] = useState(18);
  const [rotationX, setRotationX] = useState(14);
  const [zoom, setZoom] = useState(1);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('iso');

  const categoryKey = normalizeCategoryKey(selectedWork);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotY: 0, rotX: 0 });

  // Load and analyze active design image asynchronously
  useEffect(() => {
    if (!activeImage) {
      setLoadedImage(null);
      setImageAnalysis(null);
      return;
    }
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!isCancelled) {
        const analyzed = analyzeUploadedReferenceImage(img);
        setLoadedImage(img);
        setImageAnalysis(analyzed);
      }
    };
    img.onerror = () => {
      if (!isCancelled) {
        setLoadedImage(null);
        setImageAnalysis(null);
      }
    };
    img.src = activeImage;

    return () => {
      isCancelled = true;
    };
  }, [activeImage]);

  // Initialize Clean Sketchfab-Style Three.js Viewport
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const widthPx = container.clientWidth || 640;
    const heightPx = container.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, widthPx / heightPx, 0.1, 100);
    camera.position.set(0, 0, 7.8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd6d3d1, 1.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbf5, 1.85);
    keyLight.position.set(5, 8, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.45);
    backLight.position.set(-5, 6, -7);
    scene.add(backLight);

    const bottomRimLight = new THREE.DirectionalLight(0xf5f5f4, 0.95);
    bottomRimLight.position.set(0, -7, 4);
    scene.add(bottomRimLight);

    const pivotGroup = new THREE.Group();
    pivotRootRef.current = pivotGroup;
    scene.add(pivotGroup);

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

    let animId = null;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Rebuild 3D Model whenever category, wood, finish, or uploaded image changes
  useEffect(() => {
    const pivotRoot = pivotRootRef.current;
    const renderer = rendererRef.current;
    if (!pivotRoot || !renderer) return;

    if (modelRootRef.current) {
      pivotRoot.remove(modelRootRef.current);
      modelRootRef.current.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      modelRootRef.current = null;
    }
    interactivePivotsRef.current = [];

    const maxAniso = renderer.capabilities.getMaxAnisotropy() || 4;
    const { mats, disposeAll } = createSketchfabCarpentryMaterials(
      woodType,
      finish,
      loadedImage,
      imageAnalysis,
      matchPhotoWood,
      maxAniso
    );

    const pivots = [];
    const newModel = buildSketchfabCategoryModel(categoryKey, mats, pivots);
    modelRootRef.current = newModel;
    interactivePivotsRef.current = pivots;

    pivots.forEach((p) => {
      p.group.rotation.y = isDoorOpen ? p.openRotY : 0;
    });

    pivotRoot.add(newModel);

    return () => {
      disposeAll();
    };
  }, [categoryKey, woodType, finish, loadedImage, imageAnalysis, matchPhotoWood]);

  // Apply 360° Yaw, Vertical Pitch (-85° to +85°), and Zoom
  useEffect(() => {
    if (pivotRootRef.current) {
      pivotRootRef.current.rotation.y = (rotationY * Math.PI) / 180;
      pivotRootRef.current.rotation.x = (rotationX * Math.PI) / 180;
    }
    if (cameraRef.current) {
      cameraRef.current.position.z = 7.8 / zoom;
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [rotationY, rotationX, zoom]);

  // Auto-Spin interval
  useEffect(() => {
    let timer = null;
    if (isAutoSpin) {
      timer = setInterval(() => {
        setRotationY((prev) => (prev + 1) % 360);
      }, 25);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoSpin]);

  // Swing Open / Close Door Leaf
  useEffect(() => {
    interactivePivotsRef.current.forEach((p) => {
      p.group.rotation.y = isDoorOpen ? p.openRotY : 0;
    });
  }, [isDoorOpen]);

  const handlePointerDown = (e) => {
    if (
      e.target.closest('button') ||
      e.target.closest('select') ||
      e.target.closest('label') ||
      e.target.closest('.no-drag')
    ) {
      return;
    }
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

    const newY = Math.round(((dragStartRef.current.rotY + deltaX * 0.75) % 360) + 360) % 360;
    const newX = Math.max(-85, Math.min(85, Math.round(dragStartRef.current.rotX + deltaY * 0.55)));

    setRotationY(newY);
    setRotationX(newX);
    setActivePreset('custom');
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

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.max(0.65, Math.min(2.0, Number((prev + delta).toFixed(2)))));
  };

  const setPresetAngle = (preset, y, x = 0) => {
    setActivePreset(preset);
    setIsAutoSpin(false);
    setRotationY(y);
    setRotationX(x);
  };

  const getVisibleSideInfo = (degY, degX) => {
    if (degX >= 45) {
      return {
        label: 'Top Tilted View',
        badge: 'bg-stone-900 text-amber-300',
        hint: '3D top wood-grain header & recessed door/frame step'
      };
    }
    if (degX <= -45) {
      return {
        label: 'Bottom View',
        badge: 'bg-stone-900 text-amber-300',
        hint: '3D bottom jamb legs & underside frame joinery'
      };
    }
    const norm = ((degY % 360) + 360) % 360;
    if (norm >= 315 || norm < 45) {
      return {
        label: 'Front View (0°)',
        badge: 'bg-amber-500 text-stone-950',
        hint: '3D relief surface recessed inside 3D wood-grain frame + 3D handle'
      };
    }
    if (norm >= 45 && norm < 135) {
      return {
        label: 'Right-Side View (90°)',
        badge: 'bg-emerald-500 text-stone-950',
        hint: `3D outer frame side profile (${height} cm depth)`
      };
    }
    if (norm >= 135 && norm < 225) {
      return {
        label: 'Back View (180°)',
        badge: 'bg-blue-500 text-white',
        hint: 'Smooth dark-wood back recessed inside 3D outer wood-grain frame'
      };
    }
    return {
      label: 'Left-Side View (270°)',
      badge: 'bg-purple-500 text-white',
      hint: '3D left outer frame jamb & directional wood grain'
    };
  };

  const visibleSide = getVisibleSideInfo(rotationY, rotationX);
  const hasInteractiveDoors = ['door', 'window', 'custom_furniture'].includes(categoryKey);

  const viewPresets = [
    { id: 'iso', label: '3D Tilt', y: 18, x: 14 },
    { id: 'front', label: 'Front (0°)', y: 0, x: 0 },
    { id: 'right', label: 'Right (90°)', y: 90, x: 0 },
    { id: 'back', label: 'Back (180°)', y: 162, x: 6 },
    { id: 'left', label: 'Left (270°)', y: 270, x: 0 },
    { id: 'top', label: 'Top View', y: 168, x: 48 },
    { id: 'bottom', label: 'Bottom View', y: 18, x: -58 }
  ];

  return (
    <div
      className={`relative w-full ${
        isStudio ? 'h-full' : 'h-[480px] sm:h-[540px] lg:h-[580px] xl:h-[620px]'
      } flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 ${
        darkStudioBg
          ? 'bg-[radial-gradient(circle_at_center,_#2b1d14_0%,_#120b07_100%)]'
          : 'bg-[radial-gradient(circle_at_center,_#ececec_0%,_#d5d5d5_100%)]'
      }`}
    >
      {/* 1. 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-10"
      />

      {/* 2. Top Interactive HUD & 7 View Presets */}
      <div
        className="relative z-30 flex flex-wrap items-center justify-between gap-2 p-3 pointer-events-auto no-drag"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Sketchfab-Style UPLOAD PHOTO -> GENERATE 3D Button */}
          {onUploadPhoto && (
            <label
              onPointerDown={(e) => e.stopPropagation()}
              className="px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md border border-white/60 transition-all cursor-pointer"
              title="Upload any carpentry photo to generate its 3D model"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo → 3D</span>
              <input
                type="file"
                accept="image/*"
                onChange={onUploadPhoto}
                className="hidden"
              />
            </label>
          )}

          <button
            type="button"
            onClick={() => setIsAutoSpin((prev) => !prev)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-md backdrop-blur-md transition-all cursor-pointer ${
              isAutoSpin
                ? 'bg-amber-400 text-stone-950 border-2 border-white font-black'
                : 'bg-stone-900/85 text-amber-300 border border-white/20 hover:bg-stone-900'
            }`}
            title="Click to toggle 360° Auto-Spin"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} />
            <span>{isAutoSpin ? 'Spinning' : '360° Orbit'}</span>
          </button>

          {onSelectWork && (
            <div className="flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-1 shadow-md">
              <Boxes className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={categoryKey}
                onChange={(e) => onSelectWork(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                className="bg-transparent text-amber-200 text-[11px] font-bold outline-none cursor-pointer"
                title="Switch 3D Carpentry Product Model"
              >
                {CARPENTRY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-stone-900 text-amber-100">
                    3D {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* All 7 View Presets */}
        <div
          className="hidden xl:flex items-center gap-1 bg-stone-900/85 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-xs shadow-md"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="text-amber-300 font-mono font-bold text-[11px] mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{Math.round(rotationY)}°</span>
          </span>

          {viewPresets.map((vp) => {
            const isActive =
              activePreset === vp.id ||
              (Math.abs(rotationY - vp.y) <= 5 && Math.abs(rotationX - vp.x) <= 6);
            return (
              <button
                key={vp.id}
                type="button"
                onClick={() => setPresetAngle(vp.id, vp.y, vp.x)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 font-black shadow-sm'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {vp.label}
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setMatchPhotoWood((prev) => !prev)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
              matchPhotoWood
                ? 'bg-amber-400 text-stone-950 border-white font-black'
                : 'bg-stone-900/85 text-amber-200 border-white/20 hover:bg-stone-900'
            }`}
            title="Match 3D frame & back wood color to uploaded photo vs selected wood species"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">
              {matchPhotoWood ? 'Auto Frame Color' : 'Species Color'}
            </span>
          </button>

          {hasInteractiveDoors && (
            <button
              type="button"
              onClick={() => setIsDoorOpen((prev) => !prev)}
              onPointerDown={(e) => e.stopPropagation()}
              className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                isDoorOpen
                  ? 'bg-emerald-400 text-stone-950 border-white font-black'
                  : 'bg-stone-900/85 text-amber-300 border-white/20 hover:bg-stone-900'
              }`}
              title="Open / Close 3D door leaf inside outer frame"
            >
              {isDoorOpen ? (
                <DoorOpen className="w-3.5 h-3.5" />
              ) : (
                <DoorClosed className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{isDoorOpen ? 'Close' : 'Open Door'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setDarkStudioBg((prev) => !prev)}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-stone-900 flex items-center justify-center text-xs cursor-pointer shadow-sm"
            title="Toggle Light / Dark Studio Background"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAutoSpin(false);
              setRotationY((prev) => (prev - 20 + 360) % 360);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-stone-900 flex items-center justify-center text-xs cursor-pointer shadow-sm"
            title="Rotate Left (-20°)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAutoSpin(false);
              setRotationY((prev) => (prev + 20) % 360);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-stone-900 flex items-center justify-center text-xs cursor-pointer shadow-sm"
            title="Rotate Right (+20°)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {!isStudio && (
            <button
              type="button"
              onClick={onOpenStudio}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-stone-900/85 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-amber-400 hover:text-stone-950 transition-all cursor-pointer shadow-sm"
              title="Open Fullscreen 3D Inspection Studio"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Bottom Controls & Angle Switcher */}
      <div
        className="relative z-30 flex flex-wrap items-center justify-between gap-2 p-3 mt-auto pointer-events-auto no-drag"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex xl:hidden items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1">
          {viewPresets.map((vp) => {
            const isActive =
              activePreset === vp.id ||
              (Math.abs(rotationY - vp.y) <= 5 && Math.abs(rotationX - vp.x) <= 6);
            return (
              <button
                key={vp.id}
                type="button"
                onClick={() => setPresetAngle(vp.id, vp.y, vp.x)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 font-black'
                    : 'bg-stone-900/85 text-gray-200 border border-white/15'
                }`}
              >
                {vp.label}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-white bg-stone-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-md">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${visibleSide.badge}`}>
            {visibleSide.label}
          </span>
          <span className="text-amber-200/90 font-medium">{visibleSide.hint}</span>
          <span className="text-white/40">•</span>
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-amber-300">
            {length}×{width}×{height} cm
          </span>
        </div>

        <div className="flex items-center gap-1 bg-stone-900/85 border border-white/20 rounded-full px-2 py-1 ml-auto shadow-md">
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.max(0.65, Number((prev - 0.15).toFixed(2))))}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 hover:text-amber-400 transition-colors text-gray-200 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-bold text-amber-300 w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.min(2.0, Number((prev + 0.15).toFixed(2))))}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 hover:text-amber-400 transition-colors text-gray-200 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
