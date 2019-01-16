import { Phase } from "./phase.model";

export class Project {
    name: string;
    branch?: string;
    release?: string;
    project?: string;

    phases?: Phase[];
}