import {Component, OnInit} from '@angular/core';
import {AppService} from "../../app.service";

@Component({
    selector: 'me',
    templateUrl: './me.template.html',
    styleUrls: ['./me.styles.scss']
})

export class MeComponent implements OnInit {
    constructor(private appService: AppService) {
        console.log('R this.appService.currentUser', this.appService.currentUser);

    }

    ngOnInit() {
        // this.appService.getCurrentUser();
        console.log(this.appService.currentUser);
    }
}