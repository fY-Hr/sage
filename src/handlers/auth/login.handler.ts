import { Context } from 'hono';
import { login as loginService } from '../../services/auth.service';
import { loginInputSchema } from '../../schemas/auth/login.schema';

export async function handleLogin(c: Context){
    const body = await c.req.json();
    const input = loginInputSchema.parse(body);
    const { token } = await loginService(input);

    return c.json({ 
        message: 'Login Success',
        token 
    }, 200)
}