import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import ApiError from "../utils/apiError";
import User from "../models/userModel";

class UserServices {
  getUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const page: number = parseInt(req.query.page as string, 10) * 1 || 1;
      const limit: number = parseInt(req.query.limit as string, 10) * 1 || 5;
      const skip: number = (page - 1) * limit;

      const users = await User.find().skip(skip).limit(limit);
      res.status(200).json({ result: users.length, page, data: users });
    }
  );
  getUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        return next(new ApiError(`No user for this: ${id}`, 404));
      }
      res.status(200).json({ data: user });
    }
  );
  createUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.create(req.body);
      res.status(201).json({ data: user });
    }
  );
  updateUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          phone: req.body.phone,
          slug: req.body.slug,
          email: req.body.email,
          role: req.body.role,
          profileImg: req.body.profileImg,
        },
        { new: true }
      );
      if (!user) {
        return next(new ApiError(`No user for this: ${req.params.id}`, 400));
      }
      res.status(200).json({ data: user });
    }
  );
  changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const document = await User.findByIdAndUpdate(
        req.params.id,
        {
          password: await bcrypt.hash(req.body.password, 12),
          passwordChangedAt: Date.now(),
        },
        {
          new: true,
        }
      );
      if (!document) {
        return next(
          new ApiError(`No document for this id: ${req.params.id}`, 404)
        );
      }
      res.status(201).json({ data: document });
    }
  );
  deleteUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return next(new ApiError(`No user for this: ${id}`, 400));
      }
      res.status(204);
    }
  );
}
export default new UserServices();
