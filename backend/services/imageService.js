const sharp = require('sharp')

function buildOverlay(width, height, params) {
    const {
    topText = '',
    bottomText = '',
    fontfamily = 'Impact',
    fontSize = 64,
    textColor = 'FFFFFF',
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

}