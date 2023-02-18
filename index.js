require("express-async-errors");
const express = require("express");
const app = express();
const ListsRouter = require("./routes/lists");
// extra security packages
// const helmet = require("helmet");
// const cors = require("cors");
// const xss = require("xss-clean");
require("dotenv").config();

const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(express.json());
// app.use(helmet());
// app.use(cors());

app.use(express.static("./public"));

app.use("/api/v1/lists", ListsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server is listening on port: ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
