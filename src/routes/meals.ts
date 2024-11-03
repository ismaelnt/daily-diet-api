import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function mealsRoutes(app: FastifyInstance) {
  app.get("", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id: user_id } = request.user as { id: string };

    try {
      const meals = await knex("meals")
        .where("user_id", user_id)
        .select("*")
        .orderBy("meal_time", "desc");

      return reply.send({ meals });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.get(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id: user_id } = request.user as { id: string };

      try {
        const meal = await knex("meals").where("user_id", user_id).first();

        return reply.send({ meal });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

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

  app.put(
    "/update/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealParamsSchema.parse(request.params);

      const editMealBodySchema = z.object({
        name: z.string().min(5).max(50),
        description: z.string().max(150).optional(),
        in_diet: z.boolean(),
        meal_time: z.string().datetime(),
      });

      const { name, description, in_diet, meal_time } =
        editMealBodySchema.parse(request.body);

      try {
        const meal = await knex("meals").where("id", id).first();

        if (!meal) {
          return reply.status(404).send({ message: "Not found meal" });
        }

        const { id: user_id } = request.user as { id: string };

        if (meal.user_id !== user_id) {
          return reply.status(403).send({ message: "Unauthorized access" });
        }

        await knex("meals").where("id", id).update({
          updated_at: knex.fn.now(),
          name,
          description,
          in_diet,
          meal_time,
        });

        return reply.status(201).send({ message: "Meal updated successfully" });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
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
        const meal = await knex("meals").where("id", id).first();

        if (!meal) {
          return reply.status(404).send({ message: "Not found meal" });
        }

        const { id: user_id } = request.user as { id: string };

        if (meal.user_id !== user_id) {
          return reply.status(403).send({ message: "Unauthorized access" });
        }

        await knex("meals").where("id", id).del();

        return reply.status(204).send();
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}
