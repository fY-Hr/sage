import { Context, InferRequestType } from 'hono';
import { login as loginService } from '../../services/auth.service';
import { LoginInput } from '../../schemas/auth/login.schema';
import { loginRoute } from '../../routes/auth/login.route';
import { AppEnv } from '../../types/hono';

type LoginContext = Context<
    AppEnv, // Env (Kosongkan atau berikan tipe Env Anda yang sebenarnya)
    typeof loginRoute extends { path: string } ? typeof loginRoute.path : "/",
    InferRequestType<typeof loginRoute>
>;

export async function handleLogin(c: LoginContext){
    const input: LoginInput = c.req.valid('json');
    const { token } = await loginService(input);

    return c.json({ 
        message: 'Login Success',
        token 
    }, 200)
}