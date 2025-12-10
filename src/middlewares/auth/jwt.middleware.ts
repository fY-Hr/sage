import { createMiddleware } from "hono/factory";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { logoutRoute } from "../../routes/auth/logout.route";
import { blacklistTokensTable } from "../../db/schema/blacklistTokensTable";


export interface AuthClaims {
    userId: string;
    jti: string;
    exp: number; // date in second
}

export interface Variables {
    auth: AuthClaims
}

export const jwtMiddleware = () => {
    return createMiddleware<{Variables: Variables}>((async (c, next) => {
        const authHeader = c.req.header('Authorization');
        const token = authHeader?.startsWith('Bearer') ? authHeader.substring(7) : null;
        const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

        if(!token){
            return c.json({
                message: 'Unauthorized token missing'
            }, 401);
        }

        try {
            const { payload } = await jwtVerify(token, jwtSecret, {
                requiredClaims: ['jti', 'exp', 'userId']
            })

            const [isRevoked] = await db
                .select({ jti: blacklistTokensTable.jti })
                .from(blacklistTokensTable)
                .where(eq(blacklistTokensTable.jti, payload.jti as string))

            if(isRevoked){
                return c.json({message: 'Unauthorized, token revoked'}, 401);
            }

            c.set('auth', { //<-- this set method will follow the type that is provided on the createMiddleware geenric type param.
                userId: payload.userId as string,
                jti: payload.jti as string,
                exp: payload.exp as number
            })

            // with this set method, we can inject an object into the Context object. In this context, we are injecting the auth.
            // This is like we are extracting the token if the token is not revoked and then we inject the data into the Context object using c.set() method.

            // Plus, we can use the Variables inteface inside the Context env generic params in the handler, so when the handler is trying to get
            // the c.get('auth') the type is already the same.

            await next()

        } catch (error){
            return c.json({message: 'Unauthorized, invalid or expired token'}, 401);
        }
    }))
}