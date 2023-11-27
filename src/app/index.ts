import mongoose from "mongoose";

import Fastify, { type FastifyInstance } from "fastify";
import { TaskService } from "./task-service";

export class App {
  private readonly fastify: FastifyInstance;

  constructor() {
    this.fastify = Fastify({ logger: true });
  }

  async initServer(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL_CONECTION);

      this.registerRoutes();

      await this.fastify.listen({ port: 3000, host: "0.0.0.0" });
    } catch (e) {
      console.log(e);
    }
  }

  private registerRoutes(): void {
    const taskService = new TaskService();

    this.fastify.route({
      method: "POST",
      url: "/task/create-task",
      handler: async ({ body }, reply) => {
        await taskService.createTask(body as any);

        void reply.status(200);
      },
    });

    this.fastify.route({
      method: "GET",
      url: "/task",
      handler: async () => {
        return await taskService.getAllTasks();
      },
    });
  }
}
