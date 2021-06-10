const mongoose = require("mongoose");
const config = require("../config/db.config");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

const currentEnv = process.env.URWA_ENV;
let mongoDBUrl = config[currentEnv].MONGO_DB_URL;
const options = {
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const connect = () => {
  logger.info("Setting up MongoDB connection");
  mongoose
    .connect(mongoDBUrl, options)
    .then(() => logger.info("MongoDB is successfully connected"))
    .catch((err) => {
      logger.error(`Connection to '${mongoDBUrl}' unsuccessful`);
      process.exit(1);
    });
  return mongoose;
};

exports.mongoose = connect();
