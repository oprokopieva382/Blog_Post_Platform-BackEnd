import { createLogger, format, transports } from "winston";
import { format as formatDate } from "date-fns";

const { combine, printf, colorize } = format;

const logFormat = printf(({ level, message }) => {
  const timestamp = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
  return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(colorize(), logFormat),
  transports: [new transports.Console()],
});
