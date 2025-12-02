import { z } from '@hono/zod-openapi';

export const loginInputSchema = z.object({
    email: z.string().email().openapi({
        example: 'example@mail.com'
    }),
    password: z.string().min(8).openapi({
        // No example
    })
})

export const loginSucessSchema = z.object({
    message: z.string().openapi({
        example: 'Login success'
    }),
    token: z.string().openapi({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx.yyyyy'
    })
})

export type LoginInput = z.infer<typeof loginInputSchema>;