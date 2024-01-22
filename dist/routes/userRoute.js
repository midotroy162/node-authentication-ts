"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = __importDefault(require("../services/userService")); // Adjust the path accordingly
const authService_1 = __importDefault(require("../services/authService"));
const router = express_1.default.Router();
router
    .route("/")
    .post(authService_1.default.protect, authService_1.default.allowedTo("admin"), userService_1.default.createUser)
    .get(userService_1.default.getUsers);
router
    .route("/:id")
    .get(authService_1.default.protect, userService_1.default.getUser)
    .put(authService_1.default.protect, userService_1.default.updateUser)
    .delete(userService_1.default.deleteUser);
router.route("/changePassword").put(userService_1.default.changePassword);
exports.default = router;
