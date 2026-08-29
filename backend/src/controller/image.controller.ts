import { asyncHandler } from "../utils/asyncWrapper.js";
import type { Request, Response } from "express";
import addUrl from "../service/uploadService.js";
import fs from "fs/promises";
import { uploadToCloudinary } from "../service/uploadCloudinary.js";

const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "file is required",
    });
  }

  const userId = req.body.userId || req.body.userid;
  console.log(userId, "this is userid");

  if (!userId) {
    await fs.unlink(req.file.path);

    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }
  console.log(req.file.path,"this if file path");
  try {
    const cloudinaryResult = await uploadToCloudinary(req.file.path);

    const result = await addUrl({
      imageUrl: cloudinaryResult.secure_url,
      userId: Number(userId),
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } finally {
    // Always clean up local temp file, even if upload/db fails
    await fs.unlink(req.file.path).catch((err) =>
      console.error("Failed to delete temp file:", err)
    );
  }
});

export default uploadImage;