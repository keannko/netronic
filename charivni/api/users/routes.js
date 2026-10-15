import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import { createNewUserController, getAllUsersController, getUserByTokenController, getUserController, loginUserController, logoutUserController, refreshController } from "./controlls.js";


export const usersRouter = Router();

usersRouter.post("/registration", createNewUserController);
usersRouter.post("/login", loginUserController);
usersRouter.post("/logout", logoutUserController);
usersRouter.get("/refresh", refreshController);
usersRouter.get("/bytoken", getUserByTokenController);
usersRouter.get("/:id", authMiddleware, getUserController);
usersRouter.get("/", authMiddleware, getAllUsersController);





