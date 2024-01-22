"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = __importDefault(require("../utils/apiError"));
class HandleAllError {
    constructor() {
        this.sendErrorForDev = (err, res) => {
            res.status(err.statusCode).json({
                status: err.status,
                error: err.statusCode,
                message: err.message,
                stack: err.stack,
            });
        };
        this.sendErrorForProd = (err, res) => {
            res.status(err.statusCode).json({
                status: err.status,
                error: err,
            });
        };
        this.handleJwtInvalidsignature = () => new apiError_1.default("Invalid token,Please login again....", 400);
        this.handleJwtExpired = () => new apiError_1.default("Expired token,Please login again....", 400);
        this.globalError = (err, req, res, next) => {
            err.statusCode = err.statusCode || 500;
            err.status = err.status || "error";
            if (process.env.NODE_ENV === "development") {
                this.sendErrorForDev(err, res);
            }
            else {
                if (err.name === "JsonWebTokenError")
                    err = this.handleJwtInvalidsignature();
                if (err.name === "TokenExpiredError")
                    err = this.handleJwtExpired();
                this.sendErrorForProd(err, res);
            }
        };
    }
}
exports.default = new HandleAllError();
