import { Project } from "./project.model";

export class Dashboard {
    id: number;
    profile: number;
    projects: Project[];

    public constructor(init?:Partial<Dashboard>) {
        Object.assign(this, init);
    }
}