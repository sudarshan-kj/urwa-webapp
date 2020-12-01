const log4j = require("log4js");
const logger = log4j.getLogger();
logger.level = "debug";
const envConfig = require("../config/env.config");

const checkEnvVars = () => {
  const urwaEnvVar = process.env[envConfig.URWA_ENV_VAR];
  if (!urwaEnvVar) {
    logger.error(`${envConfig.URWA_ENV_VAR} env variable is not set`);
    logger.info("Exiting process");
    process.exit(1);
  } else {
    switch (urwaEnvVar) {
      case "local":
      case "production":
        return;
      default: {
        logger.error(`Invalid value set for ${envConfig.URWA_ENV_VAR}`);
        logger.info("Exiting process");
        process.exit(1);
      }
    }
  }
};

const preCheckAppConfig = () => {
  logger.debug("Performing app config pre check");
  checkEnvVars();
  logger.debug("App pre check successful");
};

preCheckAppConfig();
