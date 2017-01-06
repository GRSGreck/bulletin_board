export class User {
    public id: number;

    constructor(
       public email: string,
       public password: string,
       public name: string,
       public phone?: string
    ) {}
}