import { Router } from "express";
import uploadImage from "../controller/image.controller.js";
import userController from "../controller/auth/user.js";
import upload from "../midlleware/multer.middleware.js";
import { authLimiter, uploadLimiter } from "../midlleware/reteLimmiter.js";


const router = Router();

router.post("/addUser", authLimiter,userController)

router.post("/upload", uploadLimiter ,upload.single("image"),uploadImage)

export default router;