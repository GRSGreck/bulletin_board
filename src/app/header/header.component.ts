import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';

import {UserService} from "../user/user.service";

@Component({
    selector: 'header',
    templateUrl: './header.template.html',
    styleUrls: ['./header.styles.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false;
    subscription: any;

    constructor(
        private router: Router,
        private userService: UserService
    ) {

    }

    ngOnInit(): void {
        this.isLoggedIn = this.userService.isLoggedIn();

        this.subscription = this.userService.getLoggedInChange().subscribe(
            () => this.isLoggedIn = this.userService.isLoggedIn()
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public goHome(): void {
        this.router.navigate(['/']);
        // this.router.navigate(['/', 5], { queryParams: { age: 25, gender: 'male' } });
    }

    public getLogout(): void {
        this.userService.logout().subscribe(
            (res) => console.log(res),
            (err) => console.error(err)
        );
    }
}