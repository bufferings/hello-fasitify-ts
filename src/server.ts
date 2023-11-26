import Fastify from 'fastify';
import fp from 'fastify-plugin';

const fastify = Fastify({
  logger: true,
});

fastify.get('/', async (request, reply) => {
  return { hello: 'Fastify!' };
});

await fastify.register(async function myPlugin1(instance, opts) {
  console.log(`myPlugin1: ${fastify === instance}`);
  await instance.register(async function myPlugin1_1(instance, opts) {
    await instance.register(async function myPlugin1_1_1(instance, opts) {});
  });
  await instance.register(async function myPlugin1_2(instance, opts) {});
});

await fastify.register(
  fp(async function myPlugin2_Wrapped(instance, opts) {
    console.log(`myPlugin2_Wrapped: ${fastify === instance}`);
    await instance.register(async function myPlugin2_1(instance, opts) {
      await instance.register(async function myPlugin2_1_1(instance, opts) {});
    });
    await instance.register(async function myPlugin2_2(instance, opts) {});
  }),
);

fastify.addHook('onReady', () => {
  console.log(fastify.printPlugins());
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
