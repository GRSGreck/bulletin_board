import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import '../public/styles/styles.scss';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

    closeResult: string;

    constructor(private modalService: NgbModal) {}

    ngOnInit() {
        console.log('process.env.ENV:', process.env.ENV);

        console.log('is number', _.isNumber(15));
    }

    open(content: any) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }
}