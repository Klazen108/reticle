export class Profile {
    id: string;
    username: string;

    public constructor(init?:Partial<Profile>) {
        Object.assign(this, init);
    }
}