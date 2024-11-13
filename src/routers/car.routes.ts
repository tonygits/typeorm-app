import express from "express";
const Router = express.Router();

import { carController } from "../controllers/car.controller";
import { AuthMiddleware } from "../middlewares/authmid";

Router.get("/cars", AuthMiddleware.isAuthenticated, carController.findAll);
Router.post("/cars", AuthMiddleware.isAuthenticated, carController.create);
Router.put("/cars/:id", AuthMiddleware.isAuthenticated, carController.update);
Router.delete("/cars/:id", AuthMiddleware.isAuthenticated, carController.delete);
Router.get("/cars/:id", AuthMiddleware.isAuthenticated, carController.findById);

export { Router };
