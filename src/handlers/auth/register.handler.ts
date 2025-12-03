import { Context, InferRequestType } from 'hono';
import { register as registerService } from '../../services/auth.service';
import { RegisterInput } from '../../schemas/auth/register.schema';
import { registerRoute } from '../../routes/auth/register.route';

type RegisterContext = Context<
    {},
    typeof registerRoute extends { path: string } ? typeof registerRoute.path : '/',
    InferRequestType<typeof registerRoute>
>

// Context generic from hono usually contains: Context<Env, \text{RouteDefinition}> or Context<Env, \text{Path}, \text{RequestType/ResponseType}>
// for the third parameter, it is only available if the context route definition in the second parameter is a literal string or union string, so we must narrow the request type
// or the response type depend on what inferType are we using.
// if InferRequestType then the third param will be a RequestType and viceversa

export async function handleRegister(c: RegisterContext){
    const input: RegisterInput = c.req.valid('json');
    const { userId } = await registerService(input);
    
    return c.json({
        message: 'User successfully registered',
        userId
    }, 201)
}

