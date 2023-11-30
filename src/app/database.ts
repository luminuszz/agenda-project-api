import mongoose, { Schema, type InferSchemaType } from "mongoose";

const TaskSchema = new Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  timeRange: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  userId: { type: String, required: true, index: true },
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  password: { type: String, required: true },
  tasks: { type: [TaskSchema] },
});

export type TaskType = InferSchemaType<typeof TaskSchema>;
export type UserType = InferSchemaType<typeof UserSchema>;

export const Task = mongoose.model("Task", TaskSchema);
export const User = mongoose.model("User", UserSchema);
