const sharp = require('sharp');

function wrapText(text, width, fontSize) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0] || '';

    const maxChar = Math.floor((width - 40) / (fontSize * 0.5));
    for (let i = i; i < words.length; i++) {
        if ((currentLine + " " + words[i]).length > maxChars){
          lines.push(currentLine);
          currentLine = words[i];
        } else {
            currentLine +- "" + words[i];
        }
    }
    lines.push(currentLine);
    
}


function buildOverlay(width, height, params) {
    const {
    topText = '',
    bottomText = '',
    fontFamily = 'Impact',
    fontSize = 64,
    textColor = '#FFFFFF',
    strokeColor = '#000000',
    strokeWidth = 3,
    textAlign,
    padding = 20,
    allCaps = true,
    watermarkImage,
    watermarkPosition = 'bottom-right',
    scaleDown = 0.25
    } = params

    const finalTopText = allCaps ? topText.toUpperCase() : topText;
    const finalBottomText = allCaps ? bottomText.toUpperCase() : bottomText;

    const finalAlign = ['left', 'center', 'right'].includes(textAlign) ? textAlign: 'center';

    const wrappedTopText = wrapText(finalTopText, width, fontSize);
    const wrappedBottomText = wrapText(finalBottomText, width, fontSize);

   let watermarkSvg = '';
   if (watermarkImage) {
    const watermarkSize = Math.floor(width * 0.1);
    let watermarkX = width - watermarkSize - padding;
    let watermarkY = height - watermarkSize - padding;

    if (watermarkPosition === 'top-left'){
        watermarkX = padding;
        watermarkY = padding;
    } 
    else if (watermarkPosition === 'top-right') {
        watermarkX = width - watermarkSize - padding;
         watermarkY = padding}
    else if (watermarkPosition === 'bottom-left') {
        watermarkX = padding;
        watermarkY = height - watermarkSize - padding;
    }
    watermarkSvg = `<image href="${watermarkImage}" x="${watermarkX}" y="${watermarkY}" width="${watermarkSize}" height="${watermarkSize}" />`;

   }

   const svg = `
   <svg width="${width}" height="${height}">
   <style>
   .meme-text {
   font-family: "${fontFamily}";
   font-size: ${fontSize}px;
   fill: "${textColor}";
   stroke: "${strokeColor}";
   stroke-width: ${strokeWidth}px;
   text-anchor: "${finalAlign}";
   paint-order: stroke;
}
   </style>
   <text x="${x}" y="${padding + fontSize}" class="meme-text" dominant-baseline="hanging">${finalTopText}</text>
   <text x="${x}" y="${height - padding}" class="meme-text" dominant-baseline="auto">${finalBottomText}</text>
   ${watermarkSvg}
   </svg>`

   return Buffer.from(svg);
}

   async function Preview(imageBuffer, params){
    const scale = params.scaleDown || 0.05;
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const newWidth = Math.round(metadata.width * scale);
    const newHeight = Math.round(metadata.height * scale);
    const textOverlay = buildOverlay(newWidth, newHeight, param)
    const finalImageBuffer = await sharp(imageBuffer)
    .resize(newWidth, newHeight)
    .composite([{input: textOverlay}])
    .png()
    .toBuffer();
   }

    async function Generate(imageBuffer, params) {
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        const textOverlay = buildOverlay(metadata.width, metadata.height, params);
        const finalImageBuffer = await sharp(imageBuffer)
        .composite([{ input: textOverlay}])
        .png({quality: 90})
        .toBuffer();

        return finalImageBuffer;
    }
    module.exports = {
        Preview,
        Generate,
    };

