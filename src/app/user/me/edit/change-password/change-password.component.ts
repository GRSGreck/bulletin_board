import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserService} from "../../../user.service";
import {PREFIX_PASSWORD_GROUP} from "../../../../core/constants";
import {FormPasswordAbstract} from "../../../shared/form-password.abstract";

@Component({
    selector: 'change-password',
    templateUrl: 'change-password.template.html',
    styleUrls: ['change-password.styles.scss']
})
export class ChangePasswordComponent extends FormPasswordAbstract implements OnInit{
    formChangePassword: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService
    ) {
        super();
    }

    ngOnInit() {
        this.formChangePassword = this.fb.group({
            current_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],

            [PREFIX_PASSWORD_GROUP]: this.fb.group({
                new_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
                confirm_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]]
            }, { validator: this.isEqual })
        });

        this.setFormGroup(this.formChangePassword);
    }

    public onSubmit(): void {
        let fields = {
            current_password: this.formChangePassword.get('current_password').value,
            new_password: this.formChangePassword.get(`${PREFIX_PASSWORD_GROUP}.new_password`).value,
            confirm_password: this.formChangePassword.get(`${PREFIX_PASSWORD_GROUP}.confirm_password`).value,
        };

        this.markAsTouchedAllFields(this.formChangePassword);
        this.setSuccessMessage(false);
        this.setIsSending(true);

        this.userService.changePassword(fields)
            .subscribe(
                res => {
                    this.setSuccessMessage(true);
                    this.formChangePassword.reset();
                    this.setIsSending(false);
                },
                err => {
                    this.getErrors(err, { isFormSubgroups: true });
                    this.setIsSending(false);
                }
            );
    }
}