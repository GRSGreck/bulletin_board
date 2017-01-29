import {Component, Input} from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: './modal.template.html',
    styles: [`.field { font-weight: bold }`]
})
export class NgbdModalContent {
    @Input() successMessage: string;
    @Input() invalidErrors: string[];

    constructor(public activeModal: NgbActiveModal) {}
}