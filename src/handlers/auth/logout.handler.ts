import { Context } from 'hono';
import { logout as logoutService } from '../../services/auth.service';
import { LogoutSuccess } from '../../schemas/auth/logout.schema';
import { logoutRoute } from '../../routes/auth/logout.route';
import { AppEnv } from '../../types/hono';

type LogoutContext = Context<
    AppEnv, //<-- we are usingg the AppEnv from  the hono.d.ts because the OpenAPIHono object in the auth.ts is using it as the env object inside the generic params.
    // so as the handler based on that object we need to define the same Env in the Context obejct.
    typeof logoutRoute extends { path: string }? typeof logoutRoute.path : '/logout'
    // no need to define the inferRequestType because the logout handler is not accepting any request body
>; 

export async function handleLogout(c: LogoutContext){
    // We are getting the auth object that we has setted inside the jwt.middleware.ts
    const authClaims = c.get('auth');
    const expDate = new Date(authClaims.exp * 1000);

    try {
        const message = await logoutService(authClaims.jti, expDate);

        const res: LogoutSuccess = message

        return c.json(res, 200);
    } catch (error) {
        console.error('Logout error: ' + error);
        return c.json({ error: 'Internal server error during logout'}, 500);
    }

}

