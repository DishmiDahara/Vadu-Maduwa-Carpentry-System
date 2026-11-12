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
  Sparkles
} from 'lucide-react';

// ============================================================================
// SPECIES COLOR PALETTES & PROCEDURAL HIGH-RES TEXTURE GENERATOR
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
    grainOpacity: 0.2,
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
    grainOpacity: 0.18,
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
    grainOpacity: 0.22,
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
    grainOpacity: 0.16,
    brass: '#F0D078'
  }
};

// Normalizes category keys from CustomOrderPage into one of the 10 canonical 3D builders
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
  if (key.includes('custom') || key.includes('furniture') || key.includes('general') || key.includes('ceiling') || key.includes('uluwahu')) {
    return 'custom_furniture';
  }
  return 'door';
}

// Extracts dominant warm/edge tone from uploaded image so side/back borders harmonize with it
function sampleImageAccentColor(img, fallbackHex) {
  if (!img || !img.complete || !img.naturalWidth) return fallbackHex;
  try {
    const c = document.createElement('canvas');
    c.width = 16;
    c.height = 16;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, 16, 16);
    const data = ctx.getImageData(0, 0, 16, 16).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a > 128) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
    }
    if (count === 0) return fallbackHex;
    r = Math.round((r / count) * 0.75);
    g = Math.round((g / count) * 0.75);
    b = Math.round((b / count) * 0.75);
    return `rgb(${r}, ${g}, ${b})`;
  } catch (e) {
    return fallbackHex;
  }
}

// Generates a complete suite of coordinated 3D textures for Front, Back, Sides, Top, Bottom & Wood Frame
function createCarpentryTextures(woodType, finish, loadedImage, blendTimberTint = false, anisotropy = 4) {
  const basePal = SPECIES_PALETTES[woodType] || SPECIES_PALETTES.teak;
  const pal = { ...basePal };

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

  const sampledBorder = sampleImageAccentColor(loadedImage, pal.dark);

  // Helper to paint realistic hardwood grain
  const drawHardwoodGrain = (ctx, w, h, options = {}) => {
    const { isEndGrain = false, vertical = true } = options;
    const grad = vertical
      ? ctx.createLinearGradient(0, 0, w, 0)
      : ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, pal.base);
    grad.addColorStop(0.3, pal.light);
    grad.addColorStop(0.55, pal.base);
    grad.addColorStop(0.8, pal.light);
    grad.addColorStop(1, pal.base);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (isEndGrain) {
      ctx.save();
      ctx.strokeStyle = pal.dark;
      ctx.globalAlpha = pal.grainOpacity * 1.4;
      ctx.lineWidth = 2;
      const cx = w * 0.5;
      const cy = h * 1.6;
      for (let r = 16; r < Math.max(w, h) * 2.1; r += 9 + (r % 5)) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.fillStyle = pal.dark;
    ctx.globalAlpha = pal.grainOpacity * 0.85;
    const count = 75;
    for (let i = 0; i < count; i++) {
      const pos = (i / count) * (vertical ? w : h);
      const thickness = 1.5 + ((i * 7) % 6);
      if (vertical) {
        ctx.fillRect(pos, 0, thickness, h);
      } else {
        ctx.fillRect(0, pos, w, thickness);
      }
    }

    // Cathedral arch grain waves
    ctx.strokeStyle = pal.accent;
    ctx.globalAlpha = pal.grainOpacity * 0.7;
    ctx.lineWidth = 1.2;
    const step = 14;
    const maxDim = vertical ? w : h;
    const lenDim = vertical ? h : w;
    for (let p = 0; p < maxDim; p += step) {
      ctx.beginPath();
      if (vertical) ctx.moveTo(p, 0);
      else ctx.moveTo(0, p);
      let curr = p;
      for (let q = 0; q <= lenDim; q += 36) {
        curr += Math.sin(q * 0.025 + p * 0.1) * 2.5;
        if (vertical) ctx.lineTo(curr, q);
        else ctx.lineTo(q, curr);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  // Helper to draw an uploaded image inside a realistic 3D recessed/bevelled timber frame
  const drawDesignPanel = (ctx, w, h, options = {}) => {
    const {
      borderRatio = 0.055,
      mirrorX = false,
      isBack = false,
      isSide = false,
      addMoulding = true
    } = options;

    drawHardwoodGrain(ctx, w, h, { vertical: h >= w });

    const bx = Math.round(w * borderRatio);
    const by = Math.round(h * borderRatio);
    const iw = w - bx * 2;
    const ih = h - by * 2;

    if (addMoulding) {
      // Outer mitered frame shadow & highlight
      ctx.save();
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = Math.max(4, Math.round(w * 0.008));
      ctx.strokeRect(bx - 4, by - 4, iw + 8, ih + 8);

      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx - 8, by - 8, iw + 16, ih + 16);
      ctx.restore();
    }

    if (loadedImage && loadedImage.complete && loadedImage.naturalWidth > 0) {
      ctx.save();
      // Deep bevelled shadow around inset design
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(bx - 3, by - 3, iw + 6, ih + 6);

      ctx.beginPath();
      ctx.rect(bx, by, iw, ih);
      ctx.clip();

      // Fill background with sampled color so any aspect ratio fits cleanly
      ctx.fillStyle = sampledBorder;
      ctx.fillRect(bx, by, iw, ih);

      if (mirrorX) {
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
      }

      if (isSide) {
        // For side panels: map a rich slice of the uploaded image blended with recessed timber frame
        const sliceW = Math.max(1, Math.round(loadedImage.naturalWidth * 0.25));
        const sliceX = mirrorX ? loadedImage.naturalWidth - sliceW : 0;
        ctx.globalAlpha = 0.55;
        ctx.drawImage(
          loadedImage,
          sliceX,
          0,
          sliceW,
          loadedImage.naturalHeight,
          bx,
          by,
          iw,
          ih
        );
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = pal.base;
        ctx.globalAlpha = 0.45;
        ctx.fillRect(bx, by, iw, ih);
      } else {
        // Smart cover/fit mapping that preserves image clarity & proportions
        const imgAspect = loadedImage.naturalWidth / loadedImage.naturalHeight;
        const panelAspect = iw / ih;
        let sx = 0, sy = 0, sw = loadedImage.naturalWidth, sh = loadedImage.naturalHeight;

        if (imgAspect > panelAspect * 1.35 || imgAspect < panelAspect * 0.65) {
          // When aspect ratios differ significantly, draw a blurred ambient wood-matched backdrop + full crisp image
          ctx.save();
          ctx.globalAlpha = 0.45;
          ctx.drawImage(loadedImage, bx, by, iw, ih);
          ctx.fillStyle = 'rgba(20, 10, 4, 0.35)';
          ctx.fillRect(bx, by, iw, ih);
          ctx.restore();

          let dw = iw, dh = ih, dx = bx, dy = by;
          if (imgAspect > panelAspect) {
            dh = iw / imgAspect;
            dy = by + (ih - dh) / 2;
          } else {
            dw = ih * imgAspect;
            dx = bx + (iw - dw) / 2;
          }
          ctx.drawImage(loadedImage, 0, 0, sw, sh, dx, dy, dw, dh);
        } else {
          // Close aspect ratio: clean center crop fill
          if (imgAspect > panelAspect) {
            sw = loadedImage.naturalHeight * panelAspect;
            sx = (loadedImage.naturalWidth - sw) / 2;
          } else {
            sh = loadedImage.naturalWidth / panelAspect;
            sy = (loadedImage.naturalHeight - sh) / 2;
          }
          ctx.drawImage(loadedImage, sx, sy, sw, sh, bx, by, iw, ih);
        }

        // Optional subtle wood tint only if user enabled "Carved Wood Blend"
        if (blendTimberTint) {
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = pal.light;
          ctx.globalAlpha = 0.22;
          ctx.fillRect(bx, by, iw, ih);
        }

        // If back face, add subtle interior structural stiles/rails overlay so back looks like authentic rear joinery of the same design
        if (isBack) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = pal.dark;
          ctx.lineWidth = Math.max(8, Math.round(w * 0.016));
          ctx.strokeRect(bx + 6, by + 6, iw - 12, ih - 12);

          // Subtle rear inner shadow
          const rearGrad = ctx.createLinearGradient(0, by, 0, by + ih);
          rearGrad.addColorStop(0, 'rgba(0,0,0,0.16)');
          rearGrad.addColorStop(0.5, 'rgba(0,0,0,0.04)');
          rearGrad.addColorStop(1, 'rgba(0,0,0,0.18)');
          ctx.fillStyle = rearGrad;
          ctx.fillRect(bx, by, iw, ih);
        }
      }

      ctx.restore();

      // Inner bevel highlight
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx + 2, by + 2, iw - 4, ih - 4);
      ctx.restore();
    } else {
      // Fallback procedural raised hardwood panels when no image is loaded
      ctx.save();
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 8;
      ctx.strokeRect(bx, by, iw, ih);

      const pad = Math.round(Math.min(iw, ih) * 0.08);
      const pw = (iw - pad * 3) / 2;
      const ph = (ih - pad * 3) / 2;

      const drawCarvedBlock = (x, y, bw, bh) => {
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fillRect(x - 6, y - 6, bw + 12, bh + 12);
        const g = ctx.createLinearGradient(x, y, x + bw, y + bh);
        g.addColorStop(0, pal.light);
        g.addColorStop(0.5, pal.base);
        g.addColorStop(1, pal.dark);
        ctx.fillStyle = g;
        ctx.fillRect(x, y, bw, bh);
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 8, y + 8, bw - 16, bh - 16);
      };

      drawCarvedBlock(bx + pad, by + pad, pw, ph);
      drawCarvedBlock(bx + pad * 2 + pw, by + pad, pw, ph);
      drawCarvedBlock(bx + pad, by + pad * 2 + ph, pw, ph);
      drawCarvedBlock(bx + pad * 2 + pw, by + pad * 2 + ph, pw, ph);
      ctx.restore();
    }
  };

  const finalizeTexture = (canvas) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = anisotropy;
    tex.needsUpdate = true;
    return tex;
  };

  // 1. FRONT DESIGN TEXTURE (High-Res 1024x1536)
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = 1024;
  frontCanvas.height = 1536;
  drawDesignPanel(frontCanvas.getContext('2d'), 1024, 1536, {
    borderRatio: 0.045,
    mirrorX: false,
    isBack: false
  });

  // 2. BACK DESIGN TEXTURE (Coordinated 180° Reverse Side with Rear Joinery)
  const backCanvas = document.createElement('canvas');
  backCanvas.width = 1024;
  backCanvas.height = 1536;
  drawDesignPanel(backCanvas.getContext('2d'), 1024, 1536, {
    borderRatio: 0.055,
    mirrorX: true,
    isBack: true
  });

  // 3. WIDE PANEL DESIGN TEXTURE (For Tables, Cabinets, Cupboards, Stair Treads, Chair Backrests)
  const wideCanvas = document.createElement('canvas');
  wideCanvas.width = 1280;
  wideCanvas.height = 896;
  drawDesignPanel(wideCanvas.getContext('2d'), 1280, 896, {
    borderRatio: 0.045,
    mirrorX: false,
    isBack: false
  });

  // 4. SIDE PANEL TEXTURE (Matching Timber & Design Edge Profile for 90° and 270° views)
  const sideCanvas = document.createElement('canvas');
  sideCanvas.width = 512;
  sideCanvas.height = 1536;
  drawDesignPanel(sideCanvas.getContext('2d'), 512, 1536, {
    borderRatio: 0.08,
    isSide: true
  });

  // 5. PURE SOLID HARDWOOD GRAIN (For structural stiles, rails, legs, balusters, frames)
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 1024;
  drawHardwoodGrain(woodCanvas.getContext('2d'), 512, 1024, { vertical: true });

  // 6. END-GRAIN TIMBER TEXTURE (For Top & Bottom edges)
  const endCanvas = document.createElement('canvas');
  endCanvas.width = 512;
  endCanvas.height = 512;
  drawHardwoodGrain(endCanvas.getContext('2d'), 512, 512, { isEndGrain: true });

  return {
    front: finalizeTexture(frontCanvas),
    back: finalizeTexture(backCanvas),
    wide: finalizeTexture(wideCanvas),
    side: finalizeTexture(sideCanvas),
    wood: finalizeTexture(woodCanvas),
    endGrain: finalizeTexture(endCanvas),
    palette: pal
  };
}

// ============================================================================
// 3D GEOMETRY BUILDERS FOR ALL 10 CARPENTRY PRODUCT CATEGORIES
// ============================================================================
function buildCategoryModel(categoryKey, mats, interactivePivots) {
  const root = new THREE.Group();

  // Helper to create a 6-sided box where Front, Back, Sides, Top, Bottom are all properly textured
  const createTexturedBox = (w, h, d, matArrayOrSingle) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, matArrayOrSingle);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // Standard 6-face material array: [Right(90°), Left(270°), Top, Bottom, Front(0°), Back(180°)]
  const panelMaterials = [
    mats.side,     // 0: Right (+X)
    mats.side,     // 1: Left (-X)
    mats.endGrain, // 2: Top (+Y)
    mats.endGrain, // 3: Bottom (-Y)
    mats.front,    // 4: Front (+Z)
    mats.back      // 5: Back (-Z)
  ];

  const widePanelMaterials = [
    mats.side,     // 0: Right
    mats.side,     // 1: Left
    mats.wide,     // 2: Top
    mats.back,     // 3: Bottom
    mats.wide,     // 4: Front
    mats.back      // 5: Back
  ];

  // Helper for 3D Brass Handle
  const createBrassHandle = (scale = 1, vertical = true) => {
    const hg = new THREE.Group();
    const plate = createTexturedBox(
      vertical ? 0.08 * scale : 0.34 * scale,
      vertical ? 0.34 * scale : 0.08 * scale,
      0.02 * scale,
      mats.brass
    );
    hg.add(plate);

    const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018 * scale, 0.018 * scale, 0.06 * scale, 12), mats.brass);
    post1.rotation.x = Math.PI / 2;
    post1.position.set(vertical ? 0 : -0.1 * scale, vertical ? 0.09 * scale : 0, 0.03 * scale);
    hg.add(post1);

    const post2 = post1.clone();
    post2.position.set(vertical ? 0 : 0.1 * scale, vertical ? -0.09 * scale : 0, 0.03 * scale);
    hg.add(post2);

    const bar = createTexturedBox(
      vertical ? 0.03 * scale : 0.28 * scale,
      vertical ? 0.28 * scale : 0.03 * scale,
      0.025 * scale,
      mats.brass
    );
    bar.position.set(0, 0, 0.06 * scale);
    hg.add(bar);
    return hg;
  };

  // --------------------------------------------------------------------------
  // 1. WOODEN DOORS ('door')
  // --------------------------------------------------------------------------
  if (categoryKey === 'door') {
    // Outer Solid Timber Door Frame (Uluwahu Jambs + Header + Threshold)
    const frameW = 2.42;
    const frameH = 4.46;
    const frameD = 0.32;
    const postThick = 0.16;

    const leftJamb = createTexturedBox(postThick, frameH, frameD, mats.wood);
    leftJamb.position.set(-frameW / 2 + postThick / 2, -0.2, 0);
    root.add(leftJamb);

    const rightJamb = createTexturedBox(postThick, frameH, frameD, mats.wood);
    rightJamb.position.set(frameW / 2 - postThick / 2, -0.2, 0);
    root.add(rightJamb);

    const headerJamb = createTexturedBox(frameW + 0.16, postThick * 1.15, frameD + 0.06, mats.wood);
    headerJamb.position.set(0, frameH / 2 - 0.2 + postThick * 0.4, 0);
    root.add(headerJamb);

    const thresholdSill = createTexturedBox(frameW + 0.1, 0.1, frameD + 0.08, mats.darkWood);
    thresholdSill.position.set(0, -frameH / 2 - 0.2, 0);
    root.add(thresholdSill);

    // Hinged Door Leaf Pivot
    const pivot = new THREE.Group();
    pivot.position.set(-1.04, -0.2, 0);
    root.add(pivot);
    interactivePivots.push({ group: pivot, openRotY: -Math.PI * 0.38 });

    const doorW = 2.08;
    const doorH = 4.22;
    const doorD = 0.22;
    const doorLeaf = createTexturedBox(doorW, doorH, doorD, panelMaterials);
    doorLeaf.position.set(doorW / 2, 0, 0);
    pivot.add(doorLeaf);

    // Raised 3D Perimeter Moulding Frame on Front & Back of Door Leaf
    const stileW = 0.12;
    const railH = 0.14;
    const relief = 0.025;
    [-1, 1].forEach(sideZ => {
      const zPos = sideZ * (doorD / 2 + relief / 2);
      const lStile = createTexturedBox(stileW, doorH - 0.04, relief, mats.wood);
      lStile.position.set(stileW / 2 + 0.02, 0, zPos);
      pivot.add(lStile);

      const rStile = createTexturedBox(stileW, doorH - 0.04, relief, mats.wood);
      rStile.position.set(doorW - stileW / 2 - 0.02, 0, zPos);
      pivot.add(rStile);

      const tRail = createTexturedBox(doorW - stileW * 2, railH, relief, mats.wood);
      tRail.position.set(doorW / 2, doorH / 2 - railH / 2 - 0.02, zPos);
      pivot.add(tRail);

      const bRail = createTexturedBox(doorW - stileW * 2, railH * 1.2, relief, mats.wood);
      bRail.position.set(doorW / 2, -doorH / 2 + railH * 0.6 + 0.02, zPos);
      pivot.add(bRail);
    });

    // 3D Brass Handles on Front (0°) & Back (180°)
    const frontHandle = createBrassHandle(1.1, true);
    frontHandle.position.set(doorW - 0.22, -0.05, doorD / 2 + 0.02);
    pivot.add(frontHandle);

    const backHandle = createBrassHandle(1.1, true);
    backHandle.rotation.y = Math.PI;
    backHandle.position.set(doorW - 0.22, -0.05, -doorD / 2 - 0.02);
    pivot.add(backHandle);

    // 3D Brass Mortise Lock Plate on Right Edge (90°)
    const lockPlate = createTexturedBox(0.015, 0.55, 0.12, mats.brass);
    lockPlate.position.set(doorW + 0.008, -0.05, 0);
    pivot.add(lockPlate);

    // 3 Brass Barrel Hinges on Left Edge (270°)
    [-1.4, 0, 1.4].forEach(hy => {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.28, 16), mats.brass);
      barrel.position.set(0, hy, doorD / 2 + 0.01);
      pivot.add(barrel);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 2. PANTRY CUPBOARDS ('pantry')
  // --------------------------------------------------------------------------
  if (categoryKey === 'pantry') {
    // Full Modular Pantry Unit: Lower Base Cabinet + Granite/Timber Countertop + Backsplash + Upper Wall Cupboards
    const totalW = 3.4;

    // Plinth toe-kick
    const plinth = createTexturedBox(totalW - 0.1, 0.18, 1.35, mats.darkWood);
    plinth.position.set(0, -2.25, -0.04);
    root.add(plinth);

    // Lower Base Carcass (Sides, Back, Interior Shelf, Bottom)
    const lowerCarcass = createTexturedBox(totalW, 1.55, 1.45, [
      mats.side,     // Right side shows matching wood + design panel
      mats.side,     // Left side shows matching wood + design panel
      mats.wood,     // Top
      mats.endGrain, // Bottom
      mats.wood,     // Front behind doors
      mats.back      // Back (180° view shows finished rear panelling with uploaded design!)
    ]);
    lowerCarcass.position.set(0, -1.38, -0.05);
    root.add(lowerCarcass);

    // Countertop Slab overhanging base
    const counterTop = createTexturedBox(totalW + 0.14, 0.12, 1.62, mats.counter);
    counterTop.position.set(0, -0.55, 0.01);
    root.add(counterTop);

    // 3 Top Drawers below countertop
    const drawerW = (totalW - 0.24) / 3;
    [-1, 0, 1].forEach((idx) => {
      const dx = idx * (drawerW + 0.05);
      const drawer = createTexturedBox(drawerW, 0.34, 0.08, panelMaterials);
      drawer.position.set(dx, -0.84, 0.71);
      root.add(drawer);

      const pull = createBrassHandle(0.65, false);
      pull.position.set(dx, -0.84, 0.76);
      root.add(pull);
    });

    // 3 Lower Hinged Pantry Cupboard Doors (mapped with uploaded design)
    [-1, 0, 1].forEach((idx) => {
      const dx = idx * (drawerW + 0.05);
      const doorPivot = new THREE.Group();
      doorPivot.position.set(dx - drawerW / 2, -1.58, 0.68);
      root.add(doorPivot);
      if (idx === -1) interactivePivots.push({ group: doorPivot, openRotY: -Math.PI * 0.35 });
      if (idx === 1) interactivePivots.push({ group: doorPivot, openRotY: -Math.PI * 0.35 });

      const door = createTexturedBox(drawerW, 1.02, 0.08, panelMaterials);
      door.position.set(drawerW / 2, 0, 0.03);
      doorPivot.add(door);

      const handle = createBrassHandle(0.75, true);
      handle.position.set(idx === -1 ? drawerW - 0.12 : 0.12, 0.1, 0.08);
      doorPivot.add(handle);
    });

    // Backsplash Panel between Lower & Upper Pantry (mapped with wide design)
    const backSplash = createTexturedBox(totalW - 0.08, 0.95, 0.12, widePanelMaterials);
    backSplash.position.set(0, -0.02, -0.68);
    root.add(backSplash);

    // Upper Wall-Mounted Pantry Cupboard Carcass
    const upperCarcass = createTexturedBox(totalW, 1.38, 0.92, [
      mats.side,
      mats.side,
      mats.wood,
      mats.wood,
      mats.wood,
      mats.back
    ]);
    upperCarcass.position.set(0, 1.12, -0.32);
    root.add(upperCarcass);

    // Upper Crown Moulding Cornice
    const crown = createTexturedBox(totalW + 0.18, 0.14, 1.04, mats.wood);
    crown.position.set(0, 1.88, -0.28);
    root.add(crown);

    // 3 Upper Pantry Doors with Uploaded Design + Timber Frame
    [-1, 0, 1].forEach((idx) => {
      const dx = idx * (drawerW + 0.05);
      const uPivot = new THREE.Group();
      uPivot.position.set(dx - drawerW / 2, 1.12, 0.15);
      root.add(uPivot);
      if (idx === 0) interactivePivots.push({ group: uPivot, openRotY: -Math.PI * 0.35 });

      const uDoor = createTexturedBox(drawerW, 1.26, 0.08, panelMaterials);
      uDoor.position.set(drawerW / 2, 0, 0.03);
      uPivot.add(uDoor);

      const handle = createBrassHandle(0.7, true);
      handle.position.set(drawerW - 0.12, -0.35, 0.08);
      uPivot.add(handle);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 3. KITCHEN CABINETS ('kitchen_cabinet')
  // --------------------------------------------------------------------------
  if (categoryKey === 'kitchen_cabinet') {
    const cabW = 3.6;
    const cabH = 2.25;
    const cabD = 1.65;

    // 4 Turned Solid Timber Feet
    [
      [-cabW / 2 + 0.18, -1.55, cabD / 2 - 0.18],
      [cabW / 2 - 0.18, -1.55, cabD / 2 - 0.18],
      [-cabW / 2 + 0.18, -1.55, -cabD / 2 + 0.18],
      [cabW / 2 - 0.18, -1.55, -cabD / 2 + 0.18]
    ].forEach(([fx, fy, fz]) => {
      const foot = createTexturedBox(0.18, 0.28, 0.18, mats.darkWood);
      foot.position.set(fx, fy, fz);
      root.add(foot);
    });

    // Main Kitchen Cabinet Body (Finished on all 4 sides for 360° Island / Credenza inspection)
    const body = createTexturedBox(cabW, cabH, cabD, [
      mats.side,
      mats.side,
      mats.wood,
      mats.endGrain,
      mats.wood,
      mats.back
    ]);
    body.position.set(0, -0.3, 0);
    root.add(body);

    // Thick Overhanging Polished Butcher-Block / Timber Countertop (shows design in Top View too!)
    const topSlab = createTexturedBox(cabW + 0.22, 0.16, cabD + 0.22, widePanelMaterials);
    topSlab.position.set(0, cabH / 2 - 0.3 + 0.08, 0);
    root.add(topSlab);

    // Left & Right Hinged Cabinet Doors + Center Bank of 3 Drawers
    const colW = (cabW - 0.28) / 3;

    // Left Door
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-cabW / 2 + 0.08, -0.3, cabD / 2 + 0.01);
    root.add(leftPivot);
    interactivePivots.push({ group: leftPivot, openRotY: -Math.PI * 0.38 });

    const leftDoor = createTexturedBox(colW, cabH - 0.22, 0.09, panelMaterials);
    leftDoor.position.set(colW / 2, 0, 0.04);
    leftPivot.add(leftDoor);
    const lHandle = createBrassHandle(0.85, true);
    lHandle.position.set(colW - 0.14, 0.2, 0.1);
    leftPivot.add(lHandle);

    // Right Door
    const rightPivot = new THREE.Group();
    rightPivot.position.set(cabW / 2 - 0.08 - colW, -0.3, cabD / 2 + 0.01);
    root.add(rightPivot);
    interactivePivots.push({ group: rightPivot, openRotY: Math.PI * 0.38 });

    const rightDoor = createTexturedBox(colW, cabH - 0.22, 0.09, panelMaterials);
    rightDoor.position.set(colW / 2, 0, 0.04);
    rightPivot.add(rightDoor);
    const rHandle = createBrassHandle(0.85, true);
    rHandle.position.set(0.14, 0.2, 0.1);
    rightPivot.add(rHandle);

    // Center 3 Drawers
    const dH = (cabH - 0.32) / 3;
    [-1, 0, 1].forEach((row) => {
      const dy = -0.3 + row * (dH + 0.05);
      const drawer = createTexturedBox(colW, dH, 0.09, widePanelMaterials);
      drawer.position.set(0, dy, cabD / 2 + 0.05);
      root.add(drawer);

      const dPull = createBrassHandle(0.7, false);
      dPull.position.set(0, dy, cabD / 2 + 0.11);
      root.add(dPull);
    });

    // Rear 180° Architectural Raised Panels
    [-1, 1].forEach((side) => {
      const rearPanel = createTexturedBox((cabW - 0.36) / 2, cabH - 0.28, 0.06, panelMaterials);
      rearPanel.position.set(side * (cabW / 4), -0.3, -cabD / 2 - 0.03);
      root.add(rearPanel);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 4. WINDOWS ('window')
  // --------------------------------------------------------------------------
  if (categoryKey === 'window') {
    const winW = 3.1;
    const winH = 3.0;
    const frameD = 0.34;
    const jambThick = 0.18;

    // Outer Window Frame (Top Cornice Header, Projecting Window Sill, Left/Right/Center Mullion Jambs)
    const topHeader = createTexturedBox(winW + 0.28, jambThick * 1.15, frameD + 0.12, mats.wood);
    topHeader.position.set(0, winH / 2 - 0.1, 0);
    root.add(topHeader);

    const bottomSill = createTexturedBox(winW + 0.34, jambThick * 1.2, frameD + 0.18, mats.wood);
    bottomSill.position.set(0, -winH / 2 - 0.1, 0.03);
    root.add(bottomSill);

    const leftJamb = createTexturedBox(jambThick, winH, frameD, mats.wood);
    leftJamb.position.set(-winW / 2 + jambThick / 2, -0.1, 0);
    root.add(leftJamb);

    const rightJamb = createTexturedBox(jambThick, winH, frameD, mats.wood);
    rightJamb.position.set(winW / 2 - jambThick / 2, -0.1, 0);
    root.add(rightJamb);

    const centerMullion = createTexturedBox(jambThick * 0.85, winH - jambThick * 2, frameD * 0.9, mats.wood);
    centerMullion.position.set(0, -0.1, 0);
    root.add(centerMullion);

    // Twin Hinged Casement Window Sashes (Left & Right)
    const sashW = (winW - jambThick * 2.85) / 2;
    const sashH = winH - jambThick * 2.2;
    const sashD = 0.14;

    [-1, 1].forEach((dir) => {
      const sPivot = new THREE.Group();
      const pivotX = dir === -1 ? -winW / 2 + jambThick : winW / 2 - jambThick;
      sPivot.position.set(pivotX, -0.1, 0.02);
      root.add(sPivot);
      interactivePivots.push({
        group: sPivot,
        openRotY: dir === -1 ? -Math.PI * 0.32 : Math.PI * 0.32
      });

      const offsetX = dir === -1 ? sashW / 2 : -sashW / 2;

      // Sash Panel with Uploaded Design & Glass Sheen
      const sashPanel = createTexturedBox(sashW, sashH, sashD, panelMaterials);
      sashPanel.position.set(offsetX, 0, 0);
      sPivot.add(sashPanel);

      // Sash Perimeter Timber Stiles & Horizontal Grille Bars (Muntins)
      const barThick = 0.08;
      [-1, 1].forEach((zSide) => {
        const zOff = zSide * (sashD / 2 + 0.015);
        // Top, Middle, Bottom horizontal bars
        [-sashH / 2 + barThick / 2, 0, sashH / 2 - barThick / 2].forEach((by) => {
          const hBar = createTexturedBox(sashW, barThick, 0.03, mats.wood);
          hBar.position.set(offsetX, by, zOff);
          sPivot.add(hBar);
        });
        // Left & Right vertical stiles
        [-sashW / 2 + barThick / 2, sashW / 2 - barThick / 2].forEach((bx) => {
          const vBar = createTexturedBox(barThick, sashH, 0.03, mats.wood);
          vBar.position.set(offsetX + bx, 0, zOff);
          sPivot.add(vBar);
        });
      });

      // Brass Window Handle on both Front & Back
      const handleX = dir === -1 ? sashW - 0.12 : -sashW + 0.12;
      const wHandleFront = createBrassHandle(0.65, true);
      wHandleFront.position.set( handleX, 0, sashD / 2 + 0.03);
      sPivot.add(wHandleFront);

      const wHandleBack = createBrassHandle(0.65, true);
      wHandleBack.rotation.y = Math.PI;
      wHandleBack.position.set(handleX, 0, -sashD / 2 - 0.03);
      sPivot.add(wHandleBack);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 5. STAIRCASES ('staircase')
  // --------------------------------------------------------------------------
  if (categoryKey === 'staircase') {
    const stairGroup = new THREE.Group();
    stairGroup.position.set(0, -1.9, 0.7);
    root.add(stairGroup);

    const numSteps = 6;
    const stepW = 2.1;
    const treadD = 0.52;
    const riserH = 0.52;
    const treadThick = 0.09;

    // Left & Right Angled Stringer Beams
    [-stepW / 2 - 0.07, stepW / 2 + 0.07].forEach((sx) => {
      const stringerLen = Math.hypot(numSteps * treadD, numSteps * riserH) + 0.4;
      const stringer = createTexturedBox(0.14, 0.34, stringerLen, mats.wood);
      stringer.position.set(sx, (numSteps * riserH) / 2 - 0.2, -(numSteps * treadD) / 2 + 0.2);
      stringer.rotation.x = Math.atan2(riserH, treadD);
      stairGroup.add(stringer);
    });

    // Steps (Treads + Risers + Turned Balusters)
    for (let i = 0; i < numSteps; i++) {
      const y = (i + 1) * riserH;
      const z = -i * treadD;

      // Solid Wood Tread (Mapped with Uploaded Design / Timber Texture)
      const tread = createTexturedBox(stepW, treadThick, treadD + 0.06, widePanelMaterials);
      tread.position.set(0, y, z);
      stairGroup.add(tread);

      // Vertical Riser
      const riser = createTexturedBox(stepW - 0.04, riserH, 0.06, panelMaterials);
      riser.position.set(0, y - riserH / 2, z + treadD / 2 - 0.03);
      stairGroup.add(riser);

      // Turned Wooden Balusters on Left & Right
      [-stepW / 2 + 0.1, stepW / 2 - 0.1].forEach((bx) => {
        const baluster = new THREE.Mesh(
          new THREE.CylinderGeometry(0.038, 0.048, 1.35, 16),
          mats.wood
        );
        baluster.castShadow = true;
        baluster.position.set(bx, y + 0.68, z);
        stairGroup.add(baluster);
      });
    }

    // Bottom & Top Carved Square Newel Posts with Finials
    const newelPositions = [
      [-stepW / 2 + 0.1, 0.9, 0.28],
      [stepW / 2 - 0.1, 0.9, 0.28],
      [-stepW / 2 + 0.1, numSteps * riserH + 0.85, -(numSteps - 1) * treadD - 0.15],
      [stepW / 2 - 0.1, numSteps * riserH + 0.85, -(numSteps - 1) * treadD - 0.15]
    ];
    newelPositions.forEach(([nx, ny, nz]) => {
      const post = createTexturedBox(0.22, 1.8, 0.22, panelMaterials);
      post.position.set(nx, ny, nz);
      stairGroup.add(post);

      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), mats.brass);
      cap.position.set(nx, ny + 0.98, nz);
      stairGroup.add(cap);
    });

    // Sloped Solid Timber Handrails (Left & Right)
    [-stepW / 2 + 0.1, stepW / 2 - 0.1].forEach((hx) => {
      const railLen = Math.hypot(numSteps * treadD, numSteps * riserH) + 0.35;
      const handrail = createTexturedBox(0.14, 0.12, railLen, mats.wood);
      handrail.position.set(hx, (numSteps * riserH) / 2 + 1.45, -(numSteps * treadD) / 2 + 0.25);
      handrail.rotation.x = Math.atan2(riserH, treadD);
      stairGroup.add(handrail);
    });

    // Rear / Under-Stair Feature Panel (So Back View 180° showcases the design cleanly too!)
    const backShowcase = createTexturedBox(stepW - 0.1, numSteps * riserH * 0.72, 0.1, panelMaterials);
    backShowcase.position.set(0, (numSteps * riserH) * 0.38, -(numSteps - 1) * treadD - 0.24);
    stairGroup.add(backShowcase);

    return root;
  }

  // --------------------------------------------------------------------------
  // 6. WARDROBES ('wardrobe')
  // --------------------------------------------------------------------------
  if (categoryKey === 'wardrobe') {
    const wWidth = 3.05;
    const wHeight = 4.15;
    const wDepth = 1.35;

    // Crown Pediment & Base Plinth
    const crown = createTexturedBox(wWidth + 0.2, 0.2, wDepth + 0.16, mats.wood);
    crown.position.set(0, wHeight / 2 - 0.12, 0);
    root.add(crown);

    const plinth = createTexturedBox(wWidth + 0.1, 0.22, wDepth + 0.08, mats.darkWood);
    plinth.position.set(0, -wHeight / 2 - 0.22, 0);
    root.add(plinth);

    // Main Wardrobe Carcass (Sides, Top, Bottom, Rear Finished Panel)
    const carcass = createTexturedBox(wWidth, wHeight - 0.15, wDepth, [
      mats.side,
      mats.side,
      mats.wood,
      mats.endGrain,
      mats.wood,
      mats.back
    ]);
    carcass.position.set(0, -0.18, -0.04);
    root.add(carcass);

    // 3 Full-Height Hinged Wardrobe Doors (Mapped with Uploaded Design)
    const doorW = (wWidth - 0.22) / 3;
    const doorH = wHeight - 0.85;
    [-1, 0, 1].forEach((idx) => {
      const dx = idx * (doorW + 0.04);
      const dPivot = new THREE.Group();
      dPivot.position.set(dx - doorW / 2, 0.12, wDepth / 2 - 0.02);
      root.add(dPivot);
      if (idx === -1) interactivePivots.push({ group: dPivot, openRotY: -Math.PI * 0.36 });
      if (idx === 1) interactivePivots.push({ group: dPivot, openRotY: -Math.PI * 0.36 });

      const door = createTexturedBox(doorW, doorH, 0.09, panelMaterials);
      door.position.set(doorW / 2, 0, 0.04);
      dPivot.add(door);

      const handle = createBrassHandle(0.9, true);
      handle.position.set(idx === -1 ? doorW - 0.12 : 0.12, -0.1, 0.1);
      dPivot.add(handle);
    });

    // 2 Bottom Storage Drawers
    const bDrawerW = (wWidth - 0.18) / 2;
    [-0.5, 0.5].forEach((side) => {
      const dx = side * (bDrawerW + 0.04);
      const drawer = createTexturedBox(bDrawerW, 0.48, 0.09, widePanelMaterials);
      drawer.position.set(dx, -wHeight / 2 + 0.16, wDepth / 2 + 0.02);
      root.add(drawer);

      const pull = createBrassHandle(0.7, false);
      pull.position.set(dx, -wHeight / 2 + 0.16, wDepth / 2 + 0.08);
      root.add(pull);
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 7. BEDROOM CUPBOARDS ('bedroom_cupboard')
  // --------------------------------------------------------------------------
  if (categoryKey === 'bedroom_cupboard') {
    const cWidth = 2.45;
    const cHeight = 3.75;
    const cDepth = 1.25;

    // Top Moulded Cornice
    const cornice = createTexturedBox(cWidth + 0.18, 0.18, cDepth + 0.14, mats.wood);
    cornice.position.set(0, cHeight / 2 - 0.15, 0);
    root.add(cornice);

    // Bracket Feet
    [
      [-cWidth / 2 + 0.16, -cHeight / 2 - 0.25, cDepth / 2 - 0.16],
      [cWidth / 2 - 0.16, -cHeight / 2 - 0.25, cDepth / 2 - 0.16],
      [-cWidth / 2 + 0.16, -cHeight / 2 - 0.25, -cDepth / 2 + 0.16],
      [cWidth / 2 - 0.16, -cHeight / 2 - 0.25, -cDepth / 2 + 0.16]
    ].forEach(([fx, fy, fz]) => {
      const foot = createTexturedBox(0.22, 0.24, 0.22, mats.darkWood);
      foot.position.set(fx, fy, fz);
      root.add(foot);
    });

    // Main Cupboard Carcass
    const carcass = createTexturedBox(cWidth, cHeight - 0.15, cDepth, [
      mats.side,
      mats.side,
      mats.wood,
      mats.endGrain,
      mats.wood,
      mats.back
    ]);
    carcass.position.set(0, -0.2, -0.03);
    root.add(carcass);

    // 2 Upper Hinged Bedroom Cupboard Doors
    const doorW = (cWidth - 0.18) / 2;
    const doorH = cHeight - 1.15;
    [-1, 1].forEach((dir) => {
      const pivotX = dir === -1 ? -cWidth / 2 + 0.07 : cWidth / 2 - 0.07 - doorW;
      const dPivot = new THREE.Group();
      dPivot.position.set(pivotX, 0.22, cDepth / 2 - 0.01);
      root.add(dPivot);
      interactivePivots.push({
        group: dPivot,
        openRotY: dir === -1 ? -Math.PI * 0.36 : Math.PI * 0.36
      });

      const door = createTexturedBox(doorW, doorH, 0.09, panelMaterials);
      door.position.set(doorW / 2, 0, 0.04);
      dPivot.add(door);

      const handle = createBrassHandle(0.85, true);
      handle.position.set(dir === -1 ? doorW - 0.14 : 0.14, -0.08, 0.1);
      dPivot.add(handle);
    });

    // 2 Full-Width Lower Chest Drawers
    [-1.25, -1.72].forEach((dy) => {
      const drawer = createTexturedBox(cWidth - 0.16, 0.4, 0.09, widePanelMaterials);
      drawer.position.set(0, dy, cDepth / 2 + 0.03);
      root.add(drawer);

      [-0.55, 0.55].forEach((px) => {
        const pull = createBrassHandle(0.6, false);
        pull.position.set(px, dy, cDepth / 2 + 0.09);
        root.add(pull);
      });
    });

    return root;
  }

  // --------------------------------------------------------------------------
  // 8. TABLES ('table')
  // --------------------------------------------------------------------------
  if (categoryKey === 'table') {
    const tWidth = 3.6;
    const tDepth = 2.15;
    const tHeight = 2.15;

    // Thick Bevelled Tabletop Slab (Displays uploaded design on Top, Bottom, Front & Back aprons!)
    const tableTop = createTexturedBox(tWidth, 0.18, tDepth, [
      mats.side,
      mats.side,
      mats.wide, // Top surface shows full uploaded design
      mats.back, // Underside surface shows finished timber + design
      mats.wide,
      mats.back
    ]);
    tableTop.position.set(0, tHeight / 2 - 0.2, 0);
    root.add(tableTop);

    // Moulded Perimeter Apron Rails (Front, Back, Left, Right)
    const apronW = tWidth - 0.36;
    const apronD = tDepth - 0.36;
    const apronH = 0.28;

    const frontApron = createTexturedBox(apronW, apronH, 0.09, widePanelMaterials);
    frontApron.position.set(0, tHeight / 2 - 0.42, apronD / 2);
    root.add(frontApron);

    const backApron = createTexturedBox(apronW, apronH, 0.09, widePanelMaterials);
    backApron.position.set(0, tHeight / 2 - 0.42, -apronD / 2);
    root.add(backApron);

    const leftApron = createTexturedBox(0.09, apronH, apronD, panelMaterials);
    leftApron.position.set(-apronW / 2, tHeight / 2 - 0.42, 0);
    root.add(leftApron);

    const rightApron = createTexturedBox(0.09, apronH, apronD, panelMaterials);
    rightApron.position.set(apronW / 2, tHeight / 2 - 0.42, 0);
    root.add(rightApron);

    // 4 Heavy Turned / Fluted Solid Timber Legs
    const legH = tHeight;
    const legPositions = [
      [-apronW / 2 + 0.06, -0.25, apronD / 2 - 0.06],
      [apronW / 2 - 0.06, -0.25, apronD / 2 - 0.06],
      [-apronW / 2 + 0.06, -0.25, -apronD / 2 + 0.06],
      [apronW / 2 - 0.06, -0.25, -apronD / 2 + 0.06]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      // Upper square block
      const topBlock = createTexturedBox(0.2, 0.42, 0.2, mats.wood);
      topBlock.position.set(lx, ly + legH / 2 - 0.22, lz);
      root.add(topBlock);

      // Turned middle column
      const turnedCol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.095, 0.075, legH - 0.55, 20),
        mats.wood
      );
      turnedCol.castShadow = true;
      turnedCol.position.set(lx, ly - 0.05, lz);
      root.add(turnedCol);

      // Brass foot ferrule
      const ferrule = new THREE.Mesh(
        new THREE.CylinderGeometry(0.076, 0.068, 0.16, 16),
        mats.brass
      );
      ferrule.position.set(lx, ly - legH / 2 + 0.08, lz);
      root.add(ferrule);
    });

    // Lower H-Stretcher Support Beams
    const sideStretcherL = createTexturedBox(0.1, 0.1, apronD - 0.12, mats.wood);
    sideStretcherL.position.set(-apronW / 2 + 0.06, -0.95, 0);
    root.add(sideStretcherL);

    const sideStretcherR = createTexturedBox(0.1, 0.1, apronD - 0.12, mats.wood);
    sideStretcherR.position.set(apronW / 2 - 0.06, -0.95, 0);
    root.add(sideStretcherR);

    const centerStretcher = createTexturedBox(apronW - 0.12, 0.12, 0.24, widePanelMaterials);
    centerStretcher.position.set(0, -0.95, 0);
    root.add(centerStretcher);

    return root;
  }

  // --------------------------------------------------------------------------
  // 9. CHAIRS ('chair')
  // --------------------------------------------------------------------------
  if (categoryKey === 'chair') {
    const seatW = 1.75;
    const seatD = 1.65;
    const seatY = -0.55;

    // Contoured Solid Timber Seat (Displays uploaded design on Top, Front, Back & Underside!)
    const seat = createTexturedBox(seatW, 0.14, seatD, widePanelMaterials);
    seat.position.set(0, seatY, 0.05);
    root.add(seat);

    // Seat Apron Rails
    const fApron = createTexturedBox(seatW - 0.16, 0.18, 0.08, mats.wood);
    fApron.position.set(0, seatY - 0.14, seatD / 2 - 0.02);
    root.add(fApron);

    const bApron = createTexturedBox(seatW - 0.16, 0.18, 0.08, mats.wood);
    bApron.position.set(0, seatY - 0.14, -seatD / 2 + 0.12);
    root.add(bApron);

    [-1, 1].forEach((s) => {
      const sApron = createTexturedBox(0.08, 0.18, seatD - 0.16, mats.wood);
      sApron.position.set(s * (seatW / 2 - 0.08), seatY - 0.14, 0.05);
      root.add(sApron);
    });

    // Backrest Stile Posts (Left & Right extending from floor to crest)
    [-seatW / 2 + 0.1, seatW / 2 - 0.1].forEach((bx) => {
      const rearPost = createTexturedBox(0.15, 3.95, 0.15, mats.wood);
      rearPost.position.set(bx, -0.22, -seatD / 2 + 0.12);
      root.add(rearPost);

      // Brass finial on top of backrest post
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), mats.brass);
      finial.position.set(bx, 1.82, -seatD / 2 + 0.12);
      root.add(finial);
    });

    // Carved Center Backrest Panel (Displays uploaded design on BOTH Front 0° and Back 180°!)
    const backrestPanel = createTexturedBox(seatW - 0.34, 1.95, 0.11, panelMaterials);
    backrestPanel.position.set(0, 0.68, -seatD / 2 + 0.12);
    root.add(backrestPanel);

    // Top Crest Rail & Lower Back Rail
    const crestRail = createTexturedBox(seatW + 0.06, 0.22, 0.17, mats.wood);
    crestRail.position.set(0, 1.68, -seatD / 2 + 0.12);
    root.add(crestRail);

    // Front Legs & Sculpted Armrests
    [-seatW / 2 + 0.1, seatW / 2 - 0.1].forEach((fx) => {
      const frontLeg = createTexturedBox(0.14, 1.65, 0.14, mats.wood);
      frontLeg.position.set(fx, -1.38, seatD / 2 - 0.06);
      root.add(frontLeg);

      // Armrest support post
      const armPost = createTexturedBox(0.11, 0.72, 0.11, mats.wood);
      armPost.position.set(fx, seatY + 0.38, seatD / 2 - 0.14);
      root.add(armPost);

      // Horizontal Armrest
      const armrest = createTexturedBox(0.16, 0.09, seatD - 0.04, mats.wood);
      armrest.position.set(fx, seatY + 0.75, 0.04);
      root.add(armrest);

      // Lower side stretcher
      const stretcher = createTexturedBox(0.08, 0.09, seatD - 0.18, mats.wood);
      stretcher.position.set(fx, -1.65, 0.04);
      root.add(stretcher);
    });

    const frontStretcher = createTexturedBox(seatW - 0.2, 0.09, 0.08, mats.wood);
    frontStretcher.position.set(0, -1.65, seatD / 2 - 0.06);
    root.add(frontStretcher);

    return root;
  }

  // --------------------------------------------------------------------------
  // 10. CUSTOM WOODEN FURNITURE ('custom_furniture')
  // --------------------------------------------------------------------------
  const unitW = 3.2;
  const unitH = 3.5;
  const unitD = 1.25;

  // Architectural Showcase Credenza + Upper Carved Feature Panel
  const basePlinth = createTexturedBox(unitW + 0.14, 0.2, unitD + 0.1, mats.darkWood);
  basePlinth.position.set(0, -2.15, 0);
  root.add(basePlinth);

  const lowerBody = createTexturedBox(unitW, 1.65, unitD, [
    mats.side,
    mats.side,
    mats.wide,
    mats.endGrain,
    mats.wood,
    mats.back
  ]);
  lowerBody.position.set(0, -1.22, 0);
  root.add(lowerBody);

  // 2 Hinged Lower Custom Doors
  const cDoorW = (unitW - 0.22) / 2;
  [-1, 1].forEach((dir) => {
    const px = dir === -1 ? -unitW / 2 + 0.08 : unitW / 2 - 0.08 - cDoorW;
    const cPivot = new THREE.Group();
    cPivot.position.set(px, -1.22, unitD / 2 + 0.01);
    root.add(cPivot);
    interactivePivots.push({
      group: cPivot,
      openRotY: dir === -1 ? -Math.PI * 0.35 : Math.PI * 0.35
    });

    const cDoor = createTexturedBox(cDoorW, 1.45, 0.08, widePanelMaterials);
    cDoor.position.set(cDoorW / 2, 0, 0.04);
    cPivot.add(cDoor);

    const handle = createBrassHandle(0.75, true);
    handle.position.set(dir === -1 ? cDoorW - 0.14 : 0.14, 0.1, 0.09);
    cPivot.add(handle);
  });

  // Middle Countertop Ledge
  const midLedge = createTexturedBox(unitW + 0.2, 0.12, unitD + 0.18, mats.wood);
  midLedge.position.set(0, -0.34, 0);
  root.add(midLedge);

  // Upper Architectural Showcase Frame (Displays uploaded design on Front, Back & Sides)
  const upperShowcase = createTexturedBox(unitW - 0.2, 2.05, 0.38, panelMaterials);
  upperShowcase.position.set(0, 0.74, 0);
  root.add(upperShowcase);

  // Left & Right Turned Fluted Columns framing the upper showcase
  [-unitW / 2 + 0.16, unitW / 2 - 0.16].forEach((cx) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 2.05, 20), mats.wood);
    col.position.set(cx, 0.74, 0.22);
    root.add(col);
  });

  // Top Crown Cornice
  const topCornice = createTexturedBox(unitW + 0.16, 0.18, 0.65, mats.wood);
  topCornice.position.set(0, 1.84, 0.05);
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

  // Loaded customer/catalogue image state
  const [loadedImage, setLoadedImage] = useState(null);
  const [blendTimberTint, setBlendTimberTint] = useState(false);

  // Viewer Orbit & Animation States
  const [rotationY, setRotationY] = useState(0); // Horizontal Angle (0 - 360 deg)
  const [rotationX, setRotationX] = useState(8); // Vertical Tilt (-85 to +85 deg)
  const [zoom, setZoom] = useState(1);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('front');

  const categoryKey = normalizeCategoryKey(selectedWork);

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

    const widthPx = container.clientWidth || 640;
    const heightPx = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, widthPx / heightPx, 0.1, 100);
    camera.position.set(0, 0.1, 8.2);
    camera.lookAt(0, -0.35, 0);
    cameraRef.current = camera;

    // 3. Renderer
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

    // 4. Studio 4-Point Architectural Lighting (Ensures all 6 sides are well-lit at 360°)
    const ambientLight = new THREE.AmbientLight(0xfff6eb, 1.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(6, 9, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const backLight = new THREE.DirectionalLight(0xffe4c4, 1.5);
    backLight.position.set(-6, 5, -8);
    scene.add(backLight);

    const underFillLight = new THREE.DirectionalLight(0xfde68a, 1.1);
    underFillLight.position.set(0, -8, 4);
    scene.add(underFillLight);

    // 5. Turntable Pedestal Assembly
    const turntableGroup = new THREE.Group();
    turntableRef.current = turntableGroup;
    scene.add(turntableGroup);

    const cylinderGeo = new THREE.CylinderGeometry(2.55, 2.7, 0.18, 64);
    const cylinderMat = new THREE.MeshStandardMaterial({
      color: 0x1e1108,
      roughness: 0.42,
      metalness: 0.12
    });
    const turntableMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    turntableMesh.position.y = -2.48;
    turntableMesh.receiveShadow = true;
    turntableGroup.add(turntableMesh);

    const brassRingGeo = new THREE.TorusGeometry(2.42, 0.032, 16, 64);
    const brassRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85
    });
    const brassRing = new THREE.Mesh(brassRingGeo, brassRingMat);
    brassRing.rotation.x = Math.PI / 2;
    brassRing.position.y = -2.38;
    turntableGroup.add(brassRing);

    // Resize Handler
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

  // Rebuild 3D Product Geometry & Multi-Surface Textures whenever category, wood, finish, or uploaded image changes
  useEffect(() => {
    const turntable = turntableRef.current;
    const renderer = rendererRef.current;
    if (!turntable || !renderer) return;

    // Remove previous model root cleanly
    if (modelRootRef.current) {
      turntable.remove(modelRootRef.current);
      modelRootRef.current.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      modelRootRef.current = null;
    }
    interactivePivotsRef.current = [];

    const maxAniso = renderer.capabilities.getMaxAnisotropy() || 4;
    const texSuite = createCarpentryTextures(
      woodType,
      finish,
      loadedImage,
      blendTimberTint,
      maxAniso
    );

    const roughnessVal = finish === 'gloss' ? 0.18 : finish === 'matte' ? 0.72 : 0.4;
    const metalnessVal = finish === 'gloss' ? 0.08 : 0.03;

    const mats = {
      front: new THREE.MeshStandardMaterial({ map: texSuite.front, roughness: roughnessVal, metalness: metalnessVal }),
      back: new THREE.MeshStandardMaterial({ map: texSuite.back, roughness: roughnessVal, metalness: metalnessVal }),
      wide: new THREE.MeshStandardMaterial({ map: texSuite.wide, roughness: roughnessVal, metalness: metalnessVal }),
      side: new THREE.MeshStandardMaterial({ map: texSuite.side, roughness: roughnessVal, metalness: metalnessVal }),
      wood: new THREE.MeshStandardMaterial({ map: texSuite.wood, roughness: roughnessVal, metalness: metalnessVal }),
      endGrain: new THREE.MeshStandardMaterial({ map: texSuite.endGrain, roughness: roughnessVal + 0.1 }),
      darkWood: new THREE.MeshStandardMaterial({ color: texSuite.palette.plinth, roughness: 0.55 }),
      counter: new THREE.MeshStandardMaterial({ color: texSuite.palette.counter, roughness: 0.25, metalness: 0.15 }),
      brass: new THREE.MeshStandardMaterial({ color: texSuite.palette.brass, roughness: 0.22, metalness: 0.88 })
    };

    const pivots = [];
    const newModel = buildCategoryModel(categoryKey, mats, pivots);
    modelRootRef.current = newModel;
    interactivePivotsRef.current = pivots;

    // Apply open state if active
    pivots.forEach((p) => {
      p.group.rotation.y = isDoorOpen ? p.openRotY : 0;
    });

    turntable.add(newModel);

    return () => {
      Object.values(mats).forEach((m) => m.dispose());
      ['front', 'back', 'wide', 'side', 'wood', 'endGrain'].forEach((k) => {
        if (texSuite[k]) texSuite[k].dispose();
      });
    };
  }, [categoryKey, woodType, finish, loadedImage, blendTimberTint]);

  // Apply Rotation (Full 360° Yaw & -85° to +85° Pitch for Top/Bottom Views) and Zoom
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

  // Handle Swing Open Doors / Sashes / Cabinets
  useEffect(() => {
    interactivePivotsRef.current.forEach((p) => {
      p.group.rotation.y = isDoorOpen ? p.openRotY : 0;
    });
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

    const newY = Math.round(((dragStartRef.current.rotY + deltaX * 0.75) % 360) + 360) % 360;
    // Allow full vertical orbit from -85° (Bottom View) to +85° (Top View)
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

  // Preset Angle Switches (Front, Right, Back, Left, Top, Bottom, 3D Tilt)
  const setPresetAngle = (preset, y, x = 0) => {
    setActivePreset(preset);
    setIsAutoSpin(false);
    setRotationY(y);
    setRotationX(x);
  };

  // Helper to describe currently visible face
  const getVisibleSideInfo = (degY, degX) => {
    if (degX >= 55) {
      return {
        label: 'Top View (Overhead)',
        badge: 'bg-cyan-400 text-stone-950',
        hint: 'Inspecting top cornice, countertop surface & timber crown profile'
      };
    }
    if (degX <= -55) {
      return {
        label: 'Bottom View (Underside)',
        badge: 'bg-rose-400 text-stone-950',
        hint: 'Inspecting solid timber base plinth, threshold sill & underside joinery'
      };
    }
    const norm = ((degY % 360) + 360) % 360;
    if (norm >= 315 || norm < 45) {
      return {
        label: 'Front View (0°)',
        badge: 'bg-amber-400 text-stone-950',
        hint: 'Showing customer design mapped onto 3D front carpentry panels'
      };
    }
    if (norm >= 45 && norm < 135) {
      return {
        label: 'Right-Side View (90°)',
        badge: 'bg-emerald-400 text-stone-950',
        hint: `Matching side timber profile (${height} cm depth) & side joinery`
      };
    }
    if (norm >= 135 && norm < 225) {
      return {
        label: 'Back View (180°)',
        badge: 'bg-blue-400 text-stone-950',
        hint: 'Coordinated rear architectural panels & solid hardwood backing'
      };
    }
    return {
      label: 'Left-Side View (270°)',
      badge: 'bg-purple-400 text-stone-950',
      hint: 'Matching left timber profile, structural stiles & hardware'
    };
  };

  const visibleSide = getVisibleSideInfo(rotationY, rotationX);
  const hasInteractiveDoors = ['door', 'pantry', 'kitchen_cabinet', 'window', 'wardrobe', 'bedroom_cupboard', 'custom_furniture'].includes(categoryKey);

  const viewPresets = [
    { id: 'front', label: 'Front (0°)', y: 0, x: 0 },
    { id: 'right', label: 'Right (90°)', y: 90, x: 0 },
    { id: 'back', label: 'Back (180°)', y: 180, x: 0 },
    { id: 'left', label: 'Left (270°)', y: 270, x: 0 },
    { id: 'top', label: 'Top View', y: 0, x: 82 },
    { id: 'bottom', label: 'Bottom View', y: 0, x: -82 },
    { id: 'iso', label: '3D Tilt', y: 38, x: 22 }
  ];

  return (
    <div className={`relative w-full ${isStudio ? 'h-full' : 'h-[460px] sm:h-[520px] lg:h-[560px] xl:h-[600px]'} flex flex-col justify-between overflow-hidden select-none`}>
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
          <span className={`w-2 h-2 rounded-full ${isAutoSpin ? 'bg-emerald-400 animate-ping' : 'bg-amber-400/70'}`} />
        </button>

        {/* All 7 View Presets: Front, Right, Back, Left, Top, Bottom, 3D Tilt */}
        <div
          className="hidden lg:flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-xs"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="text-amber-300 font-mono font-bold text-[11px] mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{Math.round(rotationY)}°</span>
          </span>

          {viewPresets.map((vp) => {
            const isActive = activePreset === vp.id || (rotationY === vp.y && Math.abs(rotationX - vp.x) <= 4);
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

        {/* Right Controls: Texture Mode, Open/Close Doors, Step Rotate & Fullscreen */}
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          {/* Toggle between True Original Photo clarity vs Wood-Tinted Carving */}
          <button
            type="button"
            onClick={() => setBlendTimberTint((prev) => !prev)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              blendTimberTint
                ? 'bg-amber-500 text-stone-950 border-white font-black'
                : 'bg-black/75 text-amber-200 border-white/20 hover:bg-black/90'
            }`}
            title="Toggle between original photo colors or wood-grain stain blend"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">{blendTimberTint ? 'Wood Tint' : 'True Photo'}</span>
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
              title="Open / Close doors or sashes"
            >
              {isDoorOpen ? <DoorOpen className="w-3.5 h-3.5" /> : <DoorClosed className="w-3.5 h-3.5" />}
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

      {/* 3. Real-Time Active Side Callout */}
      <div className="relative z-20 self-center flex flex-col items-center gap-1 pointer-events-none select-none mt-auto mb-1">
        <div className="bg-black/80 backdrop-blur-md text-white border border-white/25 px-3.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-2 shadow-lg">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${visibleSide.badge}`}>
            {visibleSide.label}
          </span>
          <span className="text-amber-200/90 hidden sm:inline">• {visibleSide.hint}</span>
        </div>
        <div className="text-[10px] text-amber-300/80 bg-black/60 px-2.5 py-0.5 rounded-full font-mono">
          Drag horizontally (360°) or vertically (Top/Bottom) • Depth: {height} cm
        </div>
      </div>

      {/* 4. Bottom Controls: Mobile/Tablet Preset Bar + Model Specs + Zoom */}
      <div
        className="relative z-30 flex flex-wrap items-center justify-between gap-2 p-3 pointer-events-auto no-drag"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Mobile & Tablet 7-Angle Switcher */}
        <div className="flex lg:hidden items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1">
          {viewPresets.map((vp) => {
            const isActive = activePreset === vp.id || (rotationY === vp.y && Math.abs(rotationX - vp.x) <= 4);
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
          <span className="font-bold text-amber-400">{designTitle || 'Custom Carpentry'}</span>
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
