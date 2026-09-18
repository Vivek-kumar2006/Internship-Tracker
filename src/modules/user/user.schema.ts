import { z} from 'zod'

export const updateMe=z.object
(
    {
        name:z.string().min(2).max(50).optional,
        phone:z.string().min(10).max(10).optional()
    }
)

export const changePassword=z.object
(
    {
       currPassword:z.string(),
        newPassword:z.string().min(6,"Password is too short"),
    }
)
