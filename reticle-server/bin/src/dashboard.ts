
import * as mongoose from "mongoose";
import { IProject } from "./project";

export interface IDashboard extends mongoose.Document {
    name: string;
    projects: IProject[];
}
export const DashboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    projects: { type: Array, required: true }
});

const Book = mongoose.model<IDashboard>("Dashboard", DashboardSchema);
export default Book;