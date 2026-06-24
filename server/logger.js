const winston = require("winston");

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: process.env.NODE_ENV === "production" ? logFormat : devFormat,
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = logger;
