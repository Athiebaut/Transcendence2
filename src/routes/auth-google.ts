import { FastifyInstance } from 'fastify';
import crypto from 'node:crypto';
import * as argon2 from 'argon2';
import { SignJWT } from 'jose';

const ARGON_OPTS = { type: argon2.argon2id, timeCost: 3, memoryCost: 19456, parallelism: 1 };
const FRONT = process.env.FRONT_ORIGIN ?? 'https://front.localhost:8443';
const encSecret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret');
const makeState = () => crypto.randomBytes(16).toString('hex');
const sanitizeUsername = (s: string) => s.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24) || 'user';

async function ensureUniqueUsername(app: FastifyInstance, base: string) {
  let u = base, i = 1;
  while (await app.prisma.user.findFirst({ where: { usernameLower: u.toLowerCase() }, select: { id: true } })) {
    u = `${base}${i++}`;
  }
  return u;
}

async function issueToken(userId: number) {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encSecret());
}

export default async function authGoogleRoutes(app: FastifyInstance) {
  // 1) Redirection vers Google
  app.get('/auth/google', async (req, reply) => {
    const state = makeState();
    const next = typeof (req.query as any)?.next === 'string' ? String((req.query as any).next) : '/';
    reply.setCookie('g_state', state, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 300 });

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI ?? '',
      response_type: 'code',
      scope: 'openid email profile',
      include_granted_scopes: 'true',
      access_type: 'offline',
      prompt: 'consent',
      state: `${state}|${encodeURIComponent(next)}`
    });

    return reply.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + params.toString());
  });

  // 2) Callback Google
  app.get('/auth/google/callback', async (req, reply) => {
    const { code, state } = req.query as { code?: string; state?: string };
    if (!code || !state) { reply.code(400).send({ error: 'Missing code/state' }); return; }

    const cookieState = (req as any).cookies?.g_state as string | undefined;
    const [stateVal, nextRaw] = String(state).split('|', 2);
    if (!cookieState || cookieState !== stateVal) { reply.code(400).send({ error: 'Bad state' }); return; }
    const next = decodeURIComponent(nextRaw || '/');

    // Échange code → tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI ?? '',
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) {
      const msg = await tokenRes.text();
      app.log.error({ msg }, 'google token exchange failed');
      reply.code(400).send({ error: 'Token exchange failed' });
      return;
    }
    const tok = await tokenRes.json() as { access_token: string };

    // Profil
    const uRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { authorization: `Bearer ${tok.access_token}` },
    });
    if (!uRes.ok) { reply.code(400).send({ error: 'Userinfo failed' }); return; }
    const profile = await uRes.json() as { sub?: string; email?: string; email_verified?: boolean; name?: string };

    const providerId = profile.sub;
    if (!providerId || !profile.email || profile.email_verified === false) {
      reply.code(400).send({ error: 'Email/sub missing or not verified' }); return;
    }

    // Upsert user par email
    const email = profile.email;
    const emailLower = email.toLowerCase();
    let user = await app.prisma.user.findFirst({ where: { emailLower } });

    if (!user) {
      const base = sanitizeUsername(profile.name || email.split('@')[0]);
      const username = await ensureUniqueUsername(app, base);
      const usernameLower = username.toLowerCase();
      const randomPwd = crypto.randomBytes(32).toString('hex');
      const passwordHash = await argon2.hash(randomPwd, ARGON_OPTS);

      user = await app.prisma.user.create({
        data: { email, emailLower, username, usernameLower, passwordHash },
      });
    }

    // JWT + cookie
    const jwt = await issueToken(user.id);
    reply.setCookie('access_token', jwt, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });

    return reply.redirect(FRONT + next);
  });
}
