import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiError from "../utils/apiError";
import User from "../models/userModel";
import createToken from "../utils/createToken";

class AuthService {
  // @desc   signup
  // @route  Post /api/v1/auth/signup
  // @access Public
  signup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1-create user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      // 2-generate token
      const token = createToken(user._id);
      res.status(201).json({ data: user, token });
    }
  );
  // @desc   login
  // @route  Post /api/v1/auth/login
  // @access Public
  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- check if email and password in the body (validation)
      // 2- check if user exit & check if password is correct
      const user = await User.findOne({ email: req.body.email });

      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("Incorrect E-mail or Password", 404));
      }
      // 3- generate token
      const token = createToken(user._id);
      // 4- send response
      res.status(200).json({ data: user, token });
    }
  );
  // @desc make sure that user login
  protect = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1-check if token exist,if exist get
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = await req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return next(
          new ApiError(
            "You are not login, Please login to get access this route",
            401
          )
        );
      }
      // 2-verify token (no change happens, expired token )
      interface JwtUser extends JwtPayload {
        userId: string;
      }
      let decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as JwtUser;
      console.log(decoded.userId);
      // 3-check if user exists
      const currentUser = await User.findById(decoded.userId);
      if (!currentUser) {
        return next(
          new ApiError(
            "the User that belong to this token does no longer exist",
            401
          )
        );
      }
      // 4-check if user change password after token created
      if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = Math.floor(
          currentUser.passwordChangedAt.getTime() / 1000
        );
        //       parseInt(
        //   currentUser.passwordChangedAt.getTime() / 1000,
        //   10
        // );
        // password changed after token created(Error)
        if (passChangedTimestamp > (decoded.iat as number)) {
          return next(
            new ApiError(
              "user recently changed his password. please login again",
              404
            )
          );
        }
      }

      req.user = currentUser;
      next();
    }
  );
  // @desc Authorization (User Permissions)
  // ["admin","manager"]
  allowedTo = (...roles: string[]) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      // 1- access roles
      // 2- access registered user (req.user.role)
      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError("You are not Allowed to access this route", 403)
        );
      }
      next();
    });
}

export default new AuthService();
