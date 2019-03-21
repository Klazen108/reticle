export class Release {
    id: string;
    name: string;

    public constructor(init?:Partial<Release>) {
        Object.assign(this, init);
    }
}