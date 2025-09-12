import { FastifyPluginCallback } from 'fastify';
import { jwtVerify } from 'jose';

declare module 'fastify' { interface FastifyRequest { userId?: number } }

function secret() { return new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret'); }

const authGuard: FastifyPluginCallback = (app, _opts, done) => {
  app.addHook('preHandler', async (req, reply) => {
    const bearer = req.headers.authorization || '';
    const headerToken = bearer.split(' ')[1];
    // @ts-ignore (ajouté par @fastify/cookie)
    const cookieToken = req.cookies?.access_token as string | undefined;
    const token = cookieToken || headerToken;
    if (!token) return reply.code(401).send({ error: 'Missing token' });
    try {
      const { payload } = await jwtVerify(token, secret());
      req.userId = Number(payload.sub);
    } catch { return reply.code(401).send({ error: 'Invalid token' }); }
  });
  done();
};

export default authGuard;