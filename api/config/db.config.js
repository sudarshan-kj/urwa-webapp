module.exports = {
  local: {
    MONGO_DB_USERNAME: "admin",
    MONGO_DB_PASSWORD: "admin",
    MONGO_DB_URL:
      "mongodb://127.0.0.1:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
  },
  production: {
    MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME,
    MONGO_DB_PASSWORD: process.env.MONGO_DB_USERNAME,
    MONGO_DB_URL: `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@cluster0.fpezm.mongodb.net/test?retryWrites=true&w=majority`,
  },
};
