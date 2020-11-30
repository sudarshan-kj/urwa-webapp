module.exports = {
  accessToken: {
    exp: "1d",
    secret: process.env.AT_SECRET,
  },
  refreshToken: {
    exp: "7d",
    secret: process.env.RT_SECRET,
  },
};
