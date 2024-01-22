"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const validatorMiddleware_1 = __importDefault(require("../../middleware/validatorMiddleware"));
const userModel_1 = __importDefault(require("../../models/userModel"));
// const { check } = require("express-validator");
// const { default: slugify } = require("slugify");
// const validatorMiddleware = require("../../middleware/validatorMiddleware");
// const User = require("../../models/userModel");
exports.signupValidator = [
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
    validatorMiddleware_1.default,
];
exports.loginValidator = [
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("email require")
        .isEmail()
        .withMessage("invalid email address"),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("password Required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters"),
    validatorMiddleware_1.default,
];
