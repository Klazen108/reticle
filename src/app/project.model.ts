import { Phase } from "./phase.model";
import { MongooseModel } from "./abstract-list.service";

export class Project implements MongooseModel {
    _id: string;
    name: string;
    branch?: string;
    release?: string;
    project?: string;
    gc?: string;
    folder?: string;

    phases: Phase[] = [];

    public constructor(init?:Partial<Project>) {
        Object.assign(this, init);
    }
}