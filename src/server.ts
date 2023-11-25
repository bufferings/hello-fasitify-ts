import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (request, reply) => {
  return 'Hi!'
})

await fastify.listen({ port: 3000 })
