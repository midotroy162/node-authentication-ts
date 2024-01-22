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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const userModel_1 = __importDefault(require("../models/userModel"));
class UserServices {
    constructor() {
        this.getUsers = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page, 10) * 1 || 1;
            const limit = parseInt(req.query.limit, 10) * 1 || 5;
            const skip = (page - 1) * limit;
            const users = yield userModel_1.default.find().skip(skip).limit(limit);
            res.status(200).json({ result: users.length, page, data: users });
        }));
        this.getUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield userModel_1.default.findById(id);
            if (!user) {
                return next(new apiError_1.default(`No user for this: ${id}`, 404));
            }
            res.status(200).json({ data: user });
        }));
        this.createUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.create(req.body);
            res.status(201).json({ data: user });
        }));
        this.updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                phone: req.body.phone,
                slug: req.body.slug,
                email: req.body.email,
                role: req.body.role,
                profileImg: req.body.profileImg,
            }, { new: true });
            if (!user) {
                return next(new apiError_1.default(`No user for this: ${req.params.id}`, 400));
            }
            res.status(200).json({ data: user });
        }));
        this.changePassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const document = yield userModel_1.default.findByIdAndUpdate(req.params.id, {
                password: yield bcryptjs_1.default.hash(req.body.password, 12),
                passwordChangedAt: Date.now(),
            }, {
                new: true,
            });
            if (!document) {
                return next(new apiError_1.default(`No document for this id: ${req.params.id}`, 404));
            }
            res.status(201).json({ data: document });
        }));
        this.deleteUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield userModel_1.default.findByIdAndDelete(id);
            if (!user) {
                return next(new apiError_1.default(`No user for this: ${id}`, 400));
            }
            res.status(204);
        }));
    }
}
exports.default = new UserServices();
