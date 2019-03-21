import { ReleaseComponent } from "./release-component.model";

export class Release {
    id: string;
    name: string;

    components: ReleaseComponent[] = [];

    public constructor(init?:Partial<Release>) {
        Object.assign(this, init);
    }
}