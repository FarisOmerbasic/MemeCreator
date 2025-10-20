const imageService = require('../services/imageService');

function parseParams(req) {
    let params = {...req.body};
    if (typeof params.config === 'string') {
        try{params = {...params, ...JSON.parse(params.config)}} catch {}
        delete params.config;
    }
    params.fontSize = Math.max(8, Number(params.fontSize) || 64);
    params.strokedWidth = Math.max(0, Number(params.strokedWidth) || 3);
    params.padding = Math.max(0, Number(params.padding) || 20);
    params.scaleDown = Number(params.scaleDown || params.scale) || 0.05;
    params.allCaps = params.allCaps === 'true' || params.allCaps === true;
   
    return params;
}

exports.preview = async (req, res) => {
  if (!req.files?.image?.[0]) return res.status(400).json({ error: 'Image is required' });
  try {
    const params = parseParams(req);
    const out = await imageService.preview(req.files.image[0].buffer, params);
    res.set('Content-Type', 'image/png').send(out);
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
    res.set('Content-Type', 'image/png').send(out);
  } catch (err) {
    console.error('Generate error', err);
    res.status(500).json({ error: 'Cannot generate image' });
  }
};

