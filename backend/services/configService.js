const { v4: uuidv4 } = require('uuid')

const dbConfig = {
    host: process.env.DB_HOST || 'mssql',
    port: Number(process.env.DB_PORT || 1433),
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'MemeDB'
};

const isDbConfigured = Boolean(process.env.DB_HOST && !['localhost', '127.0.0.1']
    .includes(process.env.DB_HOST));

    const configs = new Map();

function createConfig(payload) {
    const id = uuidv4();
    const newConfig = {id, ...payload};
    configs.set(id, newConfig);
    return newConfig;
}

function updateConfig(id, payload) {
    const existingConfig = configs.get(id);
    if (!existingConfig) return null;
    const updatedConfig = {...existingConfig, ...payload,id};
    configs.set(id, updatedConfig)
    return updatedConfig;
}

module.exports = {
    createConfig,
    updateConfig, dbConfig, isDbConfigured
};