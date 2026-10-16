import { Redis } from 'ioredis'
import { prisma } from '../../lib/prisma.js'
import { CreateOpportunityInput } from './opportunity.schema.js'
import { ApiError } from '../../utils/ApiError.js';
import { OPPORTUNITY_STATUS } from '../../../generated/prisma/enums.js';
import { json } from 'zod';

const redis = new Redis();

export async function CreateOpportunity(userId: string, data: CreateOpportunityInput) {
    const opportunity = await prisma.opportunity.create(
        {
            data: { userId, ...data }
        }

        const jobId = scheduleReminder(opportunity)

    await prisma.opportunity.update({
        where: { id: opportunity.id },
        data: { reminderJobId: jobId }
    })
    await redis.del(`dashboard:upcoming:${userId}`)
    return opportunity
    )
}

export async function UpadteOpportunity(id: string, userId: string, data: Partial<CreateOpportunityInput>) {

    const exisiting = await prisma.opportunity.findFirst({ where: { id, userId } })

    if (!exisiting) {
        throw new ApiError(404, "Opportunity requested to update is not found..")
    }

    if (data.deadline && exisiting.reminderJobId) {
        await cancelReminder(exisiting.reminderJobId)
    }

    const updated = await prisma.opportunity.update({
        where: { id },
        data: data
    })

    if (data.deadline) {
        const jobId = scheduleReminder(updated)
        await prisma.opportunity.update({
            where: { id },
            data: { reminderJobId: jobId }
        })
    }

    await redis.del(`dashboard:upcoming:${userId}`)
    return updated
}


export async function UpadteStatus(id: string, userId: string, status: OPPORTUNITY_STATUS) {
    const exisiting = await prisma.opportunity.findFirst({ where: { id, userId } })

    if (!exisiting) {
        throw new ApiError(404, "Opportunity requested to update is not found..")
    }

    const updated = await prisma.opportunity.update({
        where: { id },
        data: { status }
    })

    if (status != "NOT_APPLIED" && updated.reminderJobId) {
        await cancelReminder(updated.reminderJobId)
    }

    await redis.del(`dashboard:upcoming:${userId}`)
    return updated

}

export async function getUpcomingDashboard(userId: string) {
    const cacheKey = `dashboard:upcoming:${userId}`

    const cached = await redis.get(cacheKey)

    if (cached) {
        return JSON.parse(cached)
    }

    const opportunities = await prisma.opportunity.findMany({
        where: { userId, deadline: { gte: new Date() } },
        orderBy: { deadline: 'asc' }
    })

    
}

