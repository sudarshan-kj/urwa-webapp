require("./services/init.service");
const express = require("express");
const port = process.env.PORT || 9000;
const cors = require("cors");
const app = express();
const log4j = require("log4js");
const logger = log4j.getLogger();
logger.level = "debug";
const {
  AuthRoutes,
  MembersRoutes,
  AdminMembersRoutes,
  PaymentRoutes,
} = require("./routes");

//Test app
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/auth", AuthRoutes);
apiRouter.use("/members", MembersRoutes);
apiRouter.use("/adminMembers", AdminMembersRoutes);
apiRouter.use("/payments", PaymentRoutes);

app.listen(port, () => logger.info(`Listening on port ${port}`));
