const mongoose = require("mongoose");
const config = require("../config/db.config");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

const currentEnv = process.env.URWA_ENV;
let mongoDBUrl;
if (currentEnv) {
  mongoDBUrl = config[currentEnv].MONGO_DB_URL;
}
const options = {
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const connect = () => {
  logger.debug("Setting up MongoDB connection with retry");
  try {
    mongoose
      .connect(mongoDBUrl, options)
      .then(() => logger.info("MongoDB is successfully connected"));
  } catch {
    logger.error(`Connection to ${mongoDBUrl} unsuccessful`);
  }
};

connect();

exports.mongoose = mongoose;
