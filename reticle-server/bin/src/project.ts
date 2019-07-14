
import * as mongoose from "mongoose";
import { Moment } from "moment";


export interface DateRange {
    start?: Moment;
    end?: Moment;
}

export interface Phase {
    name: string;
    range: DateRange;
}

export interface IProject extends mongoose.Document {
    name: string;
    branch?: string;
    release?: string;
    project?: string;
    gc?: string;
    folder?: string;

    phases: Phase[];
}
export const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    branch: { type: String, required: false },
    release: { type: String, required: false },
    project: { type: String, required: false },
    gc: { type: String, required: false },
    folder: { type: String, required: false },
    phases: { type: Array, required: true }
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;