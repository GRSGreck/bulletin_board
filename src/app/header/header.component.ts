import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';

import {UserService} from "../user/user.service";
import {User} from "../user/shared/user.model";

@Component({
    selector: 'header',
    templateUrl: './header.template.html',
    styleUrls: ['./header.styles.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false;
    currentUser: User;
    subscription: any;

    constructor(
        private router: Router,
        private userService: UserService,
    ) {

    }

    ngOnInit(): void {
        this.currentUser = this.userService.getCurrentUser();
        this.isLoggedIn = this.userService.isLoggedIn();

        this.subscription = this.userService.getLoggedInChange().subscribe(
            () => {
                this.isLoggedIn = this.userService.isLoggedIn();
                this.currentUser = this.userService.getCurrentUser();
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public getLogout(): void {
        this.userService.logout().subscribe(
            (res) => {
                this.router.navigate(['/login']);
                console.log(res)
            },
            (err) => console.error(err)
        );
    }
}