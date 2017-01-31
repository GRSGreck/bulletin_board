import {Component} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import { FormValidationAbstract } from '../shared/form-validation.abstract';
import { UserService } from "../user.service";
import { User } from '../shared/user.model';
import {NgbdModalContent} from "../modal/modal.content";
import {Router} from "@angular/router";

@Component({
    selector: 'form-register',
    templateUrl: './register.template.html',
    styleUrls: ['./register.styles.scss']
})

export class RegisterComponent extends FormValidationAbstract {
    formRegister: FormGroup;
    closeResult: string;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private modalService: NgbModal,
        private router: Router
    ){
        super();

        this.formRegister = fb.group({
            email: ['', [
                Validators.required,
                Validators.pattern(/^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/),
                Validators.maxLength(100)
            ]],
            password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
            name: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(30) ]],
            phone: ['+380', Validators.pattern(/^(\+\d{2})?\d{10}$/)]
        });
    }

    public getFormControl(fieldName: string): FormControl {
        return <FormControl>this.formRegister.controls[fieldName];
    }

    public onSubmit(): void {
        let user: User = this.formRegister.value;
        let self = this;

        this.userService.registeredUser(user)
            .subscribe(
                function (res) {
                    console.log('Register user:', res);
                    self.router.navigate(['/me']);
                },
                err => {
                    let modalRef = this.open(NgbdModalContent);
                    modalRef.componentInstance.invalidErrors = this._getError(err);
                }
            );
    }

    private _getError(err: Object): Object[] {
        return JSON.parse(err['_body']);
    }

    private open(content: any): NgbModalRef {
        let modalRef = this.modalService.open(content);

        modalRef.result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                console.log('close result_1:', this.closeResult);
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                console.log('close result_2:', this.closeResult);
            });

        modalRef.componentInstance.modalTitle = 'Регистрация';

        return modalRef;
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}