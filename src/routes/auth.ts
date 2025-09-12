import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as argon2 from 'argon2';
import { SignJWT, jwtVerify } from 'jose';

const regSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(3),
  password: z.string().min(8).max(128),
});

// Argon2id recommandé ; memoryCost en KiB
const ARGON_OPTS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,
  timeCost: 3,
  memoryCost: 19_456, // ≈19 MB
  parallelism: 1,
};

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
}

export default async function authRoutes(app: FastifyInstance) {
  // Chemins SANS /auth ici (le prefix l'ajoute)
app.post('/register', async (req, reply) => {
	const body = regSchema.parse(req.body);

	// ↓ normalisation pour l’unicité insensible à la casse
	const emailLower = body.email.toLowerCase();
	const usernameLower = body.username.toLowerCase();

	// vérif doublon sur les colonnes normalisées
	const exists = await app.prisma.user.findFirst({
	where: { OR: [{ emailLower }, { usernameLower }] },
	select: { id: true },
	});
	if (exists) return reply.code(409).send({ error: 'User already exists' });

	//register
	const passwordHash = await argon2.hash(body.password, ARGON_OPTS /* ou sans opts si tu n'en as pas */);

	// enregistrement avec les deux paires (original + lower)
	const user = await app.prisma.user.create({
	data: {
	email: body.email,
	username: body.username,
	emailLower,
	usernameLower,
	passwordHash,
	},
	select: { id: true, email: true, username: true, createdAt: true },
	});

	return reply.code(201).send(user);
});

app.post('/login', async (req, reply) => {
	const { emailOrUsername, password } = loginSchema.parse(req.body);

	// ↓ recherche insensible à la casse
	const q = emailOrUsername.toLowerCase();
	const user = await app.prisma.user.findFirst({
	where: { OR: [{ emailLower: q }, { usernameLower: q }] },
	});
	if (!user) return reply.code(401).send({ error: 'Invalid credentials' });

	//register
	const ok = await argon2.verify(user.passwordHash, password);
	if (!ok) return reply.code(401).send({ error: 'Invalid credentials' });

	const token = await new SignJWT({ sub: String(user.id) })
	.setProtectedHeader({ alg: 'HS256' })
	.setIssuedAt()
	.setExpirationTime('7d')
	.sign(getSecret());

	// si tu es passé au cookie HttpOnly :
	reply.setCookie('access_token', token, {
	path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7,
	});
	if (!user) {
		app.log.warn({ who: emailOrUsername }, 'login user not found');
		return reply.code(401).send({ error: 'Invalid credentials' });
	}
	const ok2 = await argon2.verify(user.passwordHash, password);
	if (!ok2) {
		app.log.warn({ id: user.id }, 'login bad password');
		return reply.code(401).send({ error: 'Invalid credentials' });
	}
	return reply.send({ user: { id: user.id, email: user.email, username: user.username } });
});

app.get('/me', async (req, reply) => {
	const bearer = req.headers.authorization || '';
	const headerToken = bearer.split(' ')[1];
	// @ts-ignore: ajouté par @fastify/cookie
	const cookieToken = req.cookies?.access_token as string | undefined;
	const token = cookieToken || headerToken;
	if (!token) return reply.code(401).send({ error: 'Missing token' });
	// ... jwtVerify(token, secret) etc.
});

// src/routes/auth.ts
app.post('/logout', async (_req, reply) => {
	reply.clearCookie('access_token', { path: '/', secure: true, sameSite: 'lax' });
	return reply.code(204).send();
});
}


