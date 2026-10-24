import { Queue } from "bullmq";
import { Redis } from 'ioredis';
import { env } from "node:process";

export const reminderQueue = new Queue('reminders',
    {
        connection:{url: env.REDIS_URL}
    })

    