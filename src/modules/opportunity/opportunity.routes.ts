import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { verifyRoles } from "../../middlewares/rbac.middleware.js";
import { createOpportunitySchema } from "./opportunity.schema.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { opportunityController } from "./opportunity.controller.js";



const router= Router()


router.post('/',authenticate,validate({body:createOpportunitySchema}),opportunityController.create)
router.post('/:id', authenticate, asyncHandler(opportunityController.update))
router.post('/:id/status', authenticate, asyncHandler(opportunityController.updateStatus))
router.get('/dashboard', authenticate, asyncHandler(opportunityController.getDashboard))


export default router;