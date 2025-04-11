/**
 * Logger middleware for the Express server
 * Provides enhanced logging capabilities beyond morgan
 */

const fs = require('fs');
const path = require('path');

// Create timestamp for logs
const getTimestamp = () => {
  return new Date().toISOString();
};

// Make sure the logs directory exists
const ensureLogDirectory = () => {
  const logDir = path.join(__dirname, '../../memlog/logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
};

// Log to file
const logToFile = (message, type = 'info') => {
  const logDir = ensureLogDirectory();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const logFile = path.join(logDir, `server-${today}.log`);
  
  const logMessage = `[${getTimestamp()}] [${type.toUpperCase()}] ${message}\n`;
  
  fs.appendFileSync(logFile, logMessage);
};

// Create logger object
const logger = {
  info: (message) => {
    console.log(`[INFO] ${message}`);
    logToFile(message, 'info');
  },
  
  warn: (message) => {
    console.warn(`[WARN] ${message}`);
    logToFile(message, 'warn');
  },
  
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error || '');
    let logMessage = message;
    if (error) {
      logMessage += ` - ${error.message}`;
      if (error.stack) {
        logMessage += `\n${error.stack}`;
      }
    }
    logToFile(logMessage, 'error');
  },
  
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`);
      logToFile(message, 'debug');
    }
  },
  
  request: (req, res, time) => {
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${time}ms`;
    console.log(`[REQUEST] ${message}`);
    logToFile(message, 'request');
  }
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Once the response is finished
  res.on('finish', () => {
    const time = Date.now() - start;
    logger.request(req, res, time);
  });
  
  next();
};

module.exports = {
  logger,
  requestLogger
};
