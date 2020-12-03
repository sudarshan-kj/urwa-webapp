module.exports = {
  local: {
    MONGO_DB_USERNAME: "admin",
    MONGO_DB_PASSWORD: "admin",
    MONGO_DB_URL: "mongodb://localhost/urwa",
  },
  production: {
    MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME,
    MONGO_DB_PASSWORD: process.env.MONGO_DB_USERNAME,
    MONGO_DB_URL: `mongodb+srv://kjsudikjsudi:qwerty64504099@cluster0.fpezm.mongodb.net/test?retryWrites=true&w=majority`,
  },
};
