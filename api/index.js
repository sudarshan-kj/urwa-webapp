const express = require("express");
const port = process.env.PORT || 9000;
const app = express();

const { UsersRoutes } = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/users", UsersRoutes);
app.listen(port, () => console.log(`Listening on port ${port}`));
