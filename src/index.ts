import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import morgan from "morgan"
import cors from 'cors';
import { AppDataSource } from "./data-source";
import { Router as userRouter } from "./routers/user.routes";
import { Router as carRouter } from "./routers/car.routes";
import options from "./middlewares/cors";
import path from "path";

if (process.env.NODE_ENV != "test") {
    dotenv.config();
}

if (process.env.NODE_ENV == "test") {
    dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
}

const app = express();
const port = process.env.PORT || 3080;

//middlewares
app.use(express.json());
app.use(cors(options));
app.use(express.urlencoded({extended: true}));
app.use(morgan("common"));

//routers
app.use("/api/users", userRouter);
app.use("/api/cars", carRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
