
import * as mongoose from "mongoose";

export interface IKBProject extends mongoose.Document {
    name: string;
    folder?: string;
}
export const KBProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    folder: { type: String, required: true },
});

const KBProject = mongoose.model<IKBProject>("KBProject", KBProjectSchema);
export default KBProject;