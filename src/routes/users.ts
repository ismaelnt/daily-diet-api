import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      password: z.string().min(6),
    });

    const { email, password } = createUserBodySchema.parse(request.body);

    const userExists = await knex("users").where("email", email).first();

    if (userExists) {
      return reply.status(422).send({ message: "User already exists" });
    }

    await knex("users").insert({
      id: crypto.randomUUID(),
      email,
      password,
    });

    return reply.status(201).send({ message: "User registered successfully" });
  });

  app.get(
    "/protected",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      return reply.send({
        message: "Você está autenticado!",
        user: request.user,
      });
    }
  );
}
