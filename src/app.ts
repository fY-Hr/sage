import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from '@hono/swagger-ui'
import authRouter from './routes/auth';

const app = new OpenAPIHono()

app.route('/auth', authRouter);

app.doc31('/doc', {
  openapi: '3.1.0',
  info: { title: 'Sage API', version: '1.0.0' },
})

app.get('/ui', swaggerUI({ url: '/doc'}));

export default app;
