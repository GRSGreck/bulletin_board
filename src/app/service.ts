import { Injectable } from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from './models/user';

@Injectable()

export class AppService {
    constructor(private http: Http){}

    registeredUser(user: User): Observable<User> {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        console.log('headers', headers);

        return this.http
            .post('/api/register', JSON.stringify(user), {headers})
            .map((res: Response) => res.json().data)
            .catch((err) => {
                console.log('service err', err);
                return Observable.throw(err);
            });
    }
}