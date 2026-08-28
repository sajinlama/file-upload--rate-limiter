import { Router } from "express";
import uploadImage from "../controller/image.controller.js";
import userController from "../controller/auth/user.js";
import upload from "../midlleware/multer.middleware.js";

const router = Router();

router.post("/addUser",userController)

router.post("/uploads", upload,uploadImage)

export default router;