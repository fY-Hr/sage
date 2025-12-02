import { Context } from 'hono';
import { register as registerService } from '../../services/auth.service';
import { registerInputSchema } from '../../schemas/auth/register.schema';

export async function handleRegister(c: Context){
    const body = await c.req.json();
    const input = registerInputSchema.parse(body);
    const { userId } = await registerService(input);
    
    return c.json({
        message: 'User successfully registered',
        userId
    }, 201)
}

