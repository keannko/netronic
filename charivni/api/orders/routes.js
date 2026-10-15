import { Router } from "express";
import { createOrderController, getAllOrdersController } from "./controlls.js";


export const ordersRouter = Router();

// usersRouter.post("/registration", createNewUserController);
// usersRouter.post("/login", loginUserController);
// usersRouter.post("/logout", logoutUserController);
// usersRouter.get("/refresh", refreshController);
// usersRouter.get("/bytoken", getUserByTokenController);
// usersRouter.get("/:id", getUserController);
ordersRouter.get("/", getAllOrdersController);
ordersRouter.post("/create", createOrderController);





