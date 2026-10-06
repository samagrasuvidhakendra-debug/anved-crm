import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// 1. Create crisp public/logo.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" fill="none">
  <defs>
    <!-- Sun Gradient -->
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="35%" stop-color="#FBBF24" />
      <stop offset="70%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#EA580C" />
    </radialGradient>

    <!-- Solar Corona Ray Gradient -->
    <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#F97316" stop-opacity="0.2" />
    </linearGradient>

    <!-- Photovoltaic Panel Face Gradient -->
    <linearGradient id="panelFace" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="30%" stop-color="#0284C7" />
      <stop offset="75%" stop-color="#0369A1" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>

    <!-- Eco Leaf Arc Gradient -->
    <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="40%" stop-color="#059669" />
      <stop offset="80%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#34D399" />
    </linearGradient>

    <!-- Glass Glint Sheen -->
    <linearGradient id="glint" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="solarShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#059669" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Ambient Outer Glow -->
  <circle cx="100" cy="72" r="58" fill="#F59E0B" fill-opacity="0.12" filter="blur(16px)" />
  <circle cx="95" cy="115" r="50" fill="#10B981" fill-opacity="0.1" filter="blur(18px)" />

  <!-- Radiating Sun Flares -->
  <g opacity="0.95">
    <path d="M100 18 L100 32" stroke="url(#rayGrad)" stroke-width="4.5" stroke-linecap="round" />
    <path d="M136 28 L126 38" stroke="url(#rayGrad)" stroke-width="4.5" stroke-linecap="round" />
    <path d="M158 56 L144 62" stroke="url(#rayGrad)" stroke-width="4.5" stroke-linecap="round" />
    <path d="M64 28 L74 38" stroke="url(#rayGrad)" stroke-width="4.5" stroke-linecap="round" />
    <path d="M42 56 L56 62" stroke="url(#rayGrad)" stroke-width="4.5" stroke-linecap="round" />
  </g>

  <!-- Golden Rising Sun Disc -->
  <circle cx="100" cy="74" r="36" fill="url(#sunGlow)" filter="drop-shadow(0 0 12px rgba(245,158,11,0.5))" />

  <!-- Solar Panel Grid Array (Tilted Perspective) -->
  <g filter="url(#solarShadow)">
    <!-- Base Panel Foundation Frame -->
    <polygon points="46,140 154,140 142,88 58,88" fill="#020617" stroke="#1E293B" stroke-width="2" />
    
    <!-- Active Photovoltaic Face -->
    <polygon points="48,138 152,138 140,90 60,90" fill="url(#panelFace)" />
    
    <!-- Silicon Solar Cell Subdivision Grid Lines -->
    <!-- Horizontal busbars -->
    <line x1="56" y1="106" x2="144" y2="106" stroke="#BAE6FD" stroke-width="1.6" stroke-opacity="0.75" />
    <line x1="52" y1="122" x2="148" y2="122" stroke="#BAE6FD" stroke-width="1.6" stroke-opacity="0.75" />
    
    <!-- Perspective Vertical fingers -->
    <line x1="80" y1="90" x2="74" y2="138" stroke="#BAE6FD" stroke-width="1.6" stroke-opacity="0.7" />
    <line x1="100" y1="90" x2="100" y2="138" stroke="#BAE6FD" stroke-width="1.8" stroke-opacity="0.8" />
    <line x1="120" y1="90" x2="126" y2="138" stroke="#BAE6FD" stroke-width="1.6" stroke-opacity="0.7" />

    <!-- Glass Refraction Sheen -->
    <polygon points="50,136 105,91 140,91 80,136" fill="url(#glint)" />
  </g>

  <!-- Eco Leaf & Renewable Green Energy Arc -->
  <g filter="url(#solarShadow)">
    <!-- Sweeping Leaf Arc cradling panels -->
    <path d="M26,142 C30,95 72,60 120,62 C108,82 92,106 72,126 C54,144 38,148 26,142 Z" 
          fill="url(#leafGrad)" />
    
    <!-- Secondary Dynamic Eco Swoop -->
    <path d="M38,154 C58,168 112,176 156,146 C168,137 176,124 180,110 C168,126 148,140 126,146 C88,157 54,152 38,154 Z" 
          fill="url(#leafGrad)" />

    <!-- Leaf Vein Accent -->
    <path d="M34,144 C56,118 84,94 112,74" 
          stroke="#A7F3D0" stroke-width="2" stroke-linecap="round" stroke-opacity="0.85" />
  </g>

  <!-- Energy Power Spark Point -->
  <circle cx="160" cy="144" r="3.5" fill="#FDE047" filter="drop-shadow(0 0 6px #F59E0B)" />
</svg>`;

fs.writeFileSync('public/logo.svg', svgContent);
console.log('Saved public/logo.svg');

// 2. Pure Node PNG Generator
function createPng(width, height, getPixel) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const payload = Buffer.concat([typeBuf, data]);
    const crc = zlib.crc32(payload);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, payload, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', deflated),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

// Render high-res 192x192 raster icon with smooth antialiased shapes
const size = 192;
const pngBuffer = createPng(size, size, (px, py, w, h) => {
  // Normalize coordinates 0..1
  const x = px / w;
  const y = py / h;
  const cx = 0.5;
  const cy = 0.5;

  // Background: Rich Deep Slate gradient
  const bgR = 15;
  const bgG = 23;
  const bgB = 42;

  // Sun disc at cx=0.5, cy=0.38, radius=0.22
  const sunDx = x - 0.5;
  const sunDy = y - 0.38;
  const sunDist = Math.sqrt(sunDx * sunDx + sunDy * sunDy);

  if (sunDist < 0.22) {
    // Sun gradient (yellow to orange)
    const factor = sunDist / 0.22;
    const r = Math.round(251 * (1 - factor) + 245 * factor);
    const g = Math.round(191 * (1 - factor) + 158 * factor);
    const b = Math.round(36 * (1 - factor) + 11 * factor);
    return [r, g, b, 255];
  }

  // Solar panel trapezium: y between 0.44 and 0.72
  if (y >= 0.44 && y <= 0.72) {
    const progress = (y - 0.44) / (0.72 - 0.44);
    const halfWidth = 0.22 + progress * 0.18;
    if (Math.abs(x - 0.5) <= halfWidth) {
      // Inside solar panel: Grid lines or deep cyan/blue
      const isGridY = Math.abs(y - 0.53) < 0.008 || Math.abs(y - 0.62) < 0.008;
      const isGridX = Math.abs(x - 0.5) < 0.008 || Math.abs(x - (0.5 - halfWidth * 0.5)) < 0.008 || Math.abs(x - (0.5 + halfWidth * 0.5)) < 0.008;
      if (isGridX || isGridY) {
        return [186, 230, 253, 230]; // Grid line light blue
      }
      // Glass face gradient
      const blueFactor = progress;
      const pr = Math.round(56 * (1 - blueFactor) + 2 * blueFactor);
      const pg = Math.round(189 * (1 - blueFactor) + 132 * blueFactor);
      const pb = Math.round(248 * (1 - blueFactor) + 199 * blueFactor);
      return [pr, pg, pb, 255];
    }
  }

  // Eco Leaf Arc: wraps bottom left to right
  const leafDx = x - 0.35;
  const leafDy = y - 0.65;
  const leafDist = Math.sqrt(leafDx * leafDx + leafDy * leafDy);
  if (leafDist > 0.18 && leafDist < 0.38 && y > 0.48 && x < 0.82) {
    const angle = Math.atan2(leafDy, leafDx);
    if (angle > -0.8 && angle < 2.4) {
      // Emerald gradient
      const t = (x + y) / 2;
      const lr = Math.round(16 * (1 - t) + 52 * t);
      const lg = Math.round(185 * (1 - t) + 211 * t);
      const lb = Math.round(129 * (1 - t) + 153 * t);
      return [lr, lg, lb, 255];
    }
  }

  // Outer ambient border/shadow
  const distFromCenter = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
  if (distFromCenter < 0.48) {
    return [bgR, bgG, bgB, 255];
  }

  return [bgR, bgG, bgB, 0];
});

fs.writeFileSync('public/logo.png', pngBuffer);
fs.writeFileSync('public/ChatGPT Image Sep 20, 2026, 03_54_05 PM.png', pngBuffer);
console.log('Saved public/logo.png and public/ChatGPT Image Sep 20, 2026, 03_54_05 PM.png');
