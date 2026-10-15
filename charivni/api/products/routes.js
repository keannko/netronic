import { Router } from "express";
import { createProductController, deleteProductController, getOneProductController, getProductsController, updateProductController } from "./controlls.js";
import authMiddleware from "../middlewares/auth-middleware.js";

export const productsRouter = Router();

productsRouter.get("/", getProductsController);
// productsRouter.get("/", authMiddleware, getProductsController);
productsRouter.post("/create", createProductController);
productsRouter.post("/update", updateProductController);
productsRouter.get("/delete/:id", deleteProductController);
productsRouter.get("/:id", getOneProductController);
