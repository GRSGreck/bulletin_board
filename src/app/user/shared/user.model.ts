export class User {
    public _id: number;
    public email: string;
    public password: string;
    public name: string;
    public phone: string;

    constructor(userObj?: Object) {
        if (userObj) Object.assign(this, userObj);
    }
}