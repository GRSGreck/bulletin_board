import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';

import '../public/styles/styles.scss';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
    ngOnInit() {
        console.log('process.env.ENV:', process.env.ENV);

        console.log('is number', _.isNumber(15));
    }
}