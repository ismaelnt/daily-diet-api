import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";
import { usersRoutes } from "./routes/users";
import { authRoutes } from "./routes/auth";

const app = Fastify();

if (!env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY env not found.");
}

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
});

app.register(usersRoutes, {
  prefix: "users",
});

app.register(authRoutes, {
  prefix: "auth",
});

const startServer = async () => {
  try {
    await app
      .listen({ port: env.PORT })
      .then(() => console.log(`HTTP Server is running on ${env.PORT}! 🟢`));
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
