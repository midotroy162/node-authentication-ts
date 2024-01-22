import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// @desc finds the validation errors in this request and warps them in an object with handy functions
const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
export default validatorMiddleware;
