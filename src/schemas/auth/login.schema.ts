import { z, createRoute } from '@hono/zod-openapi';
import { errorResponseSchema } from '../shared/error.schema';

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

export const loginRoute = createRoute({
    method: 'post',
    path: '/auth/login',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: loginInputSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Login successful. Use the token in the Authorization header as: Bearer <token>',
            content: {
                'application/json': {
                    schema: loginSucessSchema
                }
            }
        },
        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: errorResponseSchema
                }
            }
        },
        401: {
            description: 'Invalid Credential',
            content: {
                'application/json': {
                    schema: errorResponseSchema
                }
            }
        }
    }

})

export type LoginInput = z.infer<typeof loginInputSchema>;