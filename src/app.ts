import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from '@hono/swagger-ui'
import { loginRoute } from "./routes/auth/login.route";
import { registerRoute } from "./routes/auth/register.route";
import { handleLogin } from "./handlers/auth/login.handler";
import { handleRegister } from "./handlers/auth/register.handler";

const app = new OpenAPIHono()

app.openapi(registerRoute, handleRegister);
app.openapi(loginRoute, handleLogin)

app.doc31('/doc', {
  openapi: '3.1.0',
  info: { title: 'Sage API', version: '1.0.0' },
})

app.get('/ui', swaggerUI({ url: '/doc'}));

export default app;
