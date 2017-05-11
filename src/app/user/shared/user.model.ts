interface IUser {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    verified?: boolean;
    phone?: string[];
}

export class User {
    public _id: string = '';
    public email: string = '';
    public password: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public verified: boolean = false;
    public phone: string[];

    constructor(user?: IUser) {
        if (user) Object.assign(this, user);
    }

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public isVerified(): boolean {
        return this.verified;
    }
}