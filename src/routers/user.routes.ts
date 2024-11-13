import express from "express";
export const Router = express.Router();
import { userControllers } from "../controllers/user.controlers";

Router.get("/users", userControllers.findAll);
Router.post("/users", userControllers.create);
Router.post("/login", userControllers.login);
Router.get("/users/:id", userControllers.findById);
Router.get("/users/:email/email", userControllers.findByEmail);
Router.put("/users/:id", userControllers.update);
Router.delete("/users/:id", userControllers.delete);
