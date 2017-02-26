import {Component, OnInit} from '@angular/core';

import {UserService} from "../user.service";
import {User} from "../shared/user.model";

@Component({
    selector: 'me',
    templateUrl: './me.template.html',
    styleUrls: ['./me.styles.scss']
})

export class MeComponent implements OnInit{
    currentUser: User;

    constructor(
        private userService: UserService
    ) {}

    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();
    }
}