import {Injectable, EventEmitter} from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { User } from './shared/user.model';
import {ConstService} from "../core/const.service";

@Injectable()

export class UserService {
    private _loggedIn: boolean = false;
    private _loggedInChange: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: Http,
        private constService: ConstService
    ){
        this._loggedIn = !!localStorage.getItem( this.constService.CURRENT_USER );
    }

    public create(user: User): Observable<User> {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this.http
            .post('/api/register', JSON.stringify(user), {headers})
            .map((res: Response) => new User( res.json() ))
            .map((user: User) => {
                this._setCurrentUser(user);
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
                this._emitLoggedInChangeEvent();
                return { success: 'login' };
            })
            .catch((err: Response) => Observable.throw(err));
    }

    public logout(): Observable<any> {
        return this.http
            .get('/api/logout')
            .map((res: Response) => {
                this._removeCurrentUsser();
                this._emitLoggedInChangeEvent();
                return res;
            })
            .catch((err: Response) => Observable.throw(err));
    }

    public isLoggedIn(): boolean {
        return this._loggedIn;
    }

    public getCurrentUser(): User {
        return JSON.parse(localStorage.getItem( this.constService.CURRENT_USER ));
    }

    private _setCurrentUser(user: User): void {
        localStorage.setItem(this.constService.CURRENT_USER, JSON.stringify(user));
        this._loggedIn = true;
    }

    private _removeCurrentUsser(): void {
        localStorage.removeItem( this.constService.CURRENT_USER );
        this._loggedIn = false;
    }

    private _emitLoggedInChangeEvent(): void {
        this._loggedInChange.emit();
    }

    public getLoggedInChange(): EventEmitter<any> {
        return this._loggedInChange;
    }
}