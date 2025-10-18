const sharp = require('sharp');
const { param } = require('../routes/config');

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

    const enumAlignments = ['left', 'center', 'right',]
    const finalAlign = enumAlignments.includes(textAlign) ? textAlign: 'center';

   let x = width / 2;
   if(finalAlign === 'left') {
    x = padding;
   } else if (finalAlign === 'right') {
    x = width - padding
   }

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
        Generate,
    };

