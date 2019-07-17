import { ReleaseComponent } from "./release-component.model";
import { MongooseModel } from "./abstract-list.service";

export class Release implements MongooseModel {
    _id: string;
    name: string;

    components: ReleaseComponent[] = [];

    public constructor(init?:Partial<Release>) {
        Object.assign(this, init);
    }
}