import { Phase } from "./phase.model";

export class Project {
    name: string;
    branch?: string;
    release?: string;
    project?: string;
    gc?: string;
    folder?: string;

    phases?: Phase[];

    public constructor(init?:Partial<Project>) {
        Object.assign(this, init);
    }
}