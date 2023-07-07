import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionId(req: FastifyRequest, reply: FastifyReply) {
  const sessionId = req.cookies.sessionId

  if (!sessionId) {
    await reply.status(401).send({
      error: 'nao autorizado',
    })
  }
}
