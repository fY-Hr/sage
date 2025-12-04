import { OpenAPIHono } from "@hono/zod-openapi";
import { loginRoute } from "./auth/login.route";
import { registerRoute } from "./auth/register.route";
import { handleRegister } from "../handlers/auth/register.handler";
import { handleLogin } from "../handlers/auth/login.handler";
import { logoutRoute } from "./auth/logout.route";
import { handleLogout } from "../handlers/auth/logout.handler";
import { jwtMiddleware } from "../middlewares/auth/jwt.middleware";
import { AppEnv } from "../types/hono";

const authRouter = new OpenAPIHono<AppEnv>();

authRouter.openapi(registerRoute, handleRegister);
authRouter.openapi(loginRoute, handleLogin);

authRouter.use('*', jwtMiddleware());

authRouter.openapi(logoutRoute, handleLogout);

export default authRouter;