import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {UserService} from "../user.service";
import {FormPasswordAbstract} from "../shared/form-password.abstract";
import {PREFIX_PASSWORD_GROUP} from '../../core/constants';


@Component({
    selector: 'forgot-password',
    templateUrl: 'forgot-password.template.html'
})
export class ForgotPasswordComponent extends FormPasswordAbstract implements OnInit {
    formForgotPassword: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService
    ) {
        super();
    }

    ngOnInit() {
        this.formForgotPassword = this.fb.group({
            email: ['', [
                Validators.required,
                Validators.pattern(/^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/),
                Validators.maxLength(100)
            ]],

            [PREFIX_PASSWORD_GROUP]: this.fb.group({
                new_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
                confirm_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]]
            }, { validator: this.isEqual })
        });

        this.setFormGroup(this.formForgotPassword);
    }

    public onSubmit(): void {
        let fields = {
            email: this.formForgotPassword.get('email').value,
            new_password: this.formForgotPassword.get(`${PREFIX_PASSWORD_GROUP}.new_password`).value,
            confirm_password: this.formForgotPassword.get(`${PREFIX_PASSWORD_GROUP}.confirm_password`).value,
        };

        this.markAsTouchedAllFields(this.formForgotPassword);
        this.setSuccessMessage(false);
        this.setIsSending(true);

        this.userService.forgotPassword(fields)
            .subscribe(
                res => {
                    this.setSuccessMessage(true);
                    this.formForgotPassword.reset();
                    this.setIsSending(false);
                },
                err => {
                    this.getErrors(err, { isFormSubgroups: true });
                    this.setIsSending(false);
                }
            );
    }
}