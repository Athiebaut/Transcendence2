import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import authGoogleRoutes from './routes/auth-google';
import authGuard from './plugins/auth-guard';


// Augmentation du type Fastify pour exposer Prisma proprement
declare module 'fastify' {
interface FastifyInstance { prisma: PrismaClient }
}


const prisma = new PrismaClient();


function frontOrigin() {
// Une seule source d’origine pour CORS; configurable via env
return process.env.FRONT_ORIGIN ?? 'https://front.localhost:8443';
}


async function buildServer() {
const app = Fastify({ logger: true, bodyLimit: 1 * 1024 * 1024 });


// 1) Ressources partagées
app.decorate('prisma', prisma);


// 2) Plugins globaux
await app.register(cookie); // cookies non signés (JWT), sinon { secret: '...' }
await app.register(cors, {
origin: [frontOrigin()], // en dev: liste blanche stricte
credentials: true,
methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
allowedHeaders: ['content-type', 'authorization']
});


// 3) Routes publiques (pas de guard)
await app.register(authRoutes, { prefix: '/auth' });
await app.register(authGoogleRoutes); // expose /auth/google & /auth/google/callback


// 4) Guard d’auth → toutes les routes déclarées APRÈS sont protégées
await app.register(authGuard);


// 5) Routes protégées
const usersRoutes = (await import('./routes/users')).default; // lazy pour l’exemple
await app.register(usersRoutes, { prefix: '/users' });


// 6) Fermeture propre
app.addHook('onClose', async () => { await prisma.$disconnect(); });


// Debug des routes (facilite le dev)
app.ready((err) => { if (!err) app.log.info(app.printRoutes()); });


return app;
}


buildServer()
.then((app) => app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' }))
.catch((err) => { console.error(err); process.exit(1); });