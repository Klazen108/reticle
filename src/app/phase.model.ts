import { DateRange } from "./daterange.model";

export class Phase {
    name: string;
    range: DateRange = new DateRange();

    public constructor(init?:Partial<Phase>) {
        Object.assign(this, init);
    }
}