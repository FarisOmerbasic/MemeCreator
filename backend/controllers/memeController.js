const imageService = require('../services/imageService');

function parseParams(req) {
    let params = {...req.body};
    if (typeof params.config === 'string') {
        try{params = {...params, ...JSON.parse(params.config)}} catch {}
        delete params.config;
    }
    params.fontSize = Math.max(8, Number(params.fontSize) || 48);
    params.strokeWidth = Math.max(0, Number(params.strokeWidth) || 4);
    params.padding = Math.max(0, Number(params.padding) || 20);
    const rawScale = Number(params.scaleDown || params.scale) || 0.05;
    params.scaleDown = Math.max(0.01, Math.min(0.25, rawScale));
    params.allCaps = params.allCaps === 'true' || params.allCaps === true;
   
    if (params.dpr) params.dpr = Math.max(1, Math.floor(Number(params.dpr) || 1));
    return params;
}

exports.preview = async (req, res) => {
  if (!req.files?.image?.[0]) return res.status(400).json({ error: 'Image is required' });
  try {
    const params = parseParams(req);
    if (req.query?.dpr) params.dpr = Math.max(1, Math.floor(Number(req.query.dpr) || 1))
    const out = await imageService.preview(req.files.image[0].buffer, params);
    const format = (params.outputFormat || 'png').toLowerCase();
    const contentType = format === 'jpeg' || format === 'jpg' ? 'image/jpeg' : 'image/png';
    res.set('Content-Type', contentType)
    .set('Preview-Width', String(out.width))
    .set('Preview-Height', String(out.height))
    .send(out.buffer)
  } catch (err) {
    console.error('Preview error', err);
    res.status(500).json({ error: 'Cannot show preview' });
  }
};

exports.generate = async (req, res) => {
  if (!req.files?.image?.[0]) return res.status(400).json({ error: 'Image is required' });
  try {
    const params = parseParams(req);
    const out = await imageService.generate(req.files.image[0].buffer, params);
    const format = (params.outputFormat || 'png').toLowerCase();
    const contentType = format === 'jpeg' || format === 'jpg' ? 'image/jpeg' : 'image/png';
    res.set('Content-Type', contentType);
  } catch (err) {
    console.error('Generate error', err);
    res.status(500).json({ error: 'Cannot generate image' });
  }
};

