import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth'; // sans extension
import cookie from '@fastify/cookie';

declare module 'fastify' { interface FastifyInstance { prisma: PrismaClient } }

const prisma = new PrismaClient();

async function buildServer() {
  const app = Fastify({ logger: true });
  app.decorate('prisma', prisma);

  await app.register(cors, {
    origin: ['https://front.localhost:8443'],
    credentials: true,
  });

  app.get('/health', async () => ({ up: true, time: new Date().toISOString() }));

  // ⬇️ IMPORTANT : prefix '/auth'
  await app.register(authRoutes, { prefix: '/auth' });

  app.addHook('onClose', async () => { await prisma.$disconnect(); });
  app.ready(err => { if (!err) app.log.info(app.printRoutes()); });
  return app;
}

buildServer().then(app => app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' }))
  .catch((err) => { console.error(err); process.exit(1); });

await app.register(cookie, { /* pas de signature pour un access token JWT */ });
await app.register(cors, {
  origin: ['https://front.localhost:8443'],
  credentials: true, // indispensable pour cookies cross-origin
});

