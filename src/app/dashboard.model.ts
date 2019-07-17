import { Project } from "./project.model";

export class Dashboard {
    id: string;
    profile: number;
    projects: Project[];

    public constructor(init?:Partial<Dashboard>) {
        Object.assign(this, init);
    }
}