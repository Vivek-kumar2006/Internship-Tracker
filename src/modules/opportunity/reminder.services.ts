import { date } from "zod";
import { Opportunity } from "../../../generated/prisma/client.js";
import { reminderQueue } from "../queues/reminder.queue.js";
import { title } from "node:process";
import { ApiError } from "../../utils/ApiError.js";


export async function scheduleReminder(opportunity: Opportunity): Promise<string> {

    const reminderTime = new Date(opportunity.deadline)
    reminderTime.setDate(reminderTime.getDate() - 5)

    const delay = reminderTime.getDate() - Date.now()

    if (delay <= 0) {
        return "Deadline has reached....No more 5 days left."
    }
     const jobId=`reminder:${opportunity.id}`

     await reminderQueue.add(
        'deadline-alert',
        {
        opportunityId:opportunity.id,
        userId:opportunity.userId,
        title:opportunity.title,
        deadline:opportunity.deadline
        },
        {
            jobId,
            delay,
            priority:1

        }
    )
      return jobId
}


export async function cancelReminder(jobId:string)
{
    if (!jobId) {
        return "Job not found"
    }
    const job =await reminderQueue.getJob(jobId)

    if (job) {
        await job.remove()
        return "Job is cancelled"
    }
     return "No job found..."
}