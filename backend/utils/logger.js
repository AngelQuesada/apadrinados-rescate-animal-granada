import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const levelIcons = {
  error: "❌",
  warn: "⚠️",
  info: "ℹ️",
  http: "🌐",
  verbose: "🔊",
  debug: "🐛",
  silly: "🤪",
};

// Formato custom del log
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const icon = levelIcons[level] || "📝";
  return `${icon} ${level.toUpperCase()} | ${timestamp} | ${message}`;
});

const transport = new winston.transports.DailyRotateFile({
  filename: "app",
  dirname: logDirectory,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  extension: ".log",
  auditFile: path.join(logDirectory, "audit.json"),
  symlinkName: "current.log",
  createSymlink: true,
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "HH:mm:ss",
    }),
    customFormat
  ),
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
          const cleanLevel = level.replace(/\u001b\[[0-9]{1,2}m/g, "");
          const icon = levelIcons[cleanLevel] || "📝";
          return `${icon}  | ${message} | ${timestamp}`;
        })
      ),
    }),
  ],
});

export default logger;
