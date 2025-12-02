import { createRoute } from '@hono/zod-openapi';
import { registerInputSchema, registerSuccessSchema } from '../../schemas/auth/register.schema';
import { errorResponseSchema } from '../../schemas/shared/error.schema';

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

