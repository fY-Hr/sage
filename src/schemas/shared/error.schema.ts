import { z } from '@hono/zod-openapi';

export const errorResponseSchema = z.object({
    error: z.string().openapi({
        example: 'This email is already registered'
    })
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>;