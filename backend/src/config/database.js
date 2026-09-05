const { Sequelize } = require('sequelize');
const config = require('./index');
const logger = require('../utils/logger');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: config.env === 'development' ? (msg) => logger.debug(`[SQL] ${msg}`) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
  },
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    logger.info('[DB] PostgreSQL connection established');
    return sequelize;
  } catch (error) {
    logger.error('[DB] Connection failed:', error.message);
    throw error;
  }
}

module.exports = { sequelize, connectDB, Sequelize };
