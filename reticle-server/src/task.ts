
import * as mongoose from "mongoose";

export interface ITask extends mongoose.Document {
    name: string;
    taskId: string;

    developerId: string;

    estimate: number;
    remaining: number;
    actual: number;

    state: string;
}
export const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    taskId: { type: String, required: true },
    developerId: { type: String, required: true },
    estimate: { type: Number, required: true },
    remaining: { type: Number, required: true },
    actual: { type: Number, required: true },
    state: { type: String, required: true },
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;