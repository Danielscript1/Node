import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { Knex } from 'knex'
import { checkSessionId } from '../middleware/check-session-id-exits'

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionId] }, async (req) => {
    const { sessionId } = req.cookies
    const transaction = await knex('transaction')
      .where({
        session_id: sessionId,
      })
      .select('*')
    return { transaction }
  })
  app.get('/summary', { preHandler: [checkSessionId] }, async (req) => {
    const { sessionId } = req.cookies
    const summary = await knex('transaction')
      .sum('amout', { as: 'dinheiro' })
      .where({
        sessionId,
      })
      .first()
    return { summary }
  })
  app.get('/:id', { preHandler: [checkSessionId] }, async (request, reply) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string(),
    })

    try {
      const { id } = getTransactionsParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      const transaction = await knex('transaction')
        .where({
          sessionId,
          id,
        })
        .first()

      if (!transaction) {
        return reply.status(404).send({
          error: 'Transaction not found',
        })
      }

      return reply.send({
        transaction,
      })
    } catch (error) {
      return reply.status(500).json({
        error: 'Internal server error',
      })
    }
  })
  app.post('/', async (req, reply) => {
    const createTransactioBodySchema = z.object({
      title: z.string(),
      amout: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amout, type }: any = createTransactioBodySchema.parse(
      req.body,
    )

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const transaction = {
      id: uuidv4(),
      title,
      amout: type == 'credit' ? amout : amout * -1,
      session_id: sessionId,
    }

    const transactionInsert = await knex('transaction')
      .insert(transaction)
      .then(() => {
        reply.status(201).send({ message: 'Transaction created successfully.' })
      })
      .catch((error) => {
        // Tratar possíveis erros
        console.error(error)
        reply.status(500).send({ message: 'Error creating transaction.' })
      })
  })
}
