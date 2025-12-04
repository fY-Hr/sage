import { createRoute } from "@hono/zod-openapi";
import { logoutSuccessSchema } from "../../schemas/auth/logout.schema";
import { errorResponseSchema } from "../../schemas/shared/error.schema";

export const logoutRoute = createRoute({
    method: 'post',
    path: '/logout',
    responses: {
        200: {
            description: 'Logout successful and token invalidated.',
            content: {
                'application/json': {
                    schema: logoutSuccessSchema
                }
            }
        },
        401: {
            description: 'Unauthorized (No token provided or token invalid)',
            content: {
                'application/json': {
                    schema: errorResponseSchema
                }
            }
        },
        500: {
            description: 'Server error',
            content: {
                'application/json': {
                    schema: errorResponseSchema
                }
            }
        }
    }
})