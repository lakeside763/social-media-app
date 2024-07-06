import { Router } from "express";
import { AuthController } from "./auth.controller";
import { LoginCredsValidation } from "./auth.validation";
import authMiddleware from "../../middlewares/auth";


const router = Router();

const authController = new AuthController();

router.post('/login', LoginCredsValidation, authController.loginUser);
router.post('/logout', authMiddleware, authController.logoutUser);

export default router;