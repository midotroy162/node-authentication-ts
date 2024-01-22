import express, { Request, Response } from "express";
import authService from "../services/authService";

const router = express.Router();

router.route("/signup").post(authService.signup);
router.route("/login").post(authService.login);

export default router;
