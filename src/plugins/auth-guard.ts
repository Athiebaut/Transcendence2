import { FastifyPluginCallback } from 'fastify';
import { jwtVerify } from 'jose';


// Permet d’accrocher l’ID user au request object
declare module 'fastify' { interface FastifyRequest { userId?: number } }


function secret() { return new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret'); }


const authGuard: FastifyPluginCallback = (app, _opts, done) => {
app.addHook('preHandler', async (req, reply) => {
// 1) Récupère le token soit dans Authorization: Bearer <jwt>, soit dans le cookie
const bearer = req.headers.authorization || '';
const headerToken = bearer.startsWith('Bearer ') ? bearer.slice(7) : undefined;
// @ts-ignore - injecté par @fastify/cookie
const cookieToken = req.cookies?.access_token as string | undefined;
const token = cookieToken || headerToken;


if (!token) return reply.code(401).send({ error: 'Missing token' });


try {
const { payload } = await jwtVerify(token, secret(), {
// audience: 'transcendence', // active si ajout de aud lors de l’émission
// issuer: 'transcendence-api',
// clockTolerance: '5s',
});
req.userId = Number(payload.sub);
} catch {
return reply.code(401).send({ error: 'Invalid token' });
}
});
done();
};


export default authGuard;