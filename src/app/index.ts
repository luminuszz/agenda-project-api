import mongoose from "mongoose";
import fastifyCors from "@fastify/cors";

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

      await this.registerPlugins();

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

  private async registerPlugins(): Promise<void> {

    await this.fastify.register(fastifyCors, {
      origin: (origin, cb) => {
        const hostname = new URL(origin).hostname
        if(hostname === "localhost"){
          //  Request from localhost will pass
          cb(null, true)
          return
        }
        // Generate an error on other origins, disabling access
        cb(new Error("Not allowed"), false)
      }
    })
  }

}
