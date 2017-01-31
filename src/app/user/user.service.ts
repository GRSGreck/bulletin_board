import { Injectable } from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { User } from './shared/user.model';
import {AppService} from "../app.service";

@Injectable()

export class UserService {
    constructor(
        private http: Http/*,
        private appServise: AppService*/
    ){}

    public registeredUser(user: User): Observable<User> {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this.http
            .post('/api/register', JSON.stringify(user), {headers})
            .map((res: Response) => res)
            .catch((err: Response) => Observable.throw(err));
    }

    public loginUser(loginField: Object): Observable<any> {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this.http
            .post('/api/login', JSON.stringify(loginField), {headers})
            .map((res: Response) => res)
            .catch((err: Response) => Observable.throw(err));
    }

    public logoutUser(): Observable<any> {
        return this.http
            .get('/api/logout')
            .map((res: Response) => res)
            .catch((err: Response) => Observable.throw(err));
    }

    public fetchCurrentUser(): Observable<User> {
        return this.http
            .get('/api/me')
            .map((res) => res.json || {})
            .catch((err) => Observable.throw(err));
    }
}