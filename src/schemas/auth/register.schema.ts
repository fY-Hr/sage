import { z, createRoute } from '@hono/zod-openapi';
import { errorResponseSchema } from '../shared/error.schema';

export const registerInputSchema = z.object({
    username: z.string().min(3).max(18).regex(/^[a-zA-Z0-9_-]+$/).openapi({
        example: 'Example Doe'
    }),
    email: z.string().email().openapi({
        example: 'example@mail.com'
    }),
    password: z.string().min(8).openapi({
        // No example for password
    })
})

export const registerSuccessSchema = z.object({
    message: z.string().openapi({
        example: 'User registered successfully'
    }),
    userId: z.string().openapi({
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
})

export const registerRoute = createRoute({
    method: 'post',
    path: '/auth/register',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: registerInputSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: 'User registered successfully',
            content: {
                'application/json': {
                    schema: registerSuccessSchema
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
        409: {
            description: 'Email already registered',
            content: {
                'application/json': {
                    schema: errorResponseSchema
                }
            }
        }
    }
})

export type RegisterInput = z.infer<typeof registerInputSchema>;