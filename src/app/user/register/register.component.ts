import {Component, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { FormValidationAbstract } from '../shared/form-validation.abstract';
import { UserService } from "../user.service";
import { User } from '../shared/user.model';

@Component({
    selector: 'form-register',
    templateUrl: './register.template.html',
    styleUrls: ['./register.styles.scss']
})

export class RegisterComponent extends FormValidationAbstract {
    formRegister: FormGroup;
    closeResult: string;
    invalidErrors: string[] = [];
    successRegisterMessage: string = '';

    @ViewChild('modalContent')
    modalContent: HTMLElement;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private modalService: NgbModal
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
        let user = this.formRegister.value;

        this.userService.registeredUser(user)
            .subscribe(
                user => {
                    this.successRegisterMessage = 'Регистрация пользователя успешно завершена!';
                    this.open(this.modalContent);
                },
                err => {
                    this.invalidErrors = this._getError(err);
                    this.open(this.modalContent);
                }
            );
    }

    private _getError(err: Object): string[] {
        let errors = JSON.parse(err['_body']);
        return <string[]>_.map(errors, 'message');
    }

    private open(content: any) {
        this.modalService.open(content).result.then(
            result => {
                // console.log('Result:', result);
                this.closeResult = `Closed with: ${result}`;
                console.log('close result_1:', this.closeResult);

            },
            reason => {
                // console.log('reason:', reason);
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                console.log('close result_2:', this.closeResult);
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