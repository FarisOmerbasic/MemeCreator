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

function scaleOverlayParams(params, scale) {
  return {
    ...params,
    fontSize: Math.max(8, Math.round((params.fontSize || 64) * scale)),
    strokeWidth: Math.max(0, Math.round((params.strokeWidth || 3) * scale)),
    padding: Math.max(0, Math.round((params.padding || 20) * scale)),
  };
}

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
    allCaps = false,
    watermarkImage,
    watermarkPosition = 'bottom-right',
  } = params;

  const top = allCaps ? topText.toUpperCase() : topText;
  const bottom = allCaps ? bottomText.toUpperCase() : bottomText;

  const approxCharWidth = Math.max(1, Math.floor(fontSize * 0.5));
  const maxChars = Math.max(1, Math.floor((width - padding * 2) / approxCharWidth));

  const topLines = wrapIntoLines(top, maxChars);
  const bottomLines = wrapIntoLines(bottom, maxChars);

  const lineHeight = Math.round(fontSize * 1.2);
  const topStartY = padding;
  const bottomStartY = height - padding - (bottomLines.length * lineHeight);

  const anchor = textAlign === 'left' ? 'start' : textAlign === 'right' ? 'end' : 'middle';
  const xPos = textAlign === 'left' ? padding : textAlign === 'right' ? width - padding : Math.round(width / 2);

  const topTspans = topLines.map((ln, i) => 
    `<tspan x="${xPos}" dy="${i === 0 ? '0' : '1.2em'}">${escapeXml(ln)}</tspan>`
  ).join('');
  
  const bottomTspans = bottomLines.map((ln, i) => 
    `<tspan x="${xPos}" dy="${i === 0 ? '0' : '1.2em'}">${escapeXml(ln)}</tspan>`
  ).join('');

  let watermarkSvg = '';
  if (watermarkImage) {
    const size = Math.floor(width * 0.1);
    const positions = {
      'top-left': { x: padding, y: padding },
      'top-right': { x: width - size - padding, y: padding },
      'bottom-left': { x: padding, y: height - size - padding },
      'bottom-right': { x: width - size - padding, y: height - size - padding }
    };
    const pos = positions[watermarkPosition] || positions['bottom-right'];
    watermarkSvg = `<image href="${watermarkImage}" x="${pos.x}" y="${pos.y}" width="${size}" height="${size}"/>`;
  }

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
  <text class="meme-text" x="${xPos}" y="${topStartY}" text-anchor="${anchor}">${topTspans}</text>
  <text class="meme-text" x="${xPos}" y="${bottomStartY}" text-anchor="${anchor}">${bottomTspans}</text>
  ${watermarkSvg}
</svg>`;
  
  return Buffer.from(svg);
}

module.exports = { buildOverlay, scaleOverlayParams };