import fastify from 'fastify'
import { knex } from './database'
import { env } from './env/index'
import cookie from '@fastify/cookie'
import { transactionRoutes } from './routes'

const app = fastify()

app.register(cookie)

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
