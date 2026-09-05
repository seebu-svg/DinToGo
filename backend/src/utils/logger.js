const levels = { error: 0, warn: 1, info: 2, debug: 3 };

const logger = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  _log(level, message, meta = '') {
    if (levels[level] <= levels[this.level]) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      if (meta) {
        console.log(`${prefix} ${message}`, typeof meta === 'string' ? meta : JSON.stringify(meta, null, 2));
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  },
  error(msg, meta) { this._log('error', msg, meta); },
  warn(msg, meta) { this._log('warn', msg, meta); },
  info(msg, meta) { this._log('info', msg, meta); },
  debug(msg, meta) { this._log('debug', msg, meta); },
};

module.exports = logger;
