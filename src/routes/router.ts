import { Router } from "express";
import uploadImage from "../controller/image.controller.js";
import userController from "../controller/auth/user.js";

const router = Router();

router.post("/addUser",userController)

router.post("/uploads", uploadImage)

export default router;