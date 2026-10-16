import { Router } from "express";
import { RegisterUserSchema, LoginUserSchema } from "./auth.schema.js";
import {
  loginhandler,
  registerhandler,
  refreshTokenhandler,
  logouthandler,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { verifyRoles } from "../../middlewares/rbac.middleware.js";
const router = Router();

// Registration & Authentication
router.post("/auth/register", validate({ body: RegisterUserSchema }), registerhandler);
router.post("/auth/login", validate({ body: LoginUserSchema }), loginhandler);
//router.post("/register/customer", validate({ body: RegisterUserSchema }),verifyRoles('CUSTOMER'), registerhandler);

router.post("/blacklist",authenticate,)
router.post("/refresh", authenticate,refreshTokenhandler);
router.post("/logout", authenticate,logouthandler);

export default router;