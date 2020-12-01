const log4j = require("log4js");
const logger = log4j.getLogger();
logger.level = "debug";
const envConfig = require("../config/env.config");

const invalidValueSet = (envVariable) => {
  logger.error(`Invalid value set for ${envVariable}`);
};

const envVarNotSet = (envVariable) => {
  logger.error(`${envVariable} env variable is not set`);
};

const callExit = () => {
  logger.info("Exiting process");
  process.exit(1);
};

const checkUrwaEnv = () => {
  const urwaEnvVar = process.env[envConfig.URWA_ENV_VAR];
  if (!urwaEnvVar) {
    envVarNotSet(envConfig.URWA_ENV_VAR);
    callExit();
  } else {
    switch (urwaEnvVar) {
      case "local":
      case "production":
        return;
      default: {
        invalidValueSet(envConfig.URWA_ENV_VAR);
        callExit();
      }
    }
  }
};

const checkTokenEnv = () => {
  const atEnvVar = process.env[envConfig.AT_ENV_SECRET_VAR];
  const rtEnvVar = process.env[envConfig.RT_ENV_SECRET_VAR];
  if (!atEnvVar) {
    envVarNotSet(envConfig.AT_ENV_SECRET_VAR);
    callExit();
  }
  if (!rtEnvVar) {
    envVarNotSet(envConfig.RT_ENV_SECRET_VAR);
    callExit();
  }
};

const checkMongoDbEnv = () => {
  const urwaEnv = process.env[envConfig.URWA_ENV_VAR];
  if (urwaEnv && urwaEnv !== "local") {
    logger.info(`Environment: ${urwaEnv}. Performing db config check`);
    const mongoUserNameEnvVar =
      process.env[envConfig.MONGO_DB_ENV_USERNAME_VAR];
    const mongoPasswordEnvVar =
      process.env[envConfig.MONGO_DB_ENV_PASSWORD_VAR];
    if (!mongoUserNameEnvVar) {
      envVarNotSet(envConfig.MONGO_DB_ENV_USERNAME_VAR);
      callExit();
    }
    if (!mongoPasswordEnvVar) {
      envVarNotSet(envConfig.MONGO_DB_ENV_PASSWORD_VAR);
      callExit();
    }
  }
};

const checkEnvVars = () => {
  checkUrwaEnv();
  checkTokenEnv();
  checkMongoDbEnv();
};

const preCheckAppConfig = () => {
  logger.debug("Performing app config pre check");
  checkEnvVars();
  logger.debug("App pre check successful");
};

preCheckAppConfig();
