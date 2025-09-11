import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function buildServer() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });

  app.get('/health', async () => ({ up: true, time: new Date().toISOString() }));

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  return app;
}

async function start() {
  const app = await buildServer();
  const port = Number(process.env.PORT ?? 3000);
  const host = '0.0.0.0';

  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();