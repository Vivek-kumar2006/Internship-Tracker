import { Router } from "express";
import { updateMe, changePassword } from "./user.schema.js";

import {getMe} from './user.services.js'

import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { verifyRoles } from "../../middlewares/rbac.middleware.js";

const router = Router();

router.post('/user/getMyProfile',authenticate,getMe)

export default router