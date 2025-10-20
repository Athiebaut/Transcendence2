import { FastifyInstance } from 'fastify';
.setProtectedHeader({ alg: 'HS256' })
.setSubject(String(userId))
.setIssuedAt()
.setExpirationTime('7d')
.sign(enc());
}


export default async function authRoutes(app: FastifyInstance) {
// prefix appliqué par main.ts → /auth/register, /auth/login, /auth/logout


app.post('/register', async (req, reply) => {
const body = regSchema.parse(req.body);


// Colonnes normalisées pour unicité insensible à la casse
const emailLower = body.email.toLowerCase();
const usernameLower = body.username.toLowerCase();


// Conflits ? (index/unique sur emailLower & usernameLower côté Prisma)
const exists = await app.prisma.user.findFirst({
where: { OR: [{ emailLower }, { usernameLower }] },
select: { id: true },
});
if (exists) return reply.code(409).send({ error: 'Email or username already taken' });


const passwordHash = await argon2.hash(body.password, ARGON);
const user = await app.prisma.user.create({
data: {
email: body.email,
emailLower,
username: body.username,
usernameLower,
passwordHash,
},
select: { id: true, email: true, username: true, createdAt: true },
});


const jwt = await issueToken(user.id);
reply.setCookie('access_token', jwt, {
httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
});


return reply.code(201).send(user);
});


app.post('/login', async (req, reply) => {
const body = loginSchema.parse(req.body);


const key = body.emailOrUsername.toLowerCase();
const user = await app.prisma.user.findFirst({
where: { OR: [{ emailLower: key }, { usernameLower: key }] },
});
if (!user) return reply.code(401).send({ error: 'Invalid credentials' });


const ok = await argon2.verify(user.passwordHash, body.password, ARGON);
if (!ok) return reply.code(401).send({ error: 'Invalid credentials' });


const jwt = await issueToken(user.id);
reply.setCookie('access_token', jwt, {
httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
});


return reply.send({ id: user.id, email: user.email, username: user.username });
});


app.post('/logout', async (_req, reply) => {
reply.clearCookie('access_token', { path: '/', secure: true, sameSite: 'lax' });
return reply.code(204).send();
});
}


