const fs = require('fs');
const path = require('path');

let embeddedFontCss = '';

try {
  const fontsDir = path.join(__dirname, '..', 'fonts');
  if (fs.existsSync(fontsDir)) {
    const files = fs.readdirSync(fontsDir).filter(f => f.endsWith('.ttf'));
    for (const file of files) {
      try {
        const filePath = path.join(fontsDir, file);
        const fontName = path.parse(file).name;
        const data = fs.readFileSync(filePath);
        const b64 = data.toString('base64');
        embeddedFontCss += `@font-face{font-family:"${fontName}";src:url("data:font/ttf;base64,${b64}") format("truetype");}\n`;
      } catch (e) {}
    }
  }
} catch (e) {}

function wrapIntoLines(text, maxChars) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  
  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + ' ' + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current += ' ' + word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildOverlay(width, height, params = {}) {
  const {
    topText = '',
    bottomText = '',
    fontFamily = 'Impact',
    fontSize = 48,
    textColor = '#FFFFFF',
    strokeColor = '#000000',
    strokeWidth = 4,
    padding = 20,
  } = params;

  const top = topText.toUpperCase();
  const bottom = bottomText.toUpperCase();

  const approxCharWidth = Math.floor(fontSize * 0.5);
  const maxChars = Math.floor((width - padding * 2) / approxCharWidth);

  const topLines = wrapIntoLines(top, maxChars);
  const bottomLines = wrapIntoLines(bottom, maxChars);

  const lineHeight = Math.round(fontSize * 1.2);
  const topStartY = padding;
  const bottomStartY = height - padding - (bottomLines.length * lineHeight);

  const xPos = Math.round(width / 2);

  const topTspans = topLines.map((ln, i) => 
    `<tspan x="${xPos}" dy="${i === 0 ? '0' : '1.2em'}">${escapeXml(ln)}</tspan>`
  ).join('');
  
  const bottomTspans = bottomLines.map((ln, i) => 
    `<tspan x="${xPos}" dy="${i === 0 ? '0' : '1.2em'}">${escapeXml(ln)}</tspan>`
  ).join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <style>
    ${embeddedFontCss}
    .meme-text {
      font-family: "${fontFamily}", Impact, "Arial Black", sans-serif;
      font-size: ${fontSize}px;
      fill: ${textColor};
      stroke: ${strokeColor};
      stroke-width: ${strokeWidth}px;
      paint-order: stroke;
      dominant-baseline: text-before-edge;
      font-weight: bold;
    }
  </style>
  <text class="meme-text" x="${xPos}" y="${topStartY}" text-anchor="middle">${topTspans}</text>
  <text class="meme-text" x="${xPos}" y="${bottomStartY}" text-anchor="middle">${bottomTspans}</text>
</svg>`;
  
  return Buffer.from(svg);
}

module.exports = { buildOverlay };