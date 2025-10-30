const fs = require('fs');
const path = require('path');

let embeddedFontCss = '';
const fontsDir = path.join(__dirname, '..', 'fonts');

if (fs.existsSync(fontsDir)) {
  for (const file of fs.readdirSync(fontsDir).filter(f => f.endsWith('.ttf'))) {
    try {
      const fontName = path.parse(file).name;
      const data = fs.readFileSync(path.join(fontsDir, file)).toString('base64');
      embeddedFontCss += `@font-face{font-family:"${fontName}";src:url("data:font/ttf;base64,${data}") format("truetype");}\n`;
    } catch {}
  }
}

function wrapIntoLines(text, maxChars) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else current += ' ' + word;
  }
  if (current) lines.push(current.trim());
  return lines;
}

function escapeXml(text) {
  return text?.replace(/[&<>"']/g, c => 
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])
  ) || '';
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
    allCaps = false,
    textAlign = 'center',
  } = params;

  const top = allCaps ? topText.toUpperCase() : topText;
  const bottom = allCaps ? bottomText.toUpperCase() : bottomText;

  const approxCharWidth = fontSize * 0.5;
  const maxChars = Math.floor((width - padding * 2) / approxCharWidth);

  const topLines = wrapIntoLines(top, maxChars);
  const bottomLines = wrapIntoLines(bottom, maxChars);
 
  const lineHeight = Math.round(fontSize * 1.2);
  
  let xPos, textAnchor;
  if (textAlign === 'left') {
    xPos = padding;
    textAnchor = 'start';
  } else if (textAlign === 'right') {
    xPos = width - padding;
    textAnchor = 'end';
  } else {
    xPos = Math.round(width / 2);
    textAnchor = 'middle';
  }
  
  const topStartY = padding - lineHeight;
  const bottomStartY = height - padding - (bottomLines.length * lineHeight);

  const toTspans = lines => lines
    .map((ln, i) => `<tspan x="${xPos}" dy="${i === 0 ? '0' : '1.2em'}">${escapeXml(ln)}</tspan>`)
    .join('');

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
  <text class="meme-text" x="${xPos}" y="${topStartY}" text-anchor="${textAnchor}">${toTspans(topLines)}</text>
  <text class="meme-text" x="${xPos}" y="${bottomStartY}" text-anchor="${textAnchor}">${toTspans(bottomLines)}</text>
</svg>`;

  return Buffer.from(svg);
}

module.exports = { buildOverlay };
