import {Component, Input} from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: './modal.template.html'
})
export class NgbdModalContent {
    @Input() successRegisterMessage: string;
    @Input() invalidErrors: string[];

    constructor(public activeModal: NgbActiveModal) {}
}