import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import * as repl from "node:repl";

export async function verifToken(request: FastifyRequest, reply: FastifyReply) {
	const authHeader = request.headers.authorization;
	if (!authHeader)
		return reply.status(401).send({error: "Token manquant"});
	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		request.user = decoded;
	} catch {
		return reply.status(401).send({ error: "Token invalide" });
	}
}