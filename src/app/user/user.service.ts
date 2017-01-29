import { Injectable } from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from './shared/user.model';

@Injectable()

export class UserService {
    constructor(private http: Http){}

    registeredUser(user: User): Observable<User> {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this.http
            .post('/api/register', JSON.stringify(user), {headers})
            .map((res: Response) => res.json().data)
            .catch((err: Response) => Observable.throw(err));
    }

    loginUser(loginField: Object): Observable<any> {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this.http
            .post('/api/login', JSON.stringify(loginField), {headers})
            .map((res: Response) => res.json().data)
            .catch((err: Response) => Observable.throw(err));
    }
}