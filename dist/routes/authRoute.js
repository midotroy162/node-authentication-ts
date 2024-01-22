"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authService_1 = __importDefault(require("../services/authService"));
const router = express_1.default.Router();
router.route("/signup").post(authService_1.default.signup);
router.route("/login").post(authService_1.default.login);
exports.default = router;
