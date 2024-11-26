module.exports = {
  PORT: process.env.PORT || "3000",
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  CONNECTION_STRING:
    process.env.CONNETCION_STRING || "mongodb://localhost:27017/backend",
  JWT: {
    SECRET: "123456",
    EXPIRE_TIME: !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME))
      ? parseInt(process.env.TOKEN_EXPIRE_TIME)
      : 86400, // 24 * 60 * 60
  },
  DEFAULT_LANG: process.env.DEFAULT_LANG || "EN",
};
