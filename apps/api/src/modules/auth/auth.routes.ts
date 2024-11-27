import { Router } from "express";
import * as AuthController from "./auth.controller";
import { authMiddleware } from "./auth.middleware";

const router: Router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshAccessToken); // Refresh token route
router.post("/logout", AuthController.logout);
router.post("/verify-token", authMiddleware, AuthController.verifyToken);

export default router;
