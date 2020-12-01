module.exports = {
  local: {
    MONGO_DB_USERNAME: "admin",
    MONGO_DB_PASSWORD: "admin",
    MONGO_DB_URL: "mongodb://localhost/urwa",
  },
  production: {
    MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME,
    MONGO_DB_PASSWORD: process.env.MONGO_DB_USERNAME,
    MONGO_DB_URL: `mongodb+srv://${this.MONGO_DB_USERNAME}:${this.MONGO_DB_PASSWORD}@cluster0.fpezm.mongodb.net/test?retryWrites=true&w=majority`,
  },
};
