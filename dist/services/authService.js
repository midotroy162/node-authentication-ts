"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const userModel_1 = __importDefault(require("../models/userModel"));
const createToken_1 = __importDefault(require("../utils/createToken"));
class AuthService {
    constructor() {
        // @desc   signup
        // @route  Post /api/v1/auth/signup
        // @access Public
        this.signup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // 1-create user
            const user = yield userModel_1.default.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            // 2-generate token
            const token = (0, createToken_1.default)(user._id);
            res.status(201).json({ data: user, token });
        }));
        // @desc   login
        // @route  Post /api/v1/auth/login
        // @access Public
        this.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // 1- check if email and password in the body (validation)
            // 2- check if user exit & check if password is correct
            const user = yield userModel_1.default.findOne({ email: req.body.email });
            if (!user || !(yield bcryptjs_1.default.compare(req.body.password, user.password))) {
                return next(new apiError_1.default("Incorrect E-mail or Password", 404));
            }
            // 3- generate token
            const token = (0, createToken_1.default)(user._id);
            // 4- send response
            res.status(200).json({ data: user, token });
        }));
        // @desc make sure that user login
        this.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // 1-check if token exist,if exist get
            let token;
            if (req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")) {
                token = yield req.headers.authorization.split(" ")[1];
            }
            if (!token) {
                return next(new apiError_1.default("You are not login, Please login to get access this route", 401));
            }
            let decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            console.log(decoded.userId);
            // 3-check if user exists
            const currentUser = yield userModel_1.default.findById(decoded.userId);
            if (!currentUser) {
                return next(new apiError_1.default("the User that belong to this token does no longer exist", 401));
            }
            // 4-check if user change password after token created
            if (currentUser.passwordChangedAt) {
                const passChangedTimestamp = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
                //       parseInt(
                //   currentUser.passwordChangedAt.getTime() / 1000,
                //   10
                // );
                // password changed after token created(Error)
                if (passChangedTimestamp > decoded.iat) {
                    return next(new apiError_1.default("user recently changed his password. please login again", 404));
                }
            }
            req.user = currentUser;
            next();
        }));
        // @desc Authorization (User Permissions)
        // ["admin","manager"]
        this.allowedTo = (...roles) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // 1- access roles
            // 2- access registered user (req.user.role)
            if (!roles.includes(req.user.role)) {
                return next(new apiError_1.default("You are not Allowed to access this route", 403));
            }
            next();
        }));
    }
}
exports.default = new AuthService();
