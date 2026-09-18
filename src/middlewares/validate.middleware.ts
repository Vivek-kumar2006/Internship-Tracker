// src/middlewares/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

interface RequestValidaters{
  body?:ZodObject
  query?:ZodObject
  params?:ZodObject
}

export const validate = (validator: RequestValidaters) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
          if (validator.body) {
            req.body= await validator.body.parseAsync(req.body) as typeof req.body
          }
          if (validator.query) {
            req.query= await validator.query.parseAsync(req.query) as typeof req.query
          }
          if (validator.params) {
            req.params= await validator.params.parseAsync(req.params)  as typeof req.params
          }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,

          })),
        });
      }
      return next(error);
    }
  };