import fastify from 'fastify'
import { knex } from './database'
import { env } from './env/index'
import { transactionRoutes } from './routes'

const app = fastify()

app.register(transactionRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
