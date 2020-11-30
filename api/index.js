const express = require("express");
const port = process.env.PORT || 9000;
const app = express();
const log4j = require("log4js");
const logger = log4j.getLogger();
logger.level = "debug";
const { MembersRoutes } = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/users", MembersRoutes);
app.listen(port, () => logger.info(`Listening on port ${port}`));
