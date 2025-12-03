import { OpenAPIHono } from "@hono/zod-openapi";
import { loginRoute } from "./auth/login.route";
import { registerRoute } from "./auth/register.route";
import { handleRegister } from "../handlers/auth/register.handler";
import { handleLogin } from "../handlers/auth/login.handler";

const authRouter = new OpenAPIHono();

authRouter.openapi(registerRoute, handleRegister);
authRouter.openapi(loginRoute, handleLogin);

export default authRouter;