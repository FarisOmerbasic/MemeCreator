const { v4: uuidv4 } = require('uuid')

const configs = new Map();

function createConfig(payload) {
    const id = uuidv4();
    const newConfig = {id, ...payload};
    configs.set(id, newConfig);
    return newConfig;
}

function updateConfig(id, payload) {
    const existingConfig = configs.get(id);
    if (!existingConfig) {
        return null;
    }

    const updatedConfig = {...existingConfig, ...payload,id};
    configs.set(id, updatedConfig)
    return updatedConfig;
}

module.exports = {
    createConfig,
    updateConfig,
};