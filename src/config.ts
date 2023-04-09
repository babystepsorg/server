const dotenv = require("dotenv");

type BabyStepsConfigType = {
  keepAliveTimeout: number;
  port: number;
  logLevel: string;
};

function getOptionalConfigFromEnv(key: string): string | undefined {
  return process.env[key];
}

export function getConfig(): BabyStepsConfigType {
  dotenv.config();

  return {
    keepAliveTimeout: parseInt(
      getOptionalConfigFromEnv("SERVER_KEEP_ALIVE_TIMEOUT") || "61",
      10
    ),
    port: Number(getOptionalConfigFromEnv("PORT")) || 5000,
    logLevel: getOptionalConfigFromEnv("LOG_LEVEL") || "info",
  };
}
