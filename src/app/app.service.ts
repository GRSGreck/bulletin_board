import {Injectable, OnInit} from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import {User} from "./user/shared/user.model";
import {UserService} from "./user/user.service";

@Injectable()

export class AppService implements OnInit {
    public currentUser: User;

    ngOnInit() {
        this.getCurrentUser();

        console.log('this.currentUser', this.currentUser);
    }

    constructor(private userService: UserService) {}


    public getCurrentUser(): void {
        this.userService.fetchCurrentUser().subscribe(
            (user) => {
                let currentUser = new User(user);
                console.log(currentUser);
                console.log('user {}', new User({}));

                this.currentUser = currentUser;
            }
        );
    }
}