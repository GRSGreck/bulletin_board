import {Injectable} from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import {User} from "./user/shared/user.model";
import {UserService} from "./user/user.service";

@Injectable()

export class AppService {
    public currentUser: User;

    constructor(private userService: UserService) {
        this._getCurrentUser();
    }


    private _getCurrentUser(): void {
        this.userService.fetchCurrentUser().subscribe(
            (user) => this.currentUser = new User(user),
            (err) => console.log(err)
        );
    }
}