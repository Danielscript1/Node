import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transaction = await knex('transaction').select('*')
    return transaction
  }),
    app.post('/', async (req, reply) => {
      const createTransactioBodySchema = z.object({
        title: z.string(),
        amout: z.number(),
        type: z.enum(['credit', 'debit']),
      })

      const { title, amout, type }: any = createTransactioBodySchema.parse(
        req.body,
      )

      const transaction = {
        id: uuidv4(),
        title,
        amout: type == 'credit' ? amout : amout * -1,
      }

      const transactionInsert = await knex('transaction')
        .insert(transaction)
        .then(() => {
          reply
            .status(201)
            .send({ message: 'Transaction created successfully.' })
        })
        .catch((error) => {
          // Tratar possíveis erros
          console.error(error)
          reply.status(500).send({ message: 'Error creating transaction.' })
        })
    })
}
