import {Injectable, EventEmitter} from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { User } from './shared/user.model';

@Injectable()

export class UserService {
    private _loggedInChange: EventEmitter<any> = new EventEmitter();
    private _loggedIn: boolean = false;
    private _currentUser: User = null;

    constructor(private http: Http){}

    public load(): Promise<any> {
        return new Promise((resolve, reject) => {

            this._getCurrentUser().subscribe(
                (user: User) => {
                    this._setCurrentUser(user);
                    this._setLoggedIn(true);
                    resolve(true);
                },
                (err) => {
                    err.status === 401 ? resolve(err) : reject(err);
                    return Observable.throw(err);
                }
            );

        });
    }

    public create(user: User): Observable<User> {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this.http
            .post('/api/register', JSON.stringify(user), {headers})
            .map((res: Response) => new User( res.json() ))
            .map((user: User) => {
                this._setCurrentUser(user);
                this._setLoggedIn(true);
                this._emitLoggedInChangeEvent();

                return { success: 'login' };
            })
            .catch((err: Response) => Observable.throw(err));
    }

    public login(loginField: Object): Observable<any> {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this.http
            .post('/api/login', JSON.stringify(loginField), {headers})
            .map((res: Response) => new User( res.json() ))
            .map((user: User) => {
                this._setCurrentUser(user);
                this._setLoggedIn(true);
                this._emitLoggedInChangeEvent();

                return user;
            })
            .catch((err: Response) => Observable.throw(err));
    }

    public logout(): Observable<any> {
        return this.http
            .get('/api/logout')
            .map((res: Response) => {
                this._removeCurrentUser();
                this._emitLoggedInChangeEvent();

                return 'Logout user!';
            })
            .catch((err: Response) => Observable.throw(err));
    }

    private _getCurrentUser(): Observable<User> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http
            .get('/api/me')
            .map((res: Response) => new User( res.json() ))
            .catch((err: Response) => Observable.throw(err));
    }

    public isLoggedIn(): boolean {
        return this._loggedIn;
    }

    public _setLoggedIn(isLoggedIn: boolean): void {
        this._loggedIn = isLoggedIn;
    }

    private _setCurrentUser(user: User): void {
        this._currentUser = user;
    }

    private _removeCurrentUser(): void {
        this._setCurrentUser(null);
        this._setLoggedIn(false);
    }

    public getCurrentUser(): User {
        return this._currentUser;
    }

    private _emitLoggedInChangeEvent(): void {
        this._loggedInChange.emit();
    }

    public getLoggedInChange(): EventEmitter<any> {
        return this._loggedInChange;
    }
}