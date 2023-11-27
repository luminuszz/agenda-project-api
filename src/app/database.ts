import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const TaskSchema = new Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  timeRange: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
});

export type TaskType = InferSchemaType<typeof TaskSchema>;

export const Task = mongoose.model("Task", TaskSchema);
