import { z } from '@hono/zod-openapi';

export const logoutSuccessSchema = z.object({
    message: z.literal('Logout successful').openapi({
        example: 'Logout success'
    })
})

export type LogoutSuccess = z.infer<typeof logoutSuccessSchema>