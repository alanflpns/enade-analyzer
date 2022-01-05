import { format, addColors } from "winston";
import { LoggerTraceability } from "traceability";

const colors = {
  info: "green",
  warn: "yellow",
  error: "red",
};
const colorizer = format.colorize();
addColors(colors);

const conf = LoggerTraceability.getLoggerOptions();
const formated = format.combine(
  format.timestamp(),
  format.simple(),
  format.printf(
    (msg) =>
      `${colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}:`)} ${
        msg.message
      }`
  )
);
conf.format = formated;
LoggerTraceability.configure(conf);
