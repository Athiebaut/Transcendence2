import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as repl from "node:repl";

const prisma = new PrismaClient();

export default async function userRoutes(app: FastifyInstance) {
	// Connexion
	app.post('/login', async (request, reply) => {
		const { LogEmail, LogPassword } = request.body as { LogEmail: string; LogPassword: string };

		console.log(LogEmail);
		if (!LogEmail || !LogPassword)
			return reply.status(401).send({ error: 'Forgot email or password' });
		const user = await prisma.user.findUnique({
			where: { email: LogEmail.toLowerCase() },
		});
		if (!user)
			return reply.status(401).send({ error: 'Invalid credentials' });
		const isValid = await bcrypt.compare(LogPassword, user.passwordHash);
		if (!isValid) return reply.status(401).send({ error: 'Invalid credentials' });

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
		reply.send({ message: 'Login successful', token });
	});
	console.log("JWT_SECRET =", process.env.JWT_SECRET);
}
