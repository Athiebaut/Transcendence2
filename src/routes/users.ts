import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const updateSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(32).optional(),
});

export default async function usersRoutes(app: FastifyInstance) {
  app.patch('/me', async (req, reply) => {
    // @ts-ignore (déposé par authGuard)
    const userId = req.userId as number | undefined;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

    const body = updateSchema.parse(req.body);
    const data: Record<string, any> = {};
    if (body.email) {
      data.email = body.email;
      data.emailLower = body.email.toLowerCase();
    }
    if (body.username) {
      data.username = body.username;
      data.usernameLower = body.username.toLowerCase();
    }
    if (!Object.keys(data).length) return reply.code(400).send({ error: 'Nothing to update' });

    // collisions éventuelles
    if (data.emailLower || data.usernameLower) {
      const exists = await app.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            { OR: [
              data.emailLower ? { emailLower: data.emailLower } : undefined,
              data.usernameLower ? { usernameLower: data.usernameLower } : undefined,
            ].filter(Boolean) as any },
          ],
        },
        select: { id: true },
      });
      if (exists) return reply.code(409).send({ error: 'Email or username already taken' });
    }

    const user = await app.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, username: true, createdAt: true },
    });

    return reply.send(user);
  });
}
