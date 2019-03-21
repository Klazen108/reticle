export class ReleaseComponent {
    id: string;
    name: string;
    type: string;
    body: string;

    public constructor(init?:Partial<ReleaseComponent>) {
        Object.assign(this, init);
    }
}