import { Router } from "express";
import uploadImage from "../controller/image.controller.js";

const router = Router();

router.post("/uploads", uploadImage)

export default router;