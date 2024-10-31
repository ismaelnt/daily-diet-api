import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = createUserBodySchema.parse(request.body);

    const userExists = await knex("users").where("email", email).first();

    if (userExists) {
      return reply.status(422).send({ message: "User already exists" });
    }

    await knex("users").insert({
      email,
      password,
    });

    return reply.status(201).send({ message: "User registered successfully" });
  });
}
