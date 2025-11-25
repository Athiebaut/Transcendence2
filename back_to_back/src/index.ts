import fastify from 'fastify';
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import { PrismaClient } from '@prisma/client';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';

const prisma = new PrismaClient();
const app = fastify({ logger: true });

await app.register(import('@fastify/multipart'));

await app.register(cors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

await app.register(formbody);

app.register(authRoutes, { prefix: "/auth" });
app.register(userRoutes, { prefix: "/auth" });
app.register(profileRoutes, {prefix: "/update" });
app.get("/test", async () => ({message: "API OK"}));

app.get("/", async () => {
	return { message: " Serv en ligne " };
});

app.ready(err => {
	if (err) throw err;
	console.log(app.printRoutes());
});


const start = async() => {
	try {
		await app.listen({port: 3042, host: "0.0.0.0"});
		console.log("✅ Serveur lancé sur http://localhost:3042");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();