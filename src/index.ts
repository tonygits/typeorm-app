import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import morgan from "morgan"
import cors from 'cors';
import { AppDataSource } from "./database/config";
import { Router as userRouter } from "./routers/user.routes";
import { Router as carRouter } from "./routers/car.routes";
import options from "./middlewares/cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3080;

//middlewares
app.use(express.json());
app.use(cors(options));
app.use(express.urlencoded({extended: true}));
app.use(morgan("common"));

//routers
app.use("/api", userRouter);
app.use("/api", carRouter);

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
