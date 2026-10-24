// modules/opportunity/opportunity.controller.ts
import { Request, Response } from 'express'
import { CreateOpportunity,UpadteOpportunity,UpadteStatus,getUpcomingDashboard } from "./opportunity.services.js";
import { string } from 'zod';

export const opportunityController = {
  // Matches: router.post('/', ..., opportunityController.create)
  create: async (req: Request, res: Response) => {
    // req.user comes from your 'authenticate' middleware
    // req.body comes validated from your 'validate' middleware
    const opportunity = await CreateOpportunity(req.user?.userId as string, req.body)
    
    res.status(201).json({
      success: true,
      data: opportunity
    })
  },

  // Matches: router.patch('/:id', ..., opportunityController.update)
  update: async (req: Request, res: Response) => {
    const updated = await UpadteOpportunity(req.params.id as string, req.user?.userId as string, req.body)
    res.status(200).json({ success: true, data: updated })
  },

  // Matches: router.patch('/:id/status', ..., opportunityController.updateStatus)
  updateStatus: async (req: Request, res: Response) => {
    const updated = await UpadteStatus(req.params.id as string, req.user?.userId as string, req.body.status)
    res.status(200).json({ success: true, data: updated })
  },

  // Matches: router.get('/dashboard', ..., opportunityController.getDashboard)
  getDashboard: async (req: Request, res: Response) => {
    const dashboard = await getUpcomingDashboard(req.user?.userId as string)
    res.status(200).json({ success: true, data: dashboard })
  }
}