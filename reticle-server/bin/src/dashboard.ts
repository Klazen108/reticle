
import * as mongoose from "mongoose";

export interface IDashboard extends mongoose.Document {
    name: string;
}
export const DashboardSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const Book = mongoose.model<IDashboard>("Dashboard", DashboardSchema);
export default Book;