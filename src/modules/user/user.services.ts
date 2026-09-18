import {prisma} from '../../lib/prisma.js'
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError.js';
import { email } from 'zod';


export const getMe =async(req:Request,res:Response,next:NextFunction)=>
    {
          const userId =req.user?.userId
          const user = await prisma.user.findUnique({ 
             where:{id: userId},
             select:
             {
                id:true,name:true,email:true,phone:true
             } }
            );
          
            if(!user){
                throw new ApiError(400, "No such user found")
            }
           return res.status(200).json(
            {
                user:{
                    id:user.id,
                    name:user.name,
                    email:user.email,
                    phone:user.phone
                }
            })
    }


