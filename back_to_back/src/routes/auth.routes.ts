import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post("/register", async (request, reply) => {
		const { email, password, username } = request.body as {
			email: string;
			password: string;
			username: string;
		};
		console.log(email);
		if (!email || !password || !username)
			return reply.status(400).send({ error: "Champs manquants" });

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email))
			return reply.status(400).send({ error: "Email invalide" });

		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});
		if (existingUser)
			return reply.status(400).send({ error: "Un compte est deja cree avec ce mail" });

		const existUsername = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});
		if (existUsername)
			return reply.status(400).send({ error: "Username deja utiliser" });

		if (password.length < 8)
			return reply.status(400).send({
				error: "Le mot de passe doit contenir 8 caractères minimum",
			});
		console.log(password);
		if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
			return reply.status(400).send({
				error: "Le mot de passe doit contenir au moins une majuscule et un chiffre",
			});

		const hashedPassword = await bcrypt.hash(password, 10);
		
		const newUser = await prisma.user.create({
			data: {
				username,
				usernameLower: username.toLowerCase(),
				email,
				emailLower: email.toLowerCase(),
				passwordHash: hashedPassword,
			},
		});

		return reply.send({
			message: "Inscription réussie",
			user: {
				id: newUser.id,
				email: newUser.email,
				username: newUser.username,
			},
		});
	});
}
