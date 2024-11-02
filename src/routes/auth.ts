import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", async (request, reply) => {
    const authBodySchema = z.object({
      email: z.string(),
      password: z.string().min(6),
    });

    const { email, password } = authBodySchema.parse(request.body);

    const user = await knex("users").where("email", email).first();

    if (!user || user.password !== password) {
      return reply.status(401).send({ message: "Invalid email or password" });
    }

    const token = app.jwt.sign({ id: user.id, email: user.email });

    return reply.send({ message: "Login successful", token });
  });
}
