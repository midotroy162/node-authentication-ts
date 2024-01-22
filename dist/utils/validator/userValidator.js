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
exports.updateLoggedUserValidator = exports.deleteUserValidator = exports.changeUserPasswordValidator = exports.updateUserValidator = exports.createUserValidator = exports.getUserValidator = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
//import { Request, Response } from "express";
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const userModel_1 = __importDefault(require("../../models/userModel"));
// const { check, body } = require("express-validator");
// const { default: slugify } = require("slugify");
// const bycrypt = require("bcryptjs");
// const validatorMiddleware = require("../../middleware/validatorMiddleware");
// const User = require("../../models/userModel");
exports.getUserValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid User Id"),
    validatorMiddleware_1.default,
];
exports.createUserValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("User Required")
        .isLength({ min: 3 })
        .withMessage("Too short User name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("email require")
        .isEmail()
        .withMessage("invalid email address")
        .custom((val) => userModel_1.default.findOne({ email: val }).then((user) => {
        if (user) {
            return Promise.reject(new Error("E-mail already in user"));
        }
    })),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("password Required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters")
        .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
            throw new Error("Password confirmation incorrect");
        }
        return true;
    }),
    (0, express_validator_1.check)("passwordConfirm")
        .notEmpty()
        .withMessage("password confirmation Required"),
    (0, express_validator_1.check)("phone")
        .optional()
        .isMobilePhone(["ar-SA", "ar-EG"])
        .withMessage("invalid phone number only accept eg and sa"),
    (0, express_validator_1.check)("profileImg").optional(),
    (0, express_validator_1.check)("role").optional(),
    validatorMiddleware_1.default,
];
exports.updateUserValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid User Id"),
    (0, express_validator_1.body)("name")
        .optional()
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("email require")
        .isEmail()
        .withMessage("invalid email address")
        .custom((val) => userModel_1.default.findOne({ email: val }).then((user) => {
        if (user) {
            return Promise.reject(new Error("E-mail already in user"));
        }
    })),
    (0, express_validator_1.check)("phone")
        .optional()
        .isMobilePhone(["ar-SA", "ar-EG"])
        .withMessage("invalid phone number only accept eg and sa"),
    (0, express_validator_1.check)("profileImg").optional(),
    (0, express_validator_1.check)("role").optional(),
    validatorMiddleware_1.default,
];
exports.changeUserPasswordValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid User Id"),
    (0, express_validator_1.body)("currentPassword")
        .notEmpty()
        .withMessage("you must enter your current password"),
    (0, express_validator_1.body)("passwordConfirm")
        .notEmpty()
        .withMessage("you must enter your password password"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("you must enter your new password")
        .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        //1 verfiy current password
        const user = yield userModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            throw new Error("there is no user for that id");
        }
        const isCorrectPassword = yield bcryptjs_1.default.compare(req.body.currentPassword, user.password);
        if (!isCorrectPassword) {
            throw new Error("Incorrect current password");
        }
        // 2 verfiy password confirm
        if (val !== req.body.passwordConfirm) {
            throw new Error("password confirmation incorrect");
        }
        return true;
    })),
    validatorMiddleware_1.default,
];
exports.deleteUserValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid User Id"),
    validatorMiddleware_1.default,
];
exports.updateLoggedUserValidator = [
    (0, express_validator_1.body)("name")
        .optional()
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("email require")
        .isEmail()
        .withMessage("invalid email address")
        .custom((val) => userModel_1.default.findOne({ email: val }).then((user) => {
        if (user) {
            return Promise.reject(new Error("E-mail already in user"));
        }
    })),
    (0, express_validator_1.check)("phone")
        .optional()
        .isMobilePhone(["ar-SA", "ar-EG"])
        .withMessage("invalid phone number only accept eg and sa"),
    validatorMiddleware_1.default,
];
