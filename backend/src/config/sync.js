const { sequelize } = require('./database');
require('../models');

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
})();
