import mongoose from "mongoose";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";

import Fastify, { type FastifyInstance } from "fastify";
import { taskService } from "./services/task-service";
import { userService } from "./services/user-service";
import { authService } from "./services/auth-service";

interface FastifyApp extends FastifyInstance {
  authenticate?: (request: any, reply: any) => Promise<void>;
}

export class App {
  private readonly fastify: FastifyApp;

  constructor() {
    this.fastify = Fastify({ logger: true });
  }

  async initServer(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL_CONECTION);

      await this.registerPlugins();
      this.registerDecorators();
      this.registerRoutes();

      await this.fastify.listen({ port: 3000, host: "0.0.0.0" });
    } catch (e) {
      console.log(e);
    }
  }

  private registerDecorators(): void {
    this.fastify.decorate("authenticate", async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    });
  }

  private registerRoutes(): void {
    this.fastify.route({
      method: "POST",
      url: "/task/create-task",
      onRequest: [this.fastify.authenticate],
      handler: async ({ body, user }, reply) => {
        const { id } = user as { id: string };

        await taskService.createTask({
          ...(body as any),
          userId: id,
        });

        void reply.status(200);
      },
    });

    this.fastify.route({
      method: "GET",
      url: "/task",
      onRequest: [this.fastify.authenticate],
      handler: async (request) => {
        const { id } = request.user as { id: string };

        return await taskService.getTasksByUserId(id);
      },
    });

    this.fastify.route({
      method: "POST",
      url: "/user/create-user",
      handler: async ({ body }, reply) => {
        try {
          await userService.createUser(body as any);

          await reply.status(200).send({ message: "User created" });
        } catch (e) {
          await reply.status(400).send({ message: e.message });
        }
      },
    });

    this.fastify.route({
      method: "POST",
      url: "/auth/login",
      schema: {
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },

      handler: async ({ body }, reply) => {
        const { email, password } = body as any;
        const { isLogged, user } = await authService.login(email, password);

        if (isLogged) {
          const token = this.fastify.jwt.sign({ email, id: user._id });

          await reply.status(200).send({ token });
        }

        await reply.status(403).send({ message: "Invalid credentials" });
      },
    });
  }

  private async registerPlugins(): Promise<void> {
    await this.fastify.register(fastifyCors, {
      origin: "*",
    });

    await this.fastify.register(fastifyJwt, {
      secret: process.env.JWT_SECRET,
    });
  }
}
