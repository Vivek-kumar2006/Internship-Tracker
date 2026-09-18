import { Request,Response,NextFunction } from "express";
import { asyncHandler } from "./asyncHandler.js";
import  {ROLE}  from  "../../generated/prisma/enums.js"
import { ApiError } from "../utils/ApiError.js";

export const verifyRoles=(...allowedRoles:ROLE[])=>
    {
        return (req:Request,res:Response,next:NextFunction) =>
            {
                const user=req.user
                  if (!user) {
                    throw new ApiError(401,'User is not authenticated.')
                  }
                  if (!allowedRoles.includes(user.role as ROLE)) {
                       throw new ApiError(403,`Access denied.Permission denied to ${allowedRoles.join('or')}`)
                  }

                  next()
            }
    }