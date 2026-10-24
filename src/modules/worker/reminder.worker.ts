import { Worker } from "bullmq";
import { prisma } from "../../lib/prisma.js";
import { channel } from "node:diagnostics_channel";
import { sendEmail } from "./email.service.js";

const worker = new Worker('reminders',
    async (job) => {
        const { userId, opportunityId, title, deadline } = job.data

        const user = await prisma.user.findUnique({ where: { id: userId } })

        const notification= await prisma.notification.create({
                data: {
                userId,
              channel:'EMAIL',
              recipient:user?.email || "",
              eventType:"DEADLINE_REMINDER",
              payload:
              {
                title,
                deadline,
                opportunityId
              },
              priority:1
                }
            } 
        )

        await sendEmail(user?.email || '',"DEADLINE_REMINDER",{title,deadline})

        await prisma.notification.update({
             where:{id:notification.id},
             data:{status:'SENT',sentAt:new Date()}
        })
        

    },{connection:{url:process.env.REDIS_URL}}
)

worker.on('failed',async(job,err)=>
    {

    })