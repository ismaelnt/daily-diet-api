import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string().min(5).max(50),
        description: z.string().max(150).optional(),
        in_diet: z.boolean(),
        meal_time: z.string().datetime(),
      });

      const { name, description, in_diet, meal_time } =
        createMealBodySchema.parse(request.body);

      const { id: user_id } = request.user as { id: string };

      await knex("meals").insert({
        id: crypto.randomUUID(),
        name,
        description,
        in_diet,
        meal_time,
        user_id,
      });

      return reply.status(201).send({ message: "Meal registerd successfully" });
    }
  );

  app.delete(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealParamsSchema.parse(request.params);

      try {
        const meal = await knex("meals").where("id", id).del();

        if (meal === 0) {
          return reply.status(404).send({ message: "Not found meal" });
        }

        return reply.status(204).send();
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}
