import express, { Express, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbconnection from "./config/database";
import userRoutes from "./routes/userRoute";
import authRoutes from "./routes/authRoute";
import ApiError from "./utils/apiError";
import HandleAllError from "./middleware/errorMiddleware";
import { IUser } from "./models/userModel";
dotenv.config({ path: "config.env" });

const app: Express = express();
declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
// middleware

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode :  ${process.env.NODE_ENV}`);
}
//Mount Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.all("*", (req, res, next): void => {
  // create error and send it to error handling middleware
  // const err = new Error("cant find this route:"+ req.originalUrl);
  // next(err.message);
  next(new ApiError(`cant find this route:${req.url}`, 400));
});

app.use(HandleAllError.globalError);

const PORT: number = parseInt(process.env.PORT as string, 10);
app.listen(PORT, () => {
  console.log(`app is Running on port ${PORT}`);
  dbconnection();
});
