import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

class HandleAllError {
  sendErrorForDev = (err: any, res: Response) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err.statusCode,
      message: err.message,
      stack: err.stack,
    });
  };
  sendErrorForProd = (err: any, res: Response) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
    });
  };
  handleJwtInvalidsignature = () =>
    new ApiError("Invalid token,Please login again....", 400);

  handleJwtExpired = () =>
    new ApiError("Expired token,Please login again....", 400);

  globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
      this.sendErrorForDev(err, res);
    } else {
      if (err.name === "JsonWebTokenError")
        err = this.handleJwtInvalidsignature();
      if (err.name === "TokenExpiredError") err = this.handleJwtExpired();
      this.sendErrorForProd(err, res);
    }
  };
}
export default new HandleAllError();
