import { z} from 'zod'

export const createOpportunitySchema= z.object({
    title: z.string().min(3).max(150),
    type:z.enum(['INTERNSHIP', 'HACKATHON', 'JOB', 'SCHOLARSHIP']),
    sourceLink:z.string().url(),
    eligiblity_Notes:z.string().max(500),
    deadline: z.coerce.date().refine(d => d > new Date(), {
    message: 'Deadline must be in the future'
  }),
   source:z.enum([ 'ADMIN','USER']),
   verificationStatus:z.enum(['APPROVED','REJECTED']),
   reviewedAt:z.date(),
   field:z.enum([ 'BACKEND','FRONTEND','APPLIED_AI','FULL_STACK','DATA_SCIENCE'])
})


export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>

