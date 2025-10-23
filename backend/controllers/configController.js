const configService = require('../services/configService');

exports.createConfig = async (req, res) => {
  try {
  const newConfig = await configService.createConfig(req.body);
  res.status(201).json(newConfig);
  } catch (err) {
    res.status(500).json({error: err.message || 'createConfig has failed'})
}};

exports.updateConfig = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await configService.updateConfig(id, req.body);
    if (!updated) return res.status(404).json({error: 'config is not found'})
    res.json(updated);
  } catch (err) {
    res.status(500).json({error: err.message || 'updateConfig failed'})
  }}