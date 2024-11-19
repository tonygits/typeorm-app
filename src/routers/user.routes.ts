import express from "express";

export const Router = express.Router();
import {userControllers} from "../controllers/user.controlers";

Router.get("/", userControllers.findAll);
Router.post("/", userControllers.create);
Router.post("/login", userControllers.login);
Router.get("/:id", userControllers.findById);
Router.get("/:email/email", userControllers.findByEmail);
Router.put("/:id", userControllers.update);
Router.delete("/:id", userControllers.delete);
