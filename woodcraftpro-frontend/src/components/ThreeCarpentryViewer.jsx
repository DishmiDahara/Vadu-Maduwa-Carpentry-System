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
  CheckCircle2
} from 'lucide-react';

// ============================================================================
// SPECIES COLOR PALETTES
// ============================================================================
const SPECIES_PALETTES = {
  teak: {
    name: 'Sri Lankan Teak',
    base: '#9E6324',
    dark: '#5C340E',
    light: '#C88A4B',
    accent: '#3E2107',
    plinth: '#2B1706',
    counter: '#241E1A',
    grainOpacity: 0.22,
    brass: '#E2B755'
  },
  mahogany: {
    name: 'Red Mahogany',
    base: '#6E2316',
    dark: '#421008',
    light: '#983A28',
    accent: '#2A0703',
    plinth: '#240804',
    counter: '#1D1917',
    grainOpacity: 0.2,
    brass: '#E8C16A'
  },
  jackwood: {
    name: 'Golden Jackwood',
    base: '#B8841E',
    dark: '#785008',
    light: '#DBA840',
    accent: '#4F3303',
    plinth: '#332004',
    counter: '#28221C',
    grainOpacity: 0.24,
    brass: '#D4AF37'
  },
  satinwood: {
    name: 'Ceylon Satinwood',
    base: '#C69555',
    dark: '#8C6028',
    light: '#E2B87E',
    accent: '#5C3C14',
    plinth: '#38240B',
    counter: '#2B241E',
    grainOpacity: 0.18,
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
// STEP 1: CLIENT-SIDE COMPUTER VISION IMAGE ANALYZER
// Analyzes uploaded reference image to extract foreground bounds (stripping room/white
// backgrounds), timber color palette, carving relief depth, and structural traits.
// ============================================================================
export function analyzeUploadedReferenceImage(img) {
  const fallback = {
    hasImage: false,
    cropBox: { x: 0, y: 0, w: 1, h: 1 },
    dominantHex: null,
    darkHex: null,
    lightHex: null,
    reliefStrength: 0.55,
    hasArchMotif: true,
    panelSubdivisions: 4,
    aspectRatio: 0.65
  };

  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) {
    return fallback;
  }

  try {
    const sampleW = 96;
    const sampleH = 96;
    const c = document.createElement('canvas');
    c.width = sampleW;
    c.height = sampleH;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, sampleW, sampleH);
    const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data;

    // 1. Sample outer border pixels to detect uniform studio/wall background
    let borderR = 0, borderG = 0, borderB = 0, borderCount = 0;
    for (let x = 0; x < sampleW; x++) {
      for (const y of [0, 1, sampleH - 2, sampleH - 1]) {
        const idx = (y * sampleW + x) * 4;
        borderR += imgData[idx];
        borderG += imgData[idx + 1];
        borderB += imgData[idx + 2];
        borderCount++;
      }
    }
    borderR /= borderCount;
    borderG /= borderCount;
    borderB /= borderCount;

    // 2. Find tight bounding box of the foreground carpentry object (ignoring background walls/margins)
    let minX = sampleW, maxX = 0, minY = sampleH, maxY = 0;
    const fgColors = [];
    let edgeEnergySum = 0;

    for (let y = 2; y < sampleH - 2; y++) {
      for (let x = 2; x < sampleW - 2; x++) {
        const idx = (y * sampleW + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3];
        if (a < 100) continue;

        const distBg = Math.hypot(r - borderR, g - borderG, b - borderB);
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        // Wood & furniture pixels have warm/mid luminance or differ from uniform background
        const isForeground = distBg > 26 || (lum > 22 && lum < 235 && r >= b * 0.85);

        if (isForeground) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;

          // Collect warm/wood-like pixels for timber palette extraction
          if (lum > 25 && lum < 225) {
            fgColors.push({ r, g, b, lum });
          }
        }

        // Compute local Sobel gradient for 3D carving relief estimation
        const idxRight = (y * sampleW + (x + 1)) * 4;
        const idxDown = ((y + 1) * sampleW + x) * 4;
        const gx = Math.abs(r - imgData[idxRight]);
        const gy = Math.abs(r - imgData[idxDown]);
        edgeEnergySum += gx + gy;
      }
    }

    // Inset slightly inside the detected bounding box so outer wall/floor background is excluded
    if (maxX - minX < sampleW * 0.25 || maxY - minY < sampleH * 0.25) {
      minX = Math.round(sampleW * 0.12);
      maxX = Math.round(sampleW * 0.88);
      minY = Math.round(sampleH * 0.1);
      maxY = Math.round(sampleH * 0.9);
    } else {
      const padX = Math.round((maxX - minX) * 0.08);
      const padY = Math.round((maxY - minY) * 0.08);
      minX = Math.min(sampleW - 10, minX + padX);
      maxX = Math.max(minX + 10, maxX - padX);
      minY = Math.min(sampleH - 10, minY + padY);
      maxY = Math.max(minY + 10, maxY - padY);
    }

    const cropBox = {
      x: minX / sampleW,
      y: minY / sampleH,
      w: Math.max(0.2, (maxX - minX) / sampleW),
      h: Math.max(0.2, (maxY - minY) / sampleH)
    };

    // 3. Sort foreground pixels by luminance to extract dark groove, mid timber, and highlight tones
    fgColors.sort((a, b) => a.lum - b.lum);
    const toHex = (c) =>
      '#' +
      [c.r, c.g, c.b]
        .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
        .join('');

    let dominantHex = null;
    let darkHex = null;
    let lightHex = null;

    if (fgColors.length > 30) {
      const p20 = fgColors[Math.floor(fgColors.length * 0.2)];
      const p55 = fgColors[Math.floor(fgColors.length * 0.55)];
      const p82 = fgColors[Math.floor(fgColors.length * 0.82)];

      // Ensure warm timber richness so white/grey walls never wash out the wood
      const warmAdjust = (c, multR = 1.08, multG = 0.92, multB = 0.74) => ({
        r: c.r * multR,
        g: c.g * multG,
        b: c.b * multB
      });

      darkHex = toHex(warmAdjust(p20, 0.85, 0.7, 0.55));
      dominantHex = toHex(warmAdjust(p55, 1.05, 0.88, 0.68));
      lightHex = toHex(warmAdjust(p82, 1.1, 0.95, 0.76));
    }

    const avgEdge = edgeEnergySum / (sampleW * sampleH);
    const reliefStrength = Math.max(0.35, Math.min(1.0, avgEdge / 28));

    return {
      hasImage: true,
      cropBox,
      dominantHex,
      darkHex,
      lightHex,
      reliefStrength,
      hasArchMotif: true,
      panelSubdivisions: avgEdge > 22 ? 4 : 2,
      aspectRatio: (img.naturalWidth * cropBox.w) / Math.max(1, img.naturalHeight * cropBox.h)
    };
  } catch (err) {
    return fallback;
  }
}

// ============================================================================
// STEP 2: 3D MATERIAL & RELIEF BUMP-MAP GENERATOR
// Uses the uploaded image as a DESIGN REFERENCE (never as a flat photo plane)
// to generate:
// - Structural solid hardwood grain textures (`wood`, `darkWood`, `endGrain`)
// - Inset carved panel texture (`carvedPanel`) cropped from the reference motif
//   and blended into 3D bevelled hardwood with a 3D height/bump map (`bumpMap`)
// ============================================================================
function createReferenceDriven3DMaterials(
  woodType,
  finish,
  loadedImage,
  analysis,
  usePhotoTimberTone = false,
  anisotropy = 4
) {
  const basePal = SPECIES_PALETTES[woodType] || SPECIES_PALETTES.teak;
  const pal = { ...basePal };

  // If user wants the 3D timber color adapted from their uploaded photo reference
  if (usePhotoTimberTone && analysis?.hasImage && analysis.dominantHex) {
    pal.base = analysis.dominantHex;
    pal.dark = analysis.darkHex || basePal.dark;
    pal.light = analysis.lightHex || basePal.light;
  }

  if (finish === 'walnut') {
    pal.base = '#4A2811';
    pal.dark = '#291305';
    pal.light = '#6E3F1D';
    pal.accent = '#1A0B02';
  } else if (finish === 'teak_stain') {
    pal.base = '#B56E22';
    pal.dark = '#6E3D0B';
    pal.light = '#DF9544';
  }

  // Paint realistic solid hardwood grain on a canvas
  const drawHardwoodGrain = (ctx, w, h, options = {}) => {
    const { isEndGrain = false, vertical = true, darker = false } = options;
    const cBase = darker ? pal.dark : pal.base;
    const cLight = darker ? pal.base : pal.light;
    const cDark = pal.accent;

    const grad = vertical
      ? ctx.createLinearGradient(0, 0, w, 0)
      : ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, cBase);
    grad.addColorStop(0.28, cLight);
    grad.addColorStop(0.55, cBase);
    grad.addColorStop(0.82, cLight);
    grad.addColorStop(1, cBase);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (isEndGrain) {
      ctx.save();
      ctx.strokeStyle = cDark;
      ctx.globalAlpha = pal.grainOpacity * 1.4;
      ctx.lineWidth = 2.2;
      const cx = w * 0.5;
      const cy = h * 1.5;
      for (let r = 14; r < Math.max(w, h) * 2.1; r += 8 + (r % 5)) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.fillStyle = cDark;
    ctx.globalAlpha = pal.grainOpacity * 0.9;
    const count = 80;
    for (let i = 0; i < count; i++) {
      const pos = (i / count) * (vertical ? w : h);
      const thickness = 1.4 + ((i * 7) % 5);
      if (vertical) ctx.fillRect(pos, 0, thickness, h);
      else ctx.fillRect(0, pos, w, thickness);
    }

    // Cathedral grain arches
    ctx.strokeStyle = cDark;
    ctx.globalAlpha = pal.grainOpacity * 0.75;
    ctx.lineWidth = 1.3;
    const maxDim = vertical ? w : h;
    const lenDim = vertical ? h : w;
    for (let p = 0; p < maxDim; p += 12) {
      ctx.beginPath();
      if (vertical) ctx.moveTo(p, 0);
      else ctx.moveTo(0, p);
      let curr = p;
      for (let q = 0; q <= lenDim; q += 32) {
        curr += Math.sin(q * 0.028 + p * 0.11) * 2.8;
        if (vertical) ctx.lineTo(curr, q);
        else ctx.lineTo(q, curr);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  // Paint an inset 3D carved wood panel texture using the uploaded reference motif
  // (Cropped to the interior foreground of the uploaded image so room backgrounds never show,
  // and fused with 3D stepped timber moulding & wood grain)
  const drawCarvedReferencePanel = (ctx, bumpCtx, w, h) => {
    drawHardwoodGrain(ctx, w, h, { vertical: h >= w });

    // Initialize neutral bump map
    bumpCtx.fillStyle = '#808080';
    bumpCtx.fillRect(0, 0, w, h);

    const padX = Math.round(w * 0.08);
    const padY = Math.round(h * 0.08);
    const iw = w - padX * 2;
    const ih = h - padY * 2;

    // 1. Stepped 3D Bevel Frame in both Albedo and Height/Bump Map
    ctx.save();
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = Math.max(6, Math.round(w * 0.018));
    ctx.strokeRect(padX, padY, iw, ih);

    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = Math.max(3, Math.round(w * 0.008));
    ctx.strokeRect(padX + 6, padY + 6, iw - 12, ih - 12);
    ctx.restore();

    // Deep groove in bump map for the panel fielding routing
    bumpCtx.strokeStyle = '#181818';
    bumpCtx.lineWidth = Math.max(12, Math.round(w * 0.03));
    bumpCtx.strokeRect(padX, padY, iw, ih);
    bumpCtx.fillStyle = '#b8b8b8';
    bumpCtx.fillRect(padX + 10, padY + 10, iw - 20, ih - 20);

    // 2. If a reference image is loaded, extract its central design pattern into the inset panel
    if (loadedImage && loadedImage.complete && loadedImage.naturalWidth > 0) {
      const cb = analysis?.cropBox || { x: 0.12, y: 0.12, w: 0.76, h: 0.76 };
      // Sample the core design motif (avoiding outer photo background)
      const sx = Math.round(loadedImage.naturalWidth * (cb.x + cb.w * 0.08));
      const sy = Math.round(loadedImage.naturalHeight * (cb.y + cb.h * 0.08));
      const sw = Math.max(16, Math.round(loadedImage.naturalWidth * (cb.w * 0.84)));
      const sh = Math.max(16, Math.round(loadedImage.naturalHeight * (cb.h * 0.84)));

      ctx.save();
      ctx.beginPath();
      ctx.rect(padX + 8, padY + 8, iw - 16, ih - 16);
      ctx.clip();

      // Draw extracted design motif onto the recessed timber panel
      ctx.globalAlpha = 0.78;
      ctx.drawImage(loadedImage, sx, sy, sw, sh, padX + 8, padY + 8, iw - 16, ih - 16);

      // Harmonize with solid hardwood grain so any background pixels become rich carved wood
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = pal.light;
      ctx.globalAlpha = 0.42;
      ctx.fillRect(padX + 8, padY + 8, iw - 16, ih - 16);

      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = pal.base;
      ctx.globalAlpha = 0.28;
      ctx.fillRect(padX + 8, padY + 8, iw - 16, ih - 16);
      ctx.restore();

      // Also draw the motif into the 3D Bump Map so carvings/grooves in the uploaded photo
      // catch real 3D directional studio light!
      bumpCtx.save();
      bumpCtx.beginPath();
      bumpCtx.rect(padX + 10, padY + 10, iw - 20, ih - 20);
      bumpCtx.clip();
      bumpCtx.filter = 'grayscale(100%) contrast(175%)';
      bumpCtx.drawImage(loadedImage, sx, sy, sw, sh, padX + 10, padY + 10, iw - 20, ih - 20);
      bumpCtx.restore();
    } else {
      // Fallback carved diamond/arch relief when no image is loaded
      ctx.save();
      ctx.strokeStyle = pal.dark;
      ctx.lineWidth = 6;
      ctx.strokeRect(padX + 20, padY + 20, iw - 40, ih - 40);
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

  // 1. Solid Structural Wood Grain (Stiles, Rails, Frames, Jambs, Legs, Balusters)
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 1024;
  drawHardwoodGrain(woodCanvas.getContext('2d'), 512, 1024, { vertical: true });

  // 2. Horizontal Structural Wood Grain (Rails, Aprons, Treads, Countertops)
  const hWoodCanvas = document.createElement('canvas');
  hWoodCanvas.width = 1024;
  hWoodCanvas.height = 512;
  drawHardwoodGrain(hWoodCanvas.getContext('2d'), 1024, 512, { vertical: false });

  // 3. Darker Structural Timber (Plinths, Thresholds, Moulding Trim, Carcass Interiors)
  const darkWoodCanvas = document.createElement('canvas');
  darkWoodCanvas.width = 512;
  darkWoodCanvas.height = 512;
  drawHardwoodGrain(darkWoodCanvas.getContext('2d'), 512, 512, { vertical: true, darker: true });

  // 4. End-Grain Timber (Top & Bottom edges)
  const endCanvas = document.createElement('canvas');
  endCanvas.width = 512;
  endCanvas.height = 512;
  drawHardwoodGrain(endCanvas.getContext('2d'), 512, 512, { isEndGrain: true });

  // 5. Inset Carved Reference Panel + 3D Bump Heightmap
  const panelCanvas = document.createElement('canvas');
  panelCanvas.width = 768;
  panelCanvas.height = 1024;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 768;
  bumpCanvas.height = 1024;
  drawCarvedReferencePanel(
    panelCanvas.getContext('2d'),
    bumpCanvas.getContext('2d'),
    768,
    1024
  );

  const woodTex = toTex(woodCanvas);
  const hWoodTex = toTex(hWoodCanvas);
  const darkWoodTex = toTex(darkWoodCanvas);
  const endGrainTex = toTex(endCanvas);
  const carvedPanelTex = toTex(panelCanvas);
  const carvedBumpTex = toTex(bumpCanvas, true);

  const roughnessVal = finish === 'gloss' ? 0.18 : finish === 'matte' ? 0.68 : 0.36;
  const metalnessVal = finish === 'gloss' ? 0.08 : 0.03;

  const mats = {
    // Structural vertical hardwood (jambs, stiles, posts, legs)
    wood: new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    // Structural horizontal hardwood (rails, treads, shelves, cornices)
    hWood: new THREE.MeshStandardMaterial({
      map: hWoodTex,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    // Darker accented hardwood (mouldings, bevel frames, plinths)
    darkWood: new THREE.MeshStandardMaterial({
      map: darkWoodTex,
      roughness: roughnessVal + 0.08,
      metalness: metalnessVal
    }),
    // End grain for top/bottom cuts
    endGrain: new THREE.MeshStandardMaterial({
      map: endGrainTex,
      roughness: roughnessVal + 0.12
    }),
    // Inset 3D carved panel (carries the extracted reference design + 3D relief bump map)
    carvedPanel: new THREE.MeshStandardMaterial({
      map: carvedPanelTex,
      bumpMap: carvedBumpTex,
      bumpScale: 0.055,
      roughness: roughnessVal,
      metalness: metalnessVal
    }),
    // Granite / dark stone countertop
    counter: new THREE.MeshStandardMaterial({
      color: pal.counter,
      roughness: 0.2,
      metalness: 0.18
    }),
    // Solid brass hardware (handles, hinges, lock plates, finials, hanging rods)
    brass: new THREE.MeshStandardMaterial({
      color: pal.brass,
      roughness: 0.22,
      metalness: 0.88
    }),
    // Architectural clear/tinted window & cabinet glass
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      transparent: true,
      opacity: 0.38,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.55,
      reflectivity: 0.9
    })
  };

  const disposeAll = () => {
    [woodTex, hWoodTex, darkWoodTex, endGrainTex, carvedPanelTex, carvedBumpTex].forEach((t) =>
      t.dispose()
    );
    Object.values(mats).forEach((m) => m.dispose());
  };

  return { mats, palette: pal, disposeAll };
}

// ============================================================================
// REUSABLE 3D CARPENTRY SUB-ASSEMBLIES (MULTI-PART REAL 3D GEOMETRY)
// Ensures NO product is ever a single flat box! Every door, panel, sash, or
// cabinet side is built from separate 3D stiles, rails, bevels, and raised bosses.
// ============================================================================
function createMeshBox(w, h, d, material) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Builds a real 5-piece + raised-fielding 3D carpentry door/panel assembly:
// - Left Stile, Right Stile, Top Rail, Bottom Rail (and optional Middle Rail)
// - Recessed core board
// - Stepped 3D pyramid bevel frame + Raised 3D carved fielding panel on BOTH Front & Back
function create3DFramedCarpentryDoor(w, h, d, mats, options = {}) {
  const {
    rows = 2,
    cols = 1,
    stileW = Math.min(0.14, w * 0.13),
    railH = Math.min(0.15, h * 0.1),
    hasArchBoss = false,
    useGlassUpper = false
  } = options;

  const group = new THREE.Group();

  // 1. Left & Right Full-Height Vertical Stiles
  const leftStile = createMeshBox(stileW, h, d, mats.wood);
  leftStile.position.set(-w / 2 + stileW / 2, 0, 0);
  group.add(leftStile);

  const rightStile = createMeshBox(stileW, h, d, mats.wood);
  rightStile.position.set(w / 2 - stileW / 2, 0, 0);
  group.add(rightStile);

  // 2. Top & Bottom Horizontal Rails
  const innerW = w - stileW * 2;
  const topRail = createMeshBox(innerW, railH, d, mats.hWood);
  topRail.position.set(0, h / 2 - railH / 2, 0);
  group.add(topRail);

  const bottomRailH = railH * 1.25;
  const bottomRail = createMeshBox(innerW, bottomRailH, d, mats.hWood);
  bottomRail.position.set(0, -h / 2 + bottomRailH / 2, 0);
  group.add(bottomRail);

  // 3. Optional Center Vertical Mullion Stile (when cols === 2)
  const mullionW = cols > 1 ? stileW * 0.78 : 0;
  if (cols > 1) {
    const mullion = createMeshBox(mullionW, h - railH - bottomRailH, d * 0.96, mats.wood);
    mullion.position.set(0, (bottomRailH - railH) / 2, 0);
    group.add(mullion);
  }

  // 4. Subdivide interior into rows of recessed 3D panels separated by Intermediate Cross Rails
  const availH = h - railH - bottomRailH;
  const midRailH = railH * 0.85;
  const cellH = (availH - (rows - 1) * midRailH) / rows;
  const cellW = cols > 1 ? (innerW - mullionW) / 2 : innerW;

  for (let r = 0; r < rows; r++) {
    const cellCenterY = h / 2 - railH - r * (cellH + midRailH) - cellH / 2;

    // Add horizontal intermediate rail below this row (except last row)
    if (r < rows - 1) {
      const midRail = createMeshBox(innerW, midRailH, d * 0.98, mats.hWood);
      midRail.position.set(0, cellCenterY - cellH / 2 - midRailH / 2, 0);
      group.add(midRail);
    }

    for (let c = 0; c < cols; c++) {
      const cellCenterX =
        cols === 1
          ? 0
          : c === 0
          ? -(mullionW / 2 + cellW / 2)
          : mullionW / 2 + cellW / 2;

      const isUpperGlass = useGlassUpper && r === 0;

      if (isUpperGlass) {
        // Real 3D Transparent Glass Pane with wooden muntin bars
        const glassPane = createMeshBox(cellW - 0.02, cellH - 0.02, d * 0.28, mats.glass);
        glassPane.position.set(cellCenterX, cellCenterY, 0);
        group.add(glassPane);

        // Wooden glazing bead frame + cross muntins
        const vMuntin = createMeshBox(0.035, cellH, d * 0.55, mats.wood);
        vMuntin.position.set(cellCenterX, cellCenterY, 0);
        group.add(vMuntin);

        const hMuntin = createMeshBox(cellW, 0.035, d * 0.55, mats.hWood);
        hMuntin.position.set(cellCenterX, cellCenterY, 0);
        group.add(hMuntin);
      } else {
        // Solid Recessed Core Panel
        const corePanel = createMeshBox(cellW - 0.01, cellH - 0.01, d * 0.58, mats.darkWood);
        corePanel.position.set(cellCenterX, cellCenterY, 0);
        group.add(corePanel);

        // Stepped 3D Bevel Frame + Raised Carved Fielding Panel on BOTH Front (+Z) and Back (-Z)
        [-1, 1].forEach((zDir) => {
          // Step 1 bevel tier
          const bevel1 = createMeshBox(
            cellW * 0.88,
            cellH * 0.88,
            d * 0.16,
            mats.wood
          );
          bevel1.position.set(cellCenterX, cellCenterY, zDir * (d * 0.34));
          group.add(bevel1);

          // Step 2 raised carved panel boss (mapped with reference design & 3D bump relief)
          const boss = createMeshBox(
            cellW * 0.76,
            cellH * 0.76,
            d * 0.18,
            mats.carvedPanel
          );
          boss.position.set(cellCenterX, cellCenterY, zDir * (d * 0.44));
          group.add(boss);

          // Optional 3D Carved Arch / Medallion Relief on upper panels
          if (hasArchBoss && r === 0) {
            const archRadius = Math.min(cellW, cellH) * 0.24;
            const medallion = new THREE.Mesh(
              new THREE.CylinderGeometry(archRadius, archRadius * 1.08, d * 0.1, 24),
              mats.darkWood
            );
            medallion.rotation.x = Math.PI / 2;
            medallion.position.set(cellCenterX, cellCenterY, zDir * (d * 0.53));
            group.add(medallion);
          }
        });
      }
    }
  }

  return group;
}

// Builds a 3D Brass Handle Assembly
function createBrassHandle(mats, scale = 1, vertical = true) {
  const hg = new THREE.Group();
  const plate = createMeshBox(
    vertical ? 0.075 * scale : 0.34 * scale,
    vertical ? 0.36 * scale : 0.075 * scale,
    0.02 * scale,
    mats.brass
  );
  hg.add(plate);

  const postGeo = new THREE.CylinderGeometry(0.018 * scale, 0.018 * scale, 0.065 * scale, 12);
  const post1 = new THREE.Mesh(postGeo, mats.brass);
  post1.rotation.x = Math.PI / 2;
  post1.position.set(vertical ? 0 : -0.1 * scale, vertical ? 0.1 * scale : 0, 0.032 * scale);
  hg.add(post1);

  const post2 = new THREE.Mesh(postGeo, mats.brass);
  post2.rotation.x = Math.PI / 2;
  post2.position.set(vertical ? 0 : 0.1 * scale, vertical ? -0.1 * scale : 0, 0.032 * scale);
  hg.add(post2);

  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022 * scale, 0.022 * scale, 0.3 * scale, 14),
    mats.brass
  );
  if (!vertical) grip.rotation.z = Math.PI / 2;
  grip.position.set(0, 0, 0.068 * scale);
  hg.add(grip);

  return hg;
}

// ============================================================================
// STEP 3: DEDICATED MULTI-PART 3D GEOMETRY BUILDERS FOR ALL 10 CATEGORIES
// ============================================================================
function buildCategoryModel(categoryKey, mats, interactivePivots, analysis) {
  const root = new THREE.Group();
  const panelRows = analysis?.panelSubdivisions >= 4 ? 3 : 2;

  // --------------------------------------------------------------------------
  // 1. WOODEN DOORS ('door') — Multi-Part Architectural Door & Uluwahu Frame
  // --------------------------------------------------------------------------
  if (categoryKey === 'door') {
    const frameW = 2.46;
    const frameH = 4.48;
    const frameD = 0.36;
    const jambThick = 0.17;

    // Left & Right Rabbeted Door Frame Jambs (Uluwahu)
    [-1, 1].forEach((side) => {
      const jambX = side * (frameW / 2 - jambThick / 2);
      const jamb = createMeshBox(jambThick, frameH, frameD, mats.wood);
      jamb.position.set(jambX, -0.18, 0);
      root.add(jamb);

      // Stepped Decorative Architrave Casing on both Front & Back
      [-1, 1].forEach((zSide) => {
        const casing = createMeshBox(0.09, frameH + 0.08, 0.04, mats.darkWood);
        casing.position.set(jambX + side * 0.04, -0.18, zSide * (frameD / 2 + 0.02));
        root.add(casing);
      });
    });

    // Top Header Lintel & Projecting Crown Cornice
    const header = createMeshBox(frameW + 0.18, jambThick * 1.15, frameD + 0.08, mats.hWood);
    header.position.set(0, frameH / 2 - 0.18 + jambThick * 0.4, 0);
    root.add(header);

    const crownCornice = createMeshBox(frameW + 0.32, 0.1, frameD + 0.18, mats.darkWood);
    crownCornice.position.set(0, frameH / 2 - 0.18 + jambThick * 0.95, 0);
    root.add(crownCornice);

    // Bottom Hardwood Threshold Sill
    const threshold = createMeshBox(frameW + 0.16, 0.11, frameD + 0.12, mats.darkWood);
    threshold.position.set(0, -frameH / 2 - 0.18, 0);
    root.add(threshold);

    // Hinged Multi-Part 3D Door Leaf Assembly
    const doorW = frameW - jambThick * 2 - 0.02;
    const doorH = frameH - jambThick * 0.8;
    const doorD = 0.22;

    const pivot = new THREE.Group();
    pivot.position.set(-doorW / 2, -0.18, 0);
    root.add(pivot);
    interactivePivots.push({ group: pivot, openRotY: -Math.PI * 0.4 });

    const doorAssembly = create3DFramedCarpentryDoor(doorW, doorH, doorD, mats, {
      rows: panelRows,
      cols: 2,
      stileW: 0.19,
      railH: 0.22,
      hasArchBoss: true
    });
    doorAssembly.position.set(doorW / 2, 0, 0);
    pivot.add(doorAssembly);

    // Front (0°) & Back (180°) Brass Lever Handles
    const frontHandle = createBrassHandle(mats, 1.15, true);
    frontHandle.position.set(doorW - 0.16, -0.08, doorD / 2 + 0.02);
    pivot.add(frontHandle);

    const backHandle = createBrassHandle(mats, 1.15, true);
    backHandle.rotation.y = Math.PI;
    backHandle.position.set(doorW - 0.16, -0.08, -doorD / 2 - 0.02);
    pivot.add(backHandle);

    // Right Edge (90°) Brass Mortise Lock Faceplate, Latch & Deadbolt
    const lockPlate = createMeshBox(0.016, 0.62, 0.11, mats.brass);
    lockPlate.position.set(doorW + 0.008, -0.08, 0);
    pivot.add(lockPlate);

    const latchBolt = createMeshBox(0.035, 0.09, 0.045, mats.brass);
    latchBolt.position.set(doorW + 0.02, 0.04, 0);
    pivot.add(latchBolt);

    const deadBolt = createMeshBox(0.04, 0.12, 0.05, mats.brass);
    deadBolt.position.set(doorW + 0.022, -0.15, 0);
    pivot.add(deadBolt);

    // Left Edge (270°) 3 Brass Barrel Hinges
    [-1.45, 0, 1.45].forEach((hy) => {
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.034, 0.3, 16),
        mats.brass
      );
      barrel.position.set(0, hy, doorD / 2 + 0.01);
      pivot.add(barrel);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 2. PANTRY CUPBOARDS ('pantry') — Full Modular Lower & Upper Kitchen Pantry
  // --------------------------------------------------------------------------
  if (categoryKey === 'pantry') {
    const totalW = 3.5;
    const lowerH = 1.62;
    const lowerD = 1.45;
    const lowerY = -1.36;

    // 1. Recessed Toe-Kick Plinth
    const plinth = createMeshBox(totalW - 0.12, 0.18, lowerD - 0.14, mats.darkWood);
    plinth.position.set(0, -2.26, -0.04);
    root.add(plinth);

    // 2. Lower Cabinet Structural Carcass (Framed Left/Right Sides, Interior Shelf, Multi-Panel Framed Rear Back)
    const wallThick = 0.08;
    const bottomBoard = createMeshBox(totalW, wallThick, lowerD, mats.hWood);
    bottomBoard.position.set(0, lowerY - lowerH / 2 + wallThick / 2, 0);
    root.add(bottomBoard);

    const midShelf = createMeshBox(totalW - wallThick * 2, 0.06, lowerD - 0.16, mats.hWood);
    midShelf.position.set(0, lowerY - 0.15, -0.02);
    root.add(midShelf);

    // Framed Left (270°) & Right (90°) Side Panels with 3D Wainscoting
    [-1, 1].forEach((side) => {
      const sidePanel = create3DFramedCarpentryDoor(lowerD, lowerH, wallThick, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.14,
        railH: 0.14
      });
      sidePanel.rotation.y = Math.PI / 2;
      sidePanel.position.set(side * (totalW / 2 - wallThick / 2), lowerY, 0);
      root.add(sidePanel);
    });

    // Framed 3-Bay Rear Architectural Back Wall (180° View)
    const lowerBack = create3DFramedCarpentryDoor(totalW, lowerH, wallThick, mats, {
      rows: 1,
      cols: 2,
      stileW: 0.16,
      railH: 0.16
    });
    lowerBack.position.set(0, lowerY, -lowerD / 2 + wallThick / 2);
    root.add(lowerBack);

    // 3. Overhanging Granite/Timber Countertop + Recessed Sink & Brass Faucet
    const counterSlab = createMeshBox(totalW + 0.16, 0.11, lowerD + 0.16, mats.counter);
    counterSlab.position.set(0, -0.5, 0.02);
    root.add(counterSlab);

    // Brass Gooseneck Kitchen Faucet on Countertop
    const faucetSpout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.028, 0.42, 14),
      mats.brass
    );
    faucetSpout.position.set(0.95, -0.24, -0.35);
    root.add(faucetSpout);

    const faucetNeck = createMeshBox(0.04, 0.04, 0.24, mats.brass);
    faucetNeck.position.set(0.95, -0.04, -0.25);
    root.add(faucetNeck);

    // 4. Three Top Drawers with 3D Framed Bevel Fronts
    const bayW = (totalW - 0.22) / 3;
    [-1, 0, 1].forEach((idx) => {
      const dx = idx * (bayW + 0.04);
      const drawerFront = create3DFramedCarpentryDoor(bayW, 0.34, 0.08, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.07,
        railH: 0.06
      });
      drawerFront.position.set(dx, -0.78, lowerD / 2 + 0.03);
      root.add(drawerFront);

      const pull = createBrassHandle(mats, 0.62, false);
      pull.position.set(dx, -0.78, lowerD / 2 + 0.08);
      root.add(pull);
    });

    // 5. Three Hinged Lower Pantry Cupboard Doors (Multi-Part 3D Framed Doors)
    [-1, 0, 1].forEach((idx) => {
      const dx = idx * (bayW + 0.04);
      const dPivot = new THREE.Group();
      dPivot.position.set(dx - bayW / 2, -1.55, lowerD / 2);
      root.add(dPivot);
      if (idx === -1) interactivePivots.push({ group: dPivot, openRotY: -Math.PI * 0.42 });
      if (idx === 1) interactivePivots.push({ group: dPivot, openRotY: Math.PI * 0.42 });

      const doorMesh = create3DFramedCarpentryDoor(bayW, 1.08, 0.085, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.11,
        railH: 0.11,
        hasArchBoss: true
      });
      doorMesh.position.set(bayW / 2, 0, 0.04);
      dPivot.add(doorMesh);

      const handle = createBrassHandle(mats, 0.72, true);
      handle.position.set(idx === -1 ? bayW - 0.11 : 0.11, 0.14, 0.09);
      dPivot.add(handle);
    });

    // 6. Architectural Panelled Backsplash Column
    const backSplash = create3DFramedCarpentryDoor(totalW - 0.06, 0.94, 0.1, mats, {
      rows: 1,
      cols: 2,
      stileW: 0.12,
      railH: 0.1
    });
    backSplash.position.set(0, 0.02, -lowerD / 2 + 0.08);
    root.add(backSplash);

    // 7. Upper Wall-Mounted Pantry Cupboard Assembly
    const upperH = 1.42;
    const upperD = 0.92;
    const upperY = 1.18;
    const upperZ = -0.26;

    const uTop = createMeshBox(totalW, 0.08, upperD, mats.hWood);
    uTop.position.set(0, upperY + upperH / 2 - 0.04, upperZ);
    root.add(uTop);

    const uBottom = createMeshBox(totalW, 0.08, upperD, mats.hWood);
    uBottom.position.set(0, upperY - upperH / 2 + 0.04, upperZ);
    root.add(uBottom);

    const uShelf = createMeshBox(totalW - 0.16, 0.05, upperD - 0.12, mats.hWood);
    uShelf.position.set(0, upperY, upperZ);
    root.add(uShelf);

    [-1, 1].forEach((side) => {
      const uSide = create3DFramedCarpentryDoor(upperD, upperH, 0.08, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.1,
        railH: 0.1
      });
      uSide.rotation.y = Math.PI / 2;
      uSide.position.set(side * (totalW / 2 - 0.04), upperY, upperZ);
      root.add(uSide);
    });

    const uBack = create3DFramedCarpentryDoor(totalW, upperH, 0.08, mats, {
      rows: 1,
      cols: 2,
      stileW: 0.14,
      railH: 0.14
    });
    uBack.position.set(0, upperY, upperZ - upperD / 2 + 0.04);
    root.add(uBack);

    // Projecting Upper Crown Moulding
    const crown = createMeshBox(totalW + 0.22, 0.14, upperD + 0.16, mats.darkWood);
    crown.position.set(0, upperY + upperH / 2 + 0.06, upperZ + 0.03);
    root.add(crown);

    // 3 Upper Hinged Pantry Doors (Center Glass Display Sash + Left/Right Carved Wood Doors)
    [-1, 0, 1].forEach((idx) => {
      const dx = idx * (bayW + 0.04);
      const uPivot = new THREE.Group();
      uPivot.position.set(dx - bayW / 2, upperY, upperZ + upperD / 2);
      root.add(uPivot);
      if (idx === 0) interactivePivots.push({ group: uPivot, openRotY: -Math.PI * 0.4 });

      const uDoor = create3DFramedCarpentryDoor(bayW, upperH - 0.12, 0.08, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.1,
        railH: 0.1,
        useGlassUpper: idx === 0,
        hasArchBoss: idx !== 0
      });
      uDoor.position.set(bayW / 2, 0, 0.04);
      uPivot.add(uDoor);

      const handle = createBrassHandle(mats, 0.68, true);
      handle.position.set(bayW - 0.11, -0.36, 0.09);
      uPivot.add(handle);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 3. KITCHEN CABINETS ('kitchen_cabinet') — Modular Island / Base Cabinet
  // --------------------------------------------------------------------------
  if (categoryKey === 'kitchen_cabinet') {
    const cabW = 3.55;
    const cabH = 2.2;
    const cabD = 1.62;
    const cabY = -0.32;

    // 4 Turned Solid Wood Bun Feet
    [
      [-cabW / 2 + 0.2, -1.58, cabD / 2 - 0.2],
      [cabW / 2 - 0.2, -1.58, cabD / 2 - 0.2],
      [-cabW / 2 + 0.2, -1.58, -cabD / 2 + 0.2],
      [cabW / 2 - 0.2, -1.58, -cabD / 2 + 0.2]
    ].forEach(([fx, fy, fz]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.08, 0.32, 18),
        mats.darkWood
      );
      foot.position.set(fx, fy, fz);
      root.add(foot);
    });

    // Bottom Board & Interior Shelf
    const bottom = createMeshBox(cabW, 0.1, cabD, mats.hWood);
    bottom.position.set(0, cabY - cabH / 2 + 0.05, 0);
    root.add(bottom);

    const shelf = createMeshBox(cabW - 0.16, 0.06, cabD - 0.16, mats.hWood);
    shelf.position.set(0, cabY, 0);
    root.add(shelf);

    // Framed Left (270°) & Right (90°) Side Panels
    [-1, 1].forEach((side) => {
      const sPanel = create3DFramedCarpentryDoor(cabD, cabH, 0.09, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.14,
        railH: 0.14,
        hasArchBoss: true
      });
      sPanel.rotation.y = Math.PI / 2;
      sPanel.position.set(side * (cabW / 2 - 0.045), cabY, 0);
      root.add(sPanel);
    });

    // Framed Rear Island Back Wall (180° View)
    const rearWall = create3DFramedCarpentryDoor(cabW, cabH, 0.09, mats, {
      rows: 1,
      cols: 2,
      stileW: 0.15,
      railH: 0.15,
      hasArchBoss: true
    });
    rearWall.position.set(0, cabY, -cabD / 2 + 0.045);
    root.add(rearWall);

    // Thick Overhanging Butcher-Block Hardwood Countertop with Moulded Edge
    const topSlab = createMeshBox(cabW + 0.24, 0.15, cabD + 0.24, mats.hWood);
    topSlab.position.set(0, cabY + cabH / 2 + 0.07, 0);
    root.add(topSlab);

    const topInlay = createMeshBox(cabW - 0.12, 0.04, cabD - 0.12, mats.carvedPanel);
    topInlay.position.set(0, cabY + cabH / 2 + 0.15, 0);
    root.add(topInlay);

    // Left & Right Hinged 5-Piece Doors + Center Bank of 3 Drawers
    const colW = (cabW - 0.26) / 3;

    const leftPivot = new THREE.Group();
    leftPivot.position.set(-cabW / 2 + 0.08, cabY, cabD / 2);
    root.add(leftPivot);
    interactivePivots.push({ group: leftPivot, openRotY: -Math.PI * 0.42 });

    const leftDoor = create3DFramedCarpentryDoor(colW, cabH - 0.18, 0.09, mats, {
      rows: 2,
      cols: 1,
      stileW: 0.11,
      railH: 0.11,
      hasArchBoss: true
    });
    leftDoor.position.set(colW / 2, 0, 0.045);
    leftPivot.add(leftDoor);
    const lHandle = createBrassHandle(mats, 0.82, true);
    lHandle.position.set(colW - 0.12, 0.18, 0.1);
    leftPivot.add(lHandle);

    const rightPivot = new THREE.Group();
    rightPivot.position.set(cabW / 2 - 0.08 - colW, cabY, cabD / 2);
    root.add(rightPivot);
    interactivePivots.push({ group: rightPivot, openRotY: Math.PI * 0.42 });

    const rightDoor = create3DFramedCarpentryDoor(colW, cabH - 0.18, 0.09, mats, {
      rows: 2,
      cols: 1,
      stileW: 0.11,
      railH: 0.11,
      hasArchBoss: true
    });
    rightDoor.position.set(colW / 2, 0, 0.045);
    rightPivot.add(rightDoor);
    const rHandle = createBrassHandle(mats, 0.82, true);
    rHandle.position.set(0.12, 0.18, 0.1);
    rightPivot.add(rHandle);

    // Center 3 Framed Drawers
    const dH = (cabH - 0.28) / 3;
    [-1, 0, 1].forEach((row) => {
      const dy = cabY + row * (dH + 0.04);
      const drawer = create3DFramedCarpentryDoor(colW, dH, 0.09, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.08,
        railH: 0.07
      });
      drawer.position.set(0, dy, cabD / 2 + 0.045);
      root.add(drawer);

      const dPull = createBrassHandle(mats, 0.68, false);
      dPull.position.set(0, dy, cabD / 2 + 0.1);
      root.add(dPull);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 4. WINDOWS ('window') — Architectural Frame, Glass Panes, Transom & Sashes
  // --------------------------------------------------------------------------
  if (categoryKey === 'window') {
    const winW = 3.2;
    const winH = 3.25;
    const frameD = 0.36;
    const jambThick = 0.18;

    // Outer Uluwahu Window Frame (Header, Projecting Sill, Left/Right/Center Posts, Transom Bar)
    const header = createMeshBox(winW + 0.32, jambThick * 1.15, frameD + 0.12, mats.hWood);
    header.position.set(0, winH / 2 - 0.1, 0);
    root.add(header);

    const pediment = createMeshBox(winW + 0.44, 0.1, frameD + 0.2, mats.darkWood);
    pediment.position.set(0, winH / 2 + 0.04, 0);
    root.add(pediment);

    const sill = createMeshBox(winW + 0.4, jambThick * 1.2, frameD + 0.24, mats.hWood);
    sill.position.set(0, -winH / 2 - 0.1, 0.04);
    root.add(sill);

    [-1, 1].forEach((side) => {
      const jamb = createMeshBox(jambThick, winH, frameD, mats.wood);
      jamb.position.set(side * (winW / 2 - jambThick / 2), -0.1, 0);
      root.add(jamb);
    });

    // Horizontal Transom Bar separating Top Fanlight from Casement Sashes
    const transomY = winH / 2 - 0.72;
    const transomBar = createMeshBox(winW - jambThick * 1.8, 0.14, frameD * 0.95, mats.hWood);
    transomBar.position.set(0, transomY, 0);
    root.add(transomBar);

    // Upper Transom Glass Fanlight with Vertical Muntin Bars
    const fanH = winH / 2 - 0.1 - jambThick * 0.5 - transomY - 0.07;
    const fanGlass = createMeshBox(winW - jambThick * 2, fanH, 0.04, mats.glass);
    fanGlass.position.set(0, transomY + 0.07 + fanH / 2, 0);
    root.add(fanGlass);

    [-0.9, -0.3, 0.3, 0.9].forEach((mx) => {
      const bar = createMeshBox(0.05, fanH, 0.09, mats.wood);
      bar.position.set(mx, transomY + 0.07 + fanH / 2, 0);
      root.add(bar);
    });

    // Center Vertical Mullion Post below Transom
    const sashAreaH = transomY - 0.07 - (-winH / 2 - 0.1 + jambThick * 0.6);
    const sashCenterY = (-winH / 2 - 0.1 + jambThick * 0.6) + sashAreaH / 2;

    const centerMullion = createMeshBox(0.15, sashAreaH, frameD * 0.92, mats.wood);
    centerMullion.position.set(0, sashCenterY, 0);
    root.add(centerMullion);

    // Twin Hinged Casement Sashes (Upper Glass Panes + Lower Carved Reference Timber Panel)
    const sashW = (winW - jambThick * 2 - 0.15) / 2;
    const sashD = 0.13;

    [-1, 1].forEach((dir) => {
      const sPivot = new THREE.Group();
      const pivotX = dir === -1 ? -winW / 2 + jambThick : winW / 2 - jambThick;
      sPivot.position.set(pivotX, sashCenterY, 0.02);
      root.add(sPivot);
      interactivePivots.push({
        group: sPivot,
        openRotY: dir === -1 ? -Math.PI * 0.38 : Math.PI * 0.38
      });

      const sashDoor = create3DFramedCarpentryDoor(sashW, sashAreaH - 0.04, sashD, mats, {
        rows: 2,
        cols: 1,
        stileW: 0.11,
        railH: 0.11,
        useGlassUpper: true,
        hasArchBoss: true
      });
      const offsetX = dir === -1 ? sashW / 2 : -sashW / 2;
      sashDoor.position.set(offsetX, 0, 0);
      sPivot.add(sashDoor);

      // Brass Casement Latch Handles on Front & Back
      const handleX = dir === -1 ? sashW - 0.08 : -sashW + 0.08;
      const fHandle = createBrassHandle(mats, 0.6, true);
      fHandle.position.set(handleX, 0, sashD / 2 + 0.02);
      sPivot.add(fHandle);

      const bHandle = createBrassHandle(mats, 0.6, true);
      bHandle.rotation.y = Math.PI;
      bHandle.position.set(handleX, 0, -sashD / 2 - 0.02);
      sPivot.add(bHandle);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 5. STAIRCASES ('staircase') — True 3D Steps, Risers, Stringers, Balusters & Handrails
  // --------------------------------------------------------------------------
  if (categoryKey === 'staircase') {
    const stairGroup = new THREE.Group();
    stairGroup.position.set(0, -1.85, 0.78);
    root.add(stairGroup);

    const numSteps = 6;
    const stepW = 2.15;
    const treadD = 0.52;
    const riserH = 0.5;
    const treadThick = 0.085;

    // 1. Left, Center & Right Angled Structural Stringer & Carriage Timber Beams
    [-stepW / 2 - 0.06, 0, stepW / 2 + 0.06].forEach((sx, idx) => {
      const stringerLen = Math.hypot(numSteps * treadD, numSteps * riserH) + 0.45;
      const stringer = createMeshBox(
        idx === 1 ? 0.12 : 0.14,
        idx === 1 ? 0.26 : 0.34,
        stringerLen,
        idx === 1 ? mats.darkWood : mats.wood
      );
      stringer.position.set(
        sx,
        (numSteps * riserH) / 2 - 0.22,
        -(numSteps * treadD) / 2 + 0.22
      );
      stringer.rotation.x = Math.atan2(riserH, treadD);
      stairGroup.add(stringer);
    });

    // 2. Steps: Bullnose Treads + Framed Carved Risers + Turned Balusters
    for (let i = 0; i < numSteps; i++) {
      const y = (i + 1) * riserH;
      const z = -i * treadD;

      // Solid Hardwood Tread with Carved Reference Inlay
      const tread = createMeshBox(stepW, treadThick, treadD + 0.06, mats.hWood);
      tread.position.set(0, y, z);
      stairGroup.add(tread);

      const treadInlay = createMeshBox(stepW - 0.24, 0.02, treadD - 0.08, mats.carvedPanel);
      treadInlay.position.set(0, y + treadThick / 2 + 0.005, z);
      stairGroup.add(treadInlay);

      // Rounded Bullnose Front Edge
      const bullnose = new THREE.Mesh(
        new THREE.CylinderGeometry(treadThick / 2, treadThick / 2, stepW, 16),
        mats.darkWood
      );
      bullnose.rotation.z = Math.PI / 2;
      bullnose.position.set(0, y, z + (treadD + 0.06) / 2);
      stairGroup.add(bullnose);

      // Framed Riser with Recessed Panel (Visible from both Front & Back under-stair view)
      const riser = create3DFramedCarpentryDoor(stepW - 0.04, riserH, 0.06, mats, {
        rows: 1,
        cols: 2,
        stileW: 0.1,
        railH: 0.08
      });
      riser.position.set(0, y - riserH / 2, z + treadD / 2 - 0.03);
      stairGroup.add(riser);

      // Turned Wooden Spindles / Balusters (2 per step on each side)
      [-stepW / 2 + 0.09, stepW / 2 - 0.09].forEach((bx) => {
        const spindleGroup = new THREE.Group();
        spindleGroup.position.set(bx, y + 0.66, z);

        const baseBlock = createMeshBox(0.085, 0.24, 0.085, mats.darkWood);
        baseBlock.position.set(0, -0.52, 0);
        spindleGroup.add(baseBlock);

        const turnedShaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.032, 0.045, 0.88, 16),
          mats.wood
        );
        spindleGroup.add(turnedShaft);

        const collar = new THREE.Mesh(
          new THREE.SphereGeometry(0.052, 14, 14),
          mats.brass
        );
        collar.position.set(0, 0.12, 0);
        spindleGroup.add(collar);

        stairGroup.add(spindleGroup);
      });
    }

    // 3. Top Landing Platform & Rear Support Columns (So 180° Back & Bottom views look like a real architectural stair structure)
    const topY = numSteps * riserH;
    const topZ = -(numSteps - 1) * treadD - 0.38;
    const landing = createMeshBox(stepW + 0.12, treadThick * 1.3, 0.72, mats.hWood);
    landing.position.set(0, topY, topZ);
    stairGroup.add(landing);

    // Rear Vertical Timber Support Columns under Top Landing
    [-stepW / 2 + 0.1, stepW / 2 - 0.1].forEach((cx) => {
      const supportCol = createMeshBox(0.18, topY, 0.18, mats.wood);
      supportCol.position.set(cx, topY / 2, topZ - 0.18);
      stairGroup.add(supportCol);
    });

    // Cross Bracing Beam between Rear Support Columns
    const crossBeam = create3DFramedCarpentryDoor(stepW - 0.2, 0.45, 0.1, mats, {
      rows: 1,
      cols: 2,
      stileW: 0.1,
      railH: 0.08
    });
    crossBeam.position.set(0, topY * 0.62, topZ - 0.18);
    stairGroup.add(crossBeam);

    // 4. Four Carved Box Newel Posts with Chamfered Caps & Brass Finials
    const newelCoords = [
      [-stepW / 2 + 0.09, 0.88, 0.28],
      [stepW / 2 - 0.09, 0.88, 0.28],
      [-stepW / 2 + 0.09, topY + 0.78, topZ + 0.18],
      [stepW / 2 - 0.09, topY + 0.78, topZ + 0.18]
    ];
    newelCoords.forEach(([nx, ny, nz]) => {
      const post = createMeshBox(0.22, 1.72, 0.22, mats.wood);
      post.position.set(nx, ny, nz);
      stairGroup.add(post);

      // Recessed carved flutes on front/back of newel post
      const flute = createMeshBox(0.14, 1.1, 0.24, mats.carvedPanel);
      flute.position.set(nx, ny + 0.05, nz);
      stairGroup.add(flute);

      const cap = createMeshBox(0.27, 0.08, 0.27, mats.darkWood);
      cap.position.set(nx, ny + 0.88, nz);
      stairGroup.add(cap);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 18), mats.brass);
      finial.position.set(nx, ny + 1.0, nz);
      stairGroup.add(finial);
    });

    // 5. Sloped Molded Timber Handrails
    [-stepW / 2 + 0.09, stepW / 2 - 0.09].forEach((hx) => {
      const railLen = Math.hypot(numSteps * treadD, numSteps * riserH) + 0.35;
      const handrail = createMeshBox(0.14, 0.11, railLen, mats.hWood);
      handrail.position.set(
        hx,
        (numSteps * riserH) / 2 + 1.38,
        -(numSteps * treadD) / 2 + 0.25
      );
      handrail.rotation.x = Math.atan2(riserH, treadD);
      stairGroup.add(handrail);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 6. WARDROBES ('wardrobe') — 3-Door Architectural Almariya with Interior
  // --------------------------------------------------------------------------
  if (categoryKey === 'wardrobe') {
    const wWidth = 3.1;
    const wHeight = 4.2;
    const wDepth = 1.38;

    // 1. Moulded Crown Pediment & Solid Base Plinth
    const crown = createMeshBox(wWidth + 0.24, 0.2, wDepth + 0.18, mats.darkWood);
    crown.position.set(0, wHeight / 2 - 0.1, 0);
    root.add(crown);

    const plinth = createMeshBox(wWidth + 0.12, 0.22, wDepth + 0.1, mats.darkWood);
    plinth.position.set(0, -wHeight / 2 - 0.2, 0);
    root.add(plinth);

    // 2. Wardrobe Carcass: Top, Bottom, Interior Shelves, Brass Hanging Rod, Framed Sides & Framed Back
    const bodyH = wHeight - 0.2;
    const bodyY = -0.15;

    const topBoard = createMeshBox(wWidth, 0.08, wDepth, mats.hWood);
    topBoard.position.set(0, bodyY + bodyH / 2 - 0.04, 0);
    root.add(topBoard);

    const bottomBoard = createMeshBox(wWidth, 0.08, wDepth, mats.hWood);
    bottomBoard.position.set(0, bodyY - bodyH / 2 + 0.04, 0);
    root.add(bottomBoard);

    // Interior Upper Shelf & Brass Clothes Hanging Rod (visible when doors open!)
    const upperShelf = createMeshBox(wWidth - 0.16, 0.06, wDepth - 0.14, mats.hWood);
    upperShelf.position.set(0, 1.15, -0.02);
    root.add(upperShelf);

    const hangingRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, wWidth - 0.2, 16),
      mats.brass
    );
    hangingRod.rotation.z = Math.PI / 2;
    hangingRod.position.set(0, 0.92, 0);
    root.add(hangingRod);

    const lowerDividerShelf = createMeshBox(wWidth - 0.16, 0.06, wDepth - 0.1, mats.hWood);
    lowerDividerShelf.position.set(0, -wHeight / 2 + 0.45, 0);
    root.add(lowerDividerShelf);

    // Framed Left (270°) & Right (90°) Side Panels with 2 Recessed Panels each
    [-1, 1].forEach((side) => {
      const sWall = create3DFramedCarpentryDoor(wDepth, bodyH, 0.09, mats, {
        rows: 2,
        cols: 1,
        stileW: 0.13,
        railH: 0.15,
        hasArchBoss: true
      });
      sWall.rotation.y = Math.PI / 2;
      sWall.position.set(side * (wWidth / 2 - 0.045), bodyY, 0);
      root.add(sWall);
    });

    // Framed 3-Column Rear Back Wall (180° View)
    const rearWall = create3DFramedCarpentryDoor(wWidth, bodyH, 0.09, mats, {
      rows: 2,
      cols: 2,
      stileW: 0.15,
      railH: 0.16,
      hasArchBoss: true
    });
    rearWall.position.set(0, bodyY, -wDepth / 2 + 0.045);
    root.add(rearWall);

    // 3. Three Full-Height Hinged 5-Piece Framed Wardrobe Doors
    const doorW = (wWidth - 0.22) / 3;
    const doorH = bodyH - 0.68;
    [-1, 0, 1].forEach((idx) => {
      const dx = idx * (doorW + 0.04);
      const dPivot = new THREE.Group();
      dPivot.position.set(dx - doorW / 2, 0.18, wDepth / 2 - 0.02);
      root.add(dPivot);
      if (idx === -1) interactivePivots.push({ group: dPivot, openRotY: -Math.PI * 0.42 });
      if (idx === 1) interactivePivots.push({ group: dPivot, openRotY: Math.PI * 0.42 });

      const wDoor = create3DFramedCarpentryDoor(doorW, doorH, 0.09, mats, {
        rows: 2,
        cols: 1,
        stileW: 0.11,
        railH: 0.13,
        hasArchBoss: true
      });
      wDoor.position.set(doorW / 2, 0, 0.045);
      dPivot.add(wDoor);

      const handle = createBrassHandle(mats, 0.88, true);
      handle.position.set(idx === -1 ? doorW - 0.12 : 0.12, -0.08, 0.1);
      dPivot.add(handle);
    });

    // 4. Two Deep Lower Storage Drawers
    const bDrawerW = (wWidth - 0.2) / 2;
    [-0.5, 0.5].forEach((side) => {
      const dx = side * (bDrawerW + 0.04);
      const drawer = create3DFramedCarpentryDoor(bDrawerW, 0.5, 0.09, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.09,
        railH: 0.08
      });
      drawer.position.set(dx, -wHeight / 2 + 0.16, wDepth / 2 + 0.025);
      root.add(drawer);

      const pull = createBrassHandle(mats, 0.72, false);
      pull.position.set(dx, -wHeight / 2 + 0.16, wDepth / 2 + 0.085);
      root.add(pull);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 7. BEDROOM CUPBOARDS ('bedroom_cupboard') — 2-Door Cupboard & Drawer Chest
  // --------------------------------------------------------------------------
  if (categoryKey === 'bedroom_cupboard') {
    const cWidth = 2.5;
    const cHeight = 3.8;
    const cDepth = 1.28;
    const bodyY = -0.18;

    // Top Cornice & 4 Carved Bracket Feet
    const cornice = createMeshBox(cWidth + 0.22, 0.18, cDepth + 0.16, mats.darkWood);
    cornice.position.set(0, cHeight / 2 - 0.12, 0);
    root.add(cornice);

    [
      [-cWidth / 2 + 0.18, -cHeight / 2 - 0.24, cDepth / 2 - 0.18],
      [cWidth / 2 - 0.18, -cHeight / 2 - 0.24, cDepth / 2 - 0.18],
      [-cWidth / 2 + 0.18, -cHeight / 2 - 0.24, -cDepth / 2 + 0.18],
      [cWidth / 2 - 0.18, -cHeight / 2 - 0.24, -cDepth / 2 + 0.18]
    ].forEach(([fx, fy, fz]) => {
      const foot = createMeshBox(0.22, 0.26, 0.22, mats.darkWood);
      foot.position.set(fx, fy, fz);
      root.add(foot);
    });

    // Top, Bottom & Interior Shelves
    const topB = createMeshBox(cWidth, 0.08, cDepth, mats.hWood);
    topB.position.set(0, bodyY + (cHeight - 0.16) / 2, 0);
    root.add(topB);

    const botB = createMeshBox(cWidth, 0.08, cDepth, mats.hWood);
    botB.position.set(0, bodyY - (cHeight - 0.16) / 2, 0);
    root.add(botB);

    const midShelf = createMeshBox(cWidth - 0.16, 0.06, cDepth - 0.14, mats.hWood);
    midShelf.position.set(0, 0.35, 0);
    root.add(midShelf);

    // Framed Left (270°), Right (90°) & Back (180°) Panels
    [-1, 1].forEach((side) => {
      const sWall = create3DFramedCarpentryDoor(cDepth, cHeight - 0.16, 0.09, mats, {
        rows: 2,
        cols: 1,
        stileW: 0.12,
        railH: 0.14,
        hasArchBoss: true
      });
      sWall.rotation.y = Math.PI / 2;
      sWall.position.set(side * (cWidth / 2 - 0.045), bodyY, 0);
      root.add(sWall);
    });

    const rearWall = create3DFramedCarpentryDoor(cWidth, cHeight - 0.16, 0.09, mats, {
      rows: 2,
      cols: 2,
      stileW: 0.14,
      railH: 0.15,
      hasArchBoss: true
    });
    rearWall.position.set(0, bodyY, -cDepth / 2 + 0.045);
    root.add(rearWall);

    // 2 Upper Hinged 5-Piece Framed Doors
    const doorW = (cWidth - 0.2) / 2;
    const doorH = cHeight - 1.18;
    [-1, 1].forEach((dir) => {
      const pivotX = dir === -1 ? -cWidth / 2 + 0.08 : cWidth / 2 - 0.08 - doorW;
      const dPivot = new THREE.Group();
      dPivot.position.set(pivotX, 0.25, cDepth / 2 - 0.01);
      root.add(dPivot);
      interactivePivots.push({
        group: dPivot,
        openRotY: dir === -1 ? -Math.PI * 0.42 : Math.PI * 0.42
      });

      const door = create3DFramedCarpentryDoor(doorW, doorH, 0.09, mats, {
        rows: 2,
        cols: 1,
        stileW: 0.11,
        railH: 0.12,
        hasArchBoss: true
      });
      door.position.set(doorW / 2, 0, 0.045);
      dPivot.add(door);

      const handle = createBrassHandle(mats, 0.85, true);
      handle.position.set(dir === -1 ? doorW - 0.13 : 0.13, -0.06, 0.1);
      dPivot.add(handle);
    });

    // 2 Full-Width Lower Chest Drawers
    [-1.24, -1.72].forEach((dy) => {
      const drawer = create3DFramedCarpentryDoor(cWidth - 0.18, 0.42, 0.09, mats, {
        rows: 1,
        cols: 2,
        stileW: 0.09,
        railH: 0.07
      });
      drawer.position.set(0, dy, cDepth / 2 + 0.03);
      root.add(drawer);

      [-0.55, 0.55].forEach((px) => {
        const pull = createBrassHandle(mats, 0.62, false);
        pull.position.set(px, dy, cDepth / 2 + 0.09);
        root.add(pull);
      });
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 8. TABLES ('table') — Carved Dining / Executive Table with Framed Inlay Top
  // --------------------------------------------------------------------------
  if (categoryKey === 'table') {
    const tWidth = 3.65;
    const tDepth = 2.2;
    const tHeight = 2.15;
    const topY = tHeight / 2 - 0.2;

    // 1. Multi-Part Framed Tabletop with Recessed Carved Reference Inlay
    const tableFrame = create3DFramedCarpentryDoor(tWidth, tDepth, 0.16, mats, {
      rows: 1,
      cols: 2,
      stileW: 0.22,
      railH: 0.22
    });
    tableFrame.rotation.x = Math.PI / 2;
    tableFrame.position.set(0, topY, 0);
    root.add(tableFrame);

    // Moulded Perimeter Lip
    const topEdge = createMeshBox(tWidth + 0.08, 0.08, tDepth + 0.08, mats.darkWood);
    topEdge.position.set(0, topY - 0.03, 0);
    root.add(topEdge);

    // 2. Carved Perimeter Apron Rails (Front, Back, Left, Right)
    const apronW = tWidth - 0.38;
    const apronD = tDepth - 0.38;
    const apronH = 0.28;
    const apronY = topY - 0.22;

    [-1, 1].forEach((zSide) => {
      const fbApron = create3DFramedCarpentryDoor(apronW, apronH, 0.09, mats, {
        rows: 1,
        cols: 2,
        stileW: 0.14,
        railH: 0.06
      });
      fbApron.position.set(0, apronY, zSide * (apronD / 2));
      root.add(fbApron);
    });

    [-1, 1].forEach((xSide) => {
      const lrApron = create3DFramedCarpentryDoor(apronD, apronH, 0.09, mats, {
        rows: 1,
        cols: 1,
        stileW: 0.14,
        railH: 0.06
      });
      lrApron.rotation.y = Math.PI / 2;
      lrApron.position.set(xSide * (apronW / 2), apronY, 0);
      root.add(lrApron);
    });

    // 3. Four Heavy Turned & Fluted Solid Timber Legs
    const legH = tHeight;
    [
      [-apronW / 2 + 0.06, -0.25, apronD / 2 - 0.06],
      [apronW / 2 - 0.06, -0.25, apronD / 2 - 0.06],
      [-apronW / 2 + 0.06, -0.25, -apronD / 2 + 0.06],
      [apronW / 2 - 0.06, -0.25, -apronD / 2 + 0.06]
    ].forEach(([lx, ly, lz]) => {
      const topBlock = createMeshBox(0.22, 0.42, 0.22, mats.wood);
      topBlock.position.set(lx, ly + legH / 2 - 0.22, lz);
      root.add(topBlock);

      const upperRing = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), mats.darkWood);
      upperRing.position.set(lx, ly + 0.35, lz);
      root.add(upperRing);

      const turnedCol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.075, legH - 0.55, 20),
        mats.wood
      );
      turnedCol.castShadow = true;
      turnedCol.position.set(lx, ly - 0.05, lz);
      root.add(turnedCol);

      const ferrule = new THREE.Mesh(
        new THREE.CylinderGeometry(0.078, 0.068, 0.18, 16),
        mats.brass
      );
      ferrule.position.set(lx, ly - legH / 2 + 0.09, lz);
      root.add(ferrule);
    });

    // 4. Lower H-Stretcher Support Beams
    [-1, 1].forEach((xSide) => {
      const sideStretcher = createMeshBox(0.11, 0.11, apronD - 0.12, mats.hWood);
      sideStretcher.position.set(xSide * (apronW / 2 - 0.06), -0.95, 0);
      root.add(sideStretcher);
    });

    const centerStretcher = createMeshBox(apronW - 0.12, 0.12, 0.22, mats.carvedPanel);
    centerStretcher.position.set(0, -0.95, 0);
    root.add(centerStretcher);

    return root;
  }

  // --------------------------------------------------------------------------
  // 9. CHAIRS ('chair') — Handcrafted Carved Solid Timber Armchair
  // --------------------------------------------------------------------------
  if (categoryKey === 'chair') {
    const seatW = 1.8;
    const seatD = 1.68;
    const seatY = -0.55;

    // 1. Framed Seat with Recessed Carved/Contoured Center Inlay
    const seatFrame = create3DFramedCarpentryDoor(seatW, seatD, 0.14, mats, {
      rows: 1,
      cols: 1,
      stileW: 0.18,
      railH: 0.18
    });
    seatFrame.rotation.x = Math.PI / 2;
    seatFrame.position.set(0, seatY, 0.05);
    root.add(seatFrame);

    // Seat Apron Rails
    const fApron = createMeshBox(seatW - 0.16, 0.18, 0.09, mats.hWood);
    fApron.position.set(0, seatY - 0.14, seatD / 2 - 0.02);
    root.add(fApron);

    const bApron = createMeshBox(seatW - 0.16, 0.18, 0.09, mats.hWood);
    bApron.position.set(0, seatY - 0.14, -seatD / 2 + 0.12);
    root.add(bApron);

    [-1, 1].forEach((s) => {
      const sApron = createMeshBox(0.09, 0.18, seatD - 0.16, mats.hWood);
      sApron.position.set(s * (seatW / 2 - 0.08), seatY - 0.14, 0.05);
      root.add(sApron);
    });

    // 2. Full-Height Rear Stile Posts + Brass Finials
    [-seatW / 2 + 0.1, seatW / 2 - 0.1].forEach((bx) => {
      const rearPost = createMeshBox(0.15, 3.95, 0.15, mats.wood);
      rearPost.position.set(bx, -0.22, -seatD / 2 + 0.12);
      root.add(rearPost);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), mats.brass);
      finial.position.set(bx, 1.83, -seatD / 2 + 0.12);
      root.add(finial);
    });

    // 3. Multi-Part Carved Backrest Assembly (Top Crest Rail, Vertical Splats & Central 3D Carved Panel)
    const backrestAssembly = create3DFramedCarpentryDoor(seatW - 0.34, 1.92, 0.12, mats, {
      rows: 1,
      cols: 1,
      stileW: 0.14,
      railH: 0.16,
      hasArchBoss: true
    });
    backrestAssembly.position.set(0, 0.68, -seatD / 2 + 0.12);
    root.add(backrestAssembly);

    const crestRail = createMeshBox(seatW + 0.08, 0.22, 0.18, mats.darkWood);
    crestRail.position.set(0, 1.7, -seatD / 2 + 0.12);
    root.add(crestRail);

    // 4. Turned Front Legs, Sculpted Armrests & Stretcher Rails
    [-seatW / 2 + 0.1, seatW / 2 - 0.1].forEach((fx) => {
      const frontLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.055, 1.68, 16),
        mats.wood
      );
      frontLeg.position.set(fx, -1.38, seatD / 2 - 0.06);
      root.add(frontLeg);

      const armPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.065, 0.74, 16),
        mats.wood
      );
      armPost.position.set(fx, seatY + 0.38, seatD / 2 - 0.14);
      root.add(armPost);

      const armrest = createMeshBox(0.17, 0.09, seatD - 0.02, mats.hWood);
      armrest.position.set(fx, seatY + 0.76, 0.04);
      root.add(armrest);

      const stretcher = createMeshBox(0.08, 0.09, seatD - 0.18, mats.hWood);
      stretcher.position.set(fx, -1.65, 0.04);
      root.add(stretcher);
    });

    const frontStretcher = createMeshBox(seatW - 0.2, 0.09, 0.08, mats.hWood);
    frontStretcher.position.set(0, -1.65, seatD / 2 - 0.06);
    root.add(frontStretcher);

    return root;
  }

  // --------------------------------------------------------------------------
  // 10. CUSTOM WOODEN FURNITURE ('custom_furniture') — Carved Credenza & Hutch
  // --------------------------------------------------------------------------
  const unitW = 3.25;
  const unitD = 1.3;

  // Base Plinth & Lower Credenza Carcass
  const basePlinth = createMeshBox(unitW + 0.16, 0.2, unitD + 0.12, mats.darkWood);
  basePlinth.position.set(0, -2.15, 0);
  root.add(basePlinth);

  const lowerH = 1.65;
  const lowerY = -1.22;

  [-1, 1].forEach((side) => {
    const sWall = create3DFramedCarpentryDoor(unitD, lowerH, 0.09, mats, {
      rows: 1,
      cols: 1,
      stileW: 0.12,
      railH: 0.12
    });
    sWall.rotation.y = Math.PI / 2;
    sWall.position.set(side * (unitW / 2 - 0.045), lowerY, 0);
    root.add(sWall);
  });

  const lowerBack = create3DFramedCarpentryDoor(unitW, lowerH, 0.09, mats, {
    rows: 1,
    cols: 2,
    stileW: 0.14,
    railH: 0.14
  });
  lowerBack.position.set(0, lowerY, -unitD / 2 + 0.045);
  root.add(lowerBack);

  const lowerShelf = createMeshBox(unitW - 0.16, 0.06, unitD - 0.14, mats.hWood);
  lowerShelf.position.set(0, lowerY, 0);
  root.add(lowerShelf);

  // 2 Hinged Lower Framed Credenza Doors
  const cDoorW = (unitW - 0.22) / 2;
  [-1, 1].forEach((dir) => {
    const px = dir === -1 ? -unitW / 2 + 0.08 : unitW / 2 - 0.08 - cDoorW;
    const cPivot = new THREE.Group();
    cPivot.position.set(px, lowerY, unitD / 2 - 0.01);
    root.add(cPivot);
    interactivePivots.push({
      group: cPivot,
      openRotY: dir === -1 ? -Math.PI * 0.4 : Math.PI * 0.4
    });

    const cDoor = create3DFramedCarpentryDoor(cDoorW, 1.48, 0.09, mats, {
      rows: 1,
      cols: 2,
      stileW: 0.11,
      railH: 0.11,
      hasArchBoss: true
    });
    cDoor.position.set(cDoorW / 2, 0, 0.045);
    cPivot.add(cDoor);

    const handle = createBrassHandle(mats, 0.78, true);
    handle.position.set(dir === -1 ? cDoorW - 0.13 : 0.13, 0.1, 0.1);
    cPivot.add(handle);
  });

  // Middle Countertop Ledge
  const midLedge = createMeshBox(unitW + 0.22, 0.13, unitD + 0.2, mats.hWood);
  midLedge.position.set(0, -0.34, 0);
  root.add(midLedge);

  // Upper Architectural Carved Hutch & Display Shelf
  const upperShowcase = create3DFramedCarpentryDoor(unitW - 0.24, 2.05, 0.26, mats, {
    rows: 2,
    cols: 2,
    stileW: 0.14,
    railH: 0.14,
    hasArchBoss: true
  });
  upperShowcase.position.set(0, 0.74, -0.2);
  root.add(upperShowcase);

  const displayShelf = createMeshBox(unitW - 0.32, 0.07, 0.55, mats.hWood);
  displayShelf.position.set(0, 0.65, 0.12);
  root.add(displayShelf);

  // Turned Fluted Columns framing the upper hutch
  [-unitW / 2 + 0.18, unitW / 2 - 0.18].forEach((cx) => {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.095, 2.05, 20),
      mats.wood
    );
    col.position.set(cx, 0.74, 0.28);
    root.add(col);
  });

  const topCornice = createMeshBox(unitW + 0.18, 0.18, 0.85, mats.darkWood);
  topCornice.position.set(0, 1.84, 0.04);
  root.add(topCornice);

  return root;
}

// ============================================================================
// MAIN REACT COMPONENT: ThreeCarpentryViewer
// ============================================================================
export default function ThreeCarpentryViewer({
  woodType = 'teak',
  finish = 'natural',
  selectedWork = 'door',
   onSelectWork = null,
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
  const turntableRef = useRef(null);
  const modelRootRef = useRef(null);
  const interactivePivotsRef = useRef([]);

  // Loaded customer/catalogue image & extracted computer-vision reference analysis
  const [loadedImage, setLoadedImage] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [usePhotoTimberTone, setUsePhotoTimberTone] = useState(false);

  // Viewer Orbit & Animation States (Default slightly angled 3D view so depth & structure are immediately obvious!)
  const [rotationY, setRotationY] = useState(26);
  const [rotationX, setRotationX] = useState(12);
  const [zoom, setZoom] = useState(1);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('iso');

  const categoryKey = normalizeCategoryKey(selectedWork);

  // Drag tracking
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotY: 0, rotX: 0 });

  // Load and analyze active design image asynchronously for 3D generation
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

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const widthPx = container.clientWidth || 640;
    const heightPx = container.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, widthPx / heightPx, 0.1, 100);
    camera.position.set(0, 0.1, 8.2);
    camera.lookAt(0, -0.35, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4-Point Studio Architectural Lighting (Highlights 3D depth, bevels & bump maps on all 6 sides)
    const ambientLight = new THREE.AmbientLight(0xfff6eb, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.25);
    keyLight.position.set(6, 9, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const backLight = new THREE.DirectionalLight(0xffe4c4, 1.6);
    backLight.position.set(-6, 5, -8);
    scene.add(backLight);

    const sideRimLight = new THREE.DirectionalLight(0xfde68a, 1.25);
    sideRimLight.position.set(-8, 2, 4);
    scene.add(sideRimLight);

    const underFillLight = new THREE.DirectionalLight(0xfde68a, 1.0);
    underFillLight.position.set(0, -8, 4);
    scene.add(underFillLight);

    // Turntable Pedestal Assembly
    const turntableGroup = new THREE.Group();
    turntableRef.current = turntableGroup;
    scene.add(turntableGroup);

    const cylinderGeo = new THREE.CylinderGeometry(2.6, 2.75, 0.18, 64);
    const cylinderMat = new THREE.MeshStandardMaterial({
      color: 0x1e1108,
      roughness: 0.42,
      metalness: 0.12
    });
    const turntableMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    turntableMesh.position.y = -2.48;
    turntableMesh.receiveShadow = true;
    turntableGroup.add(turntableMesh);

    const brassRingGeo = new THREE.TorusGeometry(2.46, 0.032, 16, 64);
    const brassRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85
    });
    const brassRing = new THREE.Mesh(brassRingGeo, brassRingMat);
    brassRing.rotation.x = Math.PI / 2;
    brassRing.position.y = -2.38;
    turntableGroup.add(brassRing);

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
      camera.lookAt(0, -0.35, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      cylinderGeo.dispose();
      cylinderMat.dispose();
      brassRingGeo.dispose();
      brassRingMat.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Construct 3D Carpentry Product Model whenever category, wood, finish, or reference image changes
  useEffect(() => {
    const turntable = turntableRef.current;
    const renderer = rendererRef.current;
    if (!turntable || !renderer) return;

    if (modelRootRef.current) {
      turntable.remove(modelRootRef.current);
      modelRootRef.current.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      modelRootRef.current = null;
    }
    interactivePivotsRef.current = [];

    const maxAniso = renderer.capabilities.getMaxAnisotropy() || 4;
    const { mats, disposeAll } = createReferenceDriven3DMaterials(
      woodType,
      finish,
      loadedImage,
      imageAnalysis,
      usePhotoTimberTone,
      maxAniso
    );

    const pivots = [];
    const newModel = buildCategoryModel(categoryKey, mats, pivots, imageAnalysis);
    modelRootRef.current = newModel;
    interactivePivotsRef.current = pivots;

    pivots.forEach((p) => {
      p.group.rotation.y = isDoorOpen ? p.openRotY : 0;
    });

    turntable.add(newModel);

    return () => {
      disposeAll();
    };
  }, [categoryKey, woodType, finish, loadedImage, imageAnalysis, usePhotoTimberTone]);

  // Apply 360° Yaw, Vertical Pitch (-85° to +85°), and Zoom
  useEffect(() => {
    if (turntableRef.current) {
      turntableRef.current.rotation.y = (rotationY * Math.PI) / 180;
      turntableRef.current.rotation.x = (rotationX * Math.PI) / 180;
    }
    if (cameraRef.current) {
      cameraRef.current.position.z = 8.2 / zoom;
      cameraRef.current.lookAt(0, -0.35, 0);
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

  // Swing Open / Close Doors & Sashes
  useEffect(() => {
    interactivePivotsRef.current.forEach((p) => {
      p.group.rotation.y = isDoorOpen ? p.openRotY : 0;
    });
  }, [isDoorOpen]);

  // Pointer Orbit Drag Handlers
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('.no-drag')) {
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

  const setPresetAngle = (preset, y, x = 0) => {
    setActivePreset(preset);
    setIsAutoSpin(false);
    setRotationY(y);
    setRotationX(x);
  };

  const getVisibleSideInfo = (degY, degX) => {
    if (degX >= 55) {
      return {
        label: 'Top View (Overhead)',
        badge: 'bg-cyan-400 text-stone-950',
        hint: 'Inspecting 3D crown cornice, countertop slab & upper joinery'
      };
    }
    if (degX <= -55) {
      return {
        label: 'Bottom View (Underside)',
        badge: 'bg-rose-400 text-stone-950',
        hint: 'Inspecting 3D base plinth, threshold sill, legs & support beams'
      };
    }
    const norm = ((degY % 360) + 360) % 360;
    if (norm >= 315 || norm < 45) {
      return {
        label: 'Front View (0°)',
        badge: 'bg-amber-400 text-stone-950',
        hint: '3D stiles, rails, bevelled frames & carved reference panels'
      };
    }
    if (norm >= 45 && norm < 135) {
      return {
        label: 'Right-Side View (90°)',
        badge: 'bg-emerald-400 text-stone-950',
        hint: `3D side frame profile (${height} cm depth), wainscoting & mortise hardware`
      };
    }
    if (norm >= 135 && norm < 225) {
      return {
        label: 'Back View (180°)',
        badge: 'bg-blue-400 text-stone-950',
        hint: '3D rear architectural stiles, rails & recessed hardwood backing panels'
      };
    }
    return {
      label: 'Left-Side View (270°)',
      badge: 'bg-purple-400 text-stone-950',
      hint: '3D left side casing, structural stiles & solid brass hinges'
    };
  };

  const visibleSide = getVisibleSideInfo(rotationY, rotationX);
  const hasInteractiveDoors = [
    'door',
    'pantry',
    'kitchen_cabinet',
    'window',
    'wardrobe',
    'bedroom_cupboard',
    'custom_furniture'
  ].includes(categoryKey);

  const activeCategoryObj =
    CARPENTRY_CATEGORIES.find((c) => c.id === categoryKey) || CARPENTRY_CATEGORIES[0];

  const viewPresets = [
    { id: 'front', label: 'Front (0°)', y: 0, x: 0 },
    { id: 'right', label: 'Right (90°)', y: 90, x: 0 },
    { id: 'back', label: 'Back (180°)', y: 180, x: 0 },
    { id: 'left', label: 'Left (270°)', y: 270, x: 0 },
    { id: 'top', label: 'Top View', y: 0, x: 82 },
    { id: 'bottom', label: 'Bottom View', y: 0, x: -82 },
    { id: 'iso', label: '3D Tilt', y: 32, x: 16 }
  ];

  return (
    <div
      className={`relative w-full ${
        isStudio ? 'h-full' : 'h-[480px] sm:h-[540px] lg:h-[580px] xl:h-[620px]'
      } flex flex-col justify-between overflow-hidden select-none`}
    >
      {/* 1. 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-10"
      />

      {/* 2. Top Interactive HUD & 7 View Presets */}
      <div
        className="relative z-30 flex flex-wrap items-center justify-between gap-2 p-3 pointer-events-auto no-drag"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {/* Auto-Spin Toggle Badge */}
          <button
            type="button"
            onClick={() => setIsAutoSpin((prev) => !prev)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md transition-all cursor-pointer ${
              isAutoSpin
                ? 'bg-amber-400 text-stone-950 border-2 border-white ring-2 ring-amber-400/50 shadow-amber-400/40 font-black'
                : 'bg-black/75 text-amber-300 border border-white/20 hover:bg-black/90'
            }`}
            title="Click to toggle 360° Auto-Spin"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} />
            <span>{isAutoSpin ? '360° Spinning' : '360° Orbit'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isAutoSpin ? 'bg-emerald-400 animate-ping' : 'bg-amber-400/70'
              }`}
            />
          </button>

          {/* In-Viewer 3D Product Geometry Switcher */}
          {onSelectWork && (
            <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-amber-400/40 rounded-full px-2.5 py-1">
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

        {/* All 7 View Presets: Front, Right, Back, Left, Top, Bottom, 3D Tilt */}
        <div
          className="hidden xl:flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-xs"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="text-amber-300 font-mono font-bold text-[11px] mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{Math.round(rotationY)}°</span>
          </span>

          {viewPresets.map((vp) => {
            const isActive =
              activePreset === vp.id ||
              (rotationY === vp.y && Math.abs(rotationX - vp.x) <= 4);
            return (
              <button
                key={vp.id}
                type="button"
                onClick={() => setPresetAngle(vp.id, vp.y, vp.x)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 font-black shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {vp.label}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Match Photo Timber Color, Open/Close Doors, Step Rotate & Fullscreen */}
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setUsePhotoTimberTone((prev) => !prev)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              usePhotoTimberTone
                ? 'bg-amber-500 text-stone-950 border-white font-black'
                : 'bg-black/75 text-amber-200 border-white/20 hover:bg-black/90'
            }`}
            title="Toggle between selected wood species or timber tone extracted from uploaded photo"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">
              {usePhotoTimberTone ? 'Photo Wood Tone' : 'Species Wood'}
            </span>
          </button>

          {hasInteractiveDoors && (
            <button
              type="button"
              onClick={() => setIsDoorOpen((prev) => !prev)}
              onPointerDown={(e) => e.stopPropagation()}
              className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isDoorOpen
                  ? 'bg-emerald-400 text-stone-950 border-white font-black'
                  : 'bg-black/75 text-amber-300 border-white/20 hover:bg-black'
              }`}
              title="Open / Close 3D doors or window sashes"
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
            onClick={() => {
              setIsAutoSpin(false);
              setRotationY((prev) => (prev - 20 + 360) % 360);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-black/75 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-black/90 flex items-center justify-center text-xs cursor-pointer"
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
            className="w-7 h-7 rounded-full bg-black/75 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-black/90 flex items-center justify-center text-xs cursor-pointer"
            title="Rotate Right (+20°)"
          >
            <RotateCw className="w-3.5 h-3.5" />
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

      {/* 3. Corner Reference Badge (Shows the uploaded/selected reference photo used to generate the 3D model) */}
      {activeImage && (
        <div
          className="absolute left-3 top-16 z-20 hidden sm:flex items-center gap-2.5 bg-black/80 backdrop-blur-md border border-amber-500/30 p-2 rounded-2xl shadow-xl pointer-events-none"
        >
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-amber-400/50 shrink-0">
            <img src={activeImage} alt="Design Reference" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-0.5 rounded-tl">
              <CheckCircle2 className="w-2.5 h-2.5" />
            </div>
          </div>
          <div className="pr-1">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400 block">
              Design Reference Active
            </span>
            <span className="text-[11px] font-black text-white block">
              3D {activeCategoryObj.label} Model
            </span>
            <span className="text-[9px] text-amber-200/75 block">
              3D Relief + Multi-Part Joinery
            </span>
          </div>
        </div>
      )}

      {/* 4. Real-Time Active Side Callout */}
      <div className="relative z-20 self-center flex flex-col items-center gap-1 pointer-events-none select-none mt-auto mb-1">
        <div className="bg-black/80 backdrop-blur-md text-white border border-white/25 px-3.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-2 shadow-lg">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${visibleSide.badge}`}>
            {visibleSide.label}
          </span>
          <span className="text-amber-200/90 hidden sm:inline">• {visibleSide.hint}</span>
        </div>
        <div className="text-[10px] text-amber-300/80 bg-black/60 px-2.5 py-0.5 rounded-full font-mono">
          Drag horizontally (360°) or vertically (Top/Bottom) • 3D {activeCategoryObj.label} ({height} cm)
        </div>
      </div>

      {/* 5. Bottom Controls: Preset Bar + Model Specs + Zoom */}
      <div
        className="relative z-30 flex flex-wrap items-center justify-between gap-2 p-3 pointer-events-auto no-drag"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Mobile/Tablet/Laptop 7-Angle Switcher */}
        <div className="flex xl:hidden items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1">
          {viewPresets.map((vp) => {
            const isActive =
              activePreset === vp.id ||
              (rotationY === vp.y && Math.abs(rotationX - vp.x) <= 4);
            return (
              <button
                key={vp.id}
                type="button"
                onClick={() => setPresetAngle(vp.id, vp.y, vp.x)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black font-black'
                    : 'bg-black/65 text-gray-300 border border-white/15'
                }`}
              >
                {vp.label}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-amber-200/80 bg-black/65 px-3 py-1 rounded-full border border-white/15">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-amber-400">{designTitle || activeCategoryObj.label}</span>
          <span>•</span>
          <span>H: {length}cm</span>
          <span>•</span>
          <span>W: {width}cm</span>
          <span>•</span>
          <span>D: {height}cm</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/75 border border-white/20 rounded-full px-2 py-1 ml-auto">
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.max(0.7, Number((prev - 0.15).toFixed(2))))}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 hover:text-amber-400 transition-colors text-gray-300 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-bold text-amber-300 w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.min(1.9, Number((prev + 0.15).toFixed(2))))}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 hover:text-amber-400 transition-colors text-gray-300 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
