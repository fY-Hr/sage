import { createRoute } from '@hono/zod-openapi'
import { loginInputSchema, loginSucessSchema } from '../../schemas/auth/login.schema';
import { errorResponseSchema } from '../../schemas/shared/error.schema';

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