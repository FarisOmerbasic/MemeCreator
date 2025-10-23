const fs = require('fs');
const path = require('path');

let embeddedFontCss = '';
let embeddedFonts = [];

try {
  const fontsDir = path.join(__dirname, '..', 'fonts');
  if (fs.existsSync(fontsDir)) {
    const files = fs.readdirSync(fontsDir).filter(f => f.toLowerCase().endsWith('.ttf'));
    for (const file of files) {
      try {
        const filePath = path.join(fontsDir, file);
        const base = path.parse(file).name;
        const simplified = base.replace(/[^a-z0-9]/gi, '').toLowerCase();
        const displayName = base.replace(/[-_]/g, ' ').toLowerCase();
        const embeddedFamily = `Embedded_${simplified}`;
        const data = fs.readFileSync(filePath);
        const b64 = data.toString('base64');
        embeddedFontCss += `@font-face{font-family: "${embeddedFamily}"; src: url("data:font/ttf;base64,${b64}") format("truetype"); font-weight: normal; font-style: normal;}\n`;
        embeddedFonts.push({ simplified, embeddedFamily, displayName });
      } catch (e) {}
    }
  }
} catch (e) {}

function scaleOverlayParams(params, scale) {
  return {
    ...params,
    fontSize: Math.max(8, Math.round((Number(params.fontSize) || 64) * scale)),
    strokeWidth: Math.max(0, Math.round((Number(params.strokeWidth) || 3) * scale)),
    padding: Math.max(0, Math.round((Number(params.padding) || 20) * scale)),
  };
}

function wrapIntoLines(text, maxChars) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const w of words) {
    if (!current) {
      current = w;
      continue;
    }
    if ((current + ' ' + w).length > maxChars) {
      lines.push(current);
      current = w;
    } else {
      current = current + ' ' + w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function findEmbeddedForRequested(requested) {
  if (!requested) return null;
  const rqSimpl = requested.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return embeddedFonts.find(f =>
    rqSimpl.includes(f.simplified) ||
    f.simplified.includes(rqSimpl) ||
    requested.toLowerCase().includes(f.displayName) ||
    f.displayName.includes(requested.toLowerCase())
  ) || null;
}

function buildOverlay(width, height, params = {}) {
  const {
    topText = '',
    bottomText = '',
    fontFamily = 'Impact',
    fontSize = 64,
    textColor = '#FFFFFF',
    strokeColor = '#000000',
    strokeWidth = 3,
    textAlign = 'center',
    padding = 20,
    allCaps = true,
    watermarkImage,
    watermarkPosition = 'bottom-right',
  } = params;

  const top = allCaps ? (topText || '').toUpperCase() : (topText || '');
  const bottom = allCaps ? (bottomText || '').toUpperCase() : (bottomText || '');

  const approxCharWidth = Math.max(1, Math.floor(fontSize * 0.5));
  const maxChars = Math.floor((width - padding * 2) / Math.max(1, approxCharWidth));

  const topLines = wrapIntoLines(top, Math.max(1, maxChars));
  const bottomLines = wrapIntoLines(bottom, Math.max(1, maxChars));

  const lineHeight = Math.round(fontSize * 1.2);
  const topStartY = padding;

  const bottomTotalHeight = bottomLines.length * lineHeight;
  const bottomStartY = height - padding - bottomTotalHeight;

  const anchor = textAlign === 'left' ? 'start' : textAlign === 'right' ? 'end' : 'middle';
  const xPos = textAlign === 'left' ? padding : textAlign === 'right' ? width - padding : Math.round(width / 2);

  const topTspans = topLines.map((ln, i) => `<tspan x="${xPos}" dy="${i === 0 ? '0' : '1.2em'}">${ln}</tspan>`).join('');
  const bottomTspans = bottomLines.map((ln, i) => `<tspan x="${xPos}" dy="${i === 0 ? '0' : '1.2em'}">${ln}</tspan>`).join('');

  let watermarkSvg = '';
  if (watermarkImage) {
    const watermarkSize = Math.floor(width * 0.1);
    let wx = width - watermarkSize - padding;
    let wy = height - watermarkSize - padding;
    if (watermarkPosition === 'top-left') { wx = padding; wy = padding; }
    else if (watermarkPosition === 'top-right') { wx = width - watermarkSize - padding; wy = padding; }
    else if (watermarkPosition === 'bottom-left') { wx = padding; wy = height - watermarkSize - padding; }
    watermarkSvg = `<image href="${watermarkImage}" x="${wx}" y="${wy}" width="${watermarkSize}" height="${watermarkSize}" />`;
  }

  const requested = String(fontFamily || '').trim();
  const matched = findEmbeddedForRequested(requested);
  console.info(`[overlayService] requested="${requested}" matched=${matched ? (matched.displayName || matched.embeddedFamily) : 'none'}`);
  let fontFamilyCss;
  if (matched) {
    fontFamilyCss = `"${matched.embeddedFamily}", "${requested}", Impact, "Arial Black", sans-serif`;
  } else {
    const embeddedFallback = embeddedFonts.map(f => `"${f.embeddedFamily}"`).join(',');
    fontFamilyCss = `"${requested}", ${embeddedFallback ? embeddedFallback + ',' : ''} Impact, "Arial Black", sans-serif`;
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <style>
      ${embeddedFontCss}
      .meme-text {
        font-family: ${fontFamilyCss};
        font-size: ${fontSize}px;
        fill: ${textColor};
        stroke: ${strokeColor};
        stroke-width: ${strokeWidth}px;
        paint-order: stroke;
        dominant-baseline: text-before-edge;
      }
    </style>
    <text class="meme-text" x="${xPos}" y="${topStartY}" text-anchor="${anchor}">
      ${topTspans}
    </text>
    <text class="meme-text" x="${xPos}" y="${bottomStartY}" text-anchor="${anchor}">
      ${bottomTspans}
    </text>
    ${watermarkSvg}
  </svg>
  `;
  return Buffer.from(svg);
}

module.exports = {buildOverlay, scaleOverlayParams};