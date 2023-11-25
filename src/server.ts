import Fastify from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    top: number;
    inner: number;
    innerWithFp: number;
  }
}

const fastify = Fastify({
  logger: true,
});

fastify.decorate('top', 1);

fastify.get('/', async (request, reply) => {
  return { top: fastify.top, inner: fastify.inner, innerWithFp: fastify.innerWithFp };
});

await fastify.register(async (instance, opts) => {
  instance.decorate('inner', 2);
  instance.get('/inner', async (request, reply) => {
    return { top: instance.top, inner: instance.inner, innerWithFp: instance.innerWithFp };
  });
});

await fastify.register(
  fp(async (instance, opts) => {
    instance.decorate('innerWithFp', 3);
    instance.get('/innerWithFp', async (request, reply) => {
      return { top: instance.top, inner: instance.inner, innerWithFp: instance.innerWithFp };
    });
  }),
);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
