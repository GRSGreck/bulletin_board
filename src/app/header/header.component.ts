import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {UserService} from "../user/user.service";

@Component({
    selector: 'header',
    templateUrl: './header.template.html',
    styleUrls: ['./header.styles.scss']
})

export class HeaderComponent {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    public goHome(): void {
        this.router.navigate(['/']);
        // this.router.navigate(['/', 5], { queryParams: { age: 25, gender: 'male' } });
    }

    public getLogout(): void {
        this.userService.logoutUser().subscribe(
            (res) => console.log(res),
            (err) => console.error(err)
        );
    }
}