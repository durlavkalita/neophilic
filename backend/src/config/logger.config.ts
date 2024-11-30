import { pino } from "pino";

const logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination("./app-logger.log")
);

export default logger;
