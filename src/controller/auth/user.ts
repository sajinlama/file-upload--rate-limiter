import { asyncHandler } from "../../utils/asyncWrapper.js";
import type { Request, Response } from "express";
import userSchema from "../../validator/user.js";
import { newUSer } from "../../service/Adduser.js";

const userController = asyncHandler(
  async (req: Request, res: Response) => {
    const validData = userSchema.parse(req.body);

    const createUser = await newUSer(validData);


    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: validData,
    });
  }
);

export default userController;
