import express from "express";
const Router = express.Router();

import { carController } from "../controllers/car.controller";
import { AuthMiddleware } from "../middlewares/authmid";

Router.get("/", AuthMiddleware.isAuthenticated, carController.findAll);
Router.post("/", AuthMiddleware.isAuthenticated, carController.create);
Router.put("/:id", AuthMiddleware.isAuthenticated, carController.update);
Router.delete("/:id", AuthMiddleware.isAuthenticated, carController.delete);
Router.get("/:id", AuthMiddleware.isAuthenticated, carController.findById);

export { Router };
