import app from './app';

const port = parseInt(process.env.PORT || '3000')

console.log(`Started development server: http://localhost:${port}`)

Bun.serve({
    port,
    fetch: app.fetch,
})
