// src/main.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import authGuard from './plugins/auth-guard';
import usersRoutes from './routes/users';
import authGoogleRoutes from './routes/auth-google';


declare module 'fastify' {
  interface FastifyInstance { prisma: PrismaClient }
}

const prisma = new PrismaClient();

async function buildServer() {
  const app = Fastify({ logger: true, bodyLimit: 1024 * 1024 });

  // expose Prisma
  app.decorate('prisma', prisma);

  // plugins
  await app.register(cookie); // pas besoin d’options pour un cookie JWT non signé
  await app.register(cors, {
    origin: ['https://front.localhost:8443', 'https://front.127.0.0.1.nip.io:8443'],
    credentials: true,
    methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['content-type', 'authorization'],
  });
  await app.register(authGoogleRoutes);
  app.listen({ port: Number(process.env.PORT ?? 3000), host: '::' });

  // health (ping DB réel)
  app.get('/health', async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { up: true, time: new Date().toISOString() };
  });

  // routes d’auth sous /auth
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(authGuard);                 // ⬅️ protège les routes suivantes
  await app.register(usersRoutes, { prefix: '/users' });

  // fermeture propre
  app.addHook('onClose', async () => { await prisma.$disconnect(); });

  // debug routes
  app.ready(err => { if (!err) app.log.info(app.printRoutes()); });

  return app;
}

buildServer()
  .then(app => app.listen({ port: Number(process.env.PORT ?? 3000), host: '::' }))
  .catch(err => { console.error(err); process.exit(1); });