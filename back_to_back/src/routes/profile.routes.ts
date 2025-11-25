import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as repl from "node:repl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

export default async function profileRoutes(app: FastifyInstance) {
	app.addHook("preHandler", async (request, reply) => {
		const auth = request.headers.authorization;
		console.log("AUTH HEADER =", request.headers.authorization);
		if (!auth || !auth.startsWith("Bearer "))
			return reply.status(401).send({ error: "Missing token" });

		try {
			const token = auth.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
			request.user = decoded;
		} catch (e) {
			return reply.status(401).send({ error: "Invalid token"});
		}
	});

	const profileSchema = z.object({
		username: z.string().min(3).optional(),
		email: z.string().email().optional(),
	}).partial();

	app.put("/profile", async (request, reply) => {
		const profileData = {};
		let profileImageFile = null;

		const parts = request.parts();

		for await (const part of parts) {
			if (part.type === 'field') {
				profileData[part.fieldname] = part.value;
			} else if (part.type === 'file' && part.fieldname === 'avatar') {
				profileImageFile = part;
			}
		}
		const parse = profileSchema.safeParse(profileData);

		if(!parse.success) {
			return reply.status(400).send({ error: "Invalid profile data", details: parse.error.issues });
		}

		const validatedData = parse.data;
		const userId = (request.user as any).userId;
		const updateData = {};
		let profileImagePath = null;

		if (profileImageFile) {
			console.log("Taille du fichier reçu :", profileImageFile.file?.size || 'inconnu');
			const uniqueFilename = `${userId}-${Date.now()}${path.extname(profileImageFile.filename)}`;
			const uploadDir = path.resolve('/app/back_to_back/avatar');
			const finalPath = path.join(uploadDir, uniqueFilename);

			console.log("Chemin d'upload :", finalPath);

			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			try {
				await new Promise((resolve, reject) => {
					const writeStream = fs.createWriteStream(finalPath);
					profileImageFile.file.pipe(writeStream)
						.on('finish', () => {
							console.log("Fichier écrit avec succès");
							resolve(null);
						})
						.on('error', (err) => {
							console.error("Erreur d'écriture du fichier:", err);
							reject(new Error("Échec de l'écriture du fichier"));
						});
				});
				profileImagePath = `/avatar/${uniqueFilename}`;
				updateData.avatarUrl = profileImagePath;
			} catch (error) {
				request.log.error('Échec de l\'upload de l\'image:', error);
				return reply.status(500).send({ error: "Échec de l'upload de l'image" });
			}
		}
		if (validatedData.username !== undefined) {
			updateData.username = validatedData.username;
		}
		if (validatedData.email !== undefined) {
			updateData.email = validatedData.email.toLowerCase();
		}

		try {
			const updateUser = await prisma.user.update({
				where: {id: userId},
				data: updateData,
				select: {
					id: true,
					email: true,
					username: true,
					avatarUrl: true,
				}
			})
			reply.send({message: "profile", user: updateUser})
		} catch (error) {
			console.error(error);
			reply.status(500).send({ error: "Erreur lors de la mise a jour" });
		}
	});

	app.get("/profile", async (request, reply) => {
		/*if (!request.user)
			return reply.status(401).send({ eroor: "Not authenticated" });*/

		const userId = (request.user as any).userId;

		const profile = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				email: true,
				avatarUrl: true,
			}
		});

		if (!profile)
			return reply.status(404).send({ error: "User not found" });
		return reply.send(profile);
	});
}