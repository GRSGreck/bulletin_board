import {Component, OnInit} from '@angular/core';

import {UserService} from "../user.service";

@Component({
    selector: 'me',
    templateUrl: './me.template.html',
    styleUrls: ['./me.styles.scss']
})

export class MeComponent implements OnInit{
    constructor(
        private userService: UserService
    ) {}

    ngOnInit() {
        console.log('R me:', this.userService.getCurrentUser());
    }
}