import { Router } from "express";
import { createArticleController, deleteArticleController, editArticleController, getAllArticlesController, getArticleByIdController } from "./controlls.js";



export const blogRouter = Router();


blogRouter.get("/", getAllArticlesController);
blogRouter.post("/create", createArticleController);
blogRouter.get("/delete/:id", deleteArticleController);
blogRouter.post("/edit", editArticleController);
blogRouter.get("/:id", getArticleByIdController);






