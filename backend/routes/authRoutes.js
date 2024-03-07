import express from "express";
import { ForgotPassword, Login, Logout, ResetPassword, SignUp } from "../controllers/authController.js";


const router = express.Router();

router.post("/login", Login)

router.post("/signup", SignUp)

router.post("/logout", Logout)

router.post("/forget-password", ForgotPassword);
router.patch("/reset-password/:token", ResetPassword);


export default router