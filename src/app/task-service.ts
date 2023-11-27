import { type TaskType, Task } from "./database";

interface CreateTaskDto extends Omit<TaskType, "id"> {}

export class TaskService {
  async createTask(createTaskDto: CreateTaskDto): Promise<void> {
    const task = new Task({
      date: createTaskDto.date,
      description: createTaskDto.description,
      timeRange: createTaskDto.timeRange,
    });

    await task.save();
  }

  async getAllTasks(): Promise<TaskType[]> {
    return await Task.find();
  }
}
