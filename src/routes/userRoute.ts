import express, { Request, Response } from "express";
import userService from "../services/userService"; // Adjust the path accordingly
import authService from "../services/authService";
const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    userService.createUser
  )
  .get(userService.getUsers);
router
  .route("/:id")
  .get(authService.protect, userService.getUser)
  .put(authService.protect, userService.updateUser)
  .delete(userService.deleteUser);
router.route("/changePassword").put(userService.changePassword);
export default router;
