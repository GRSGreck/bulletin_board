import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserService} from "../../../user.service";
import {User} from "../../../shared/user.model";
import {FormAbstract} from "../../../shared/form.abstract";

@Component({
    selector: 'change-password',
    templateUrl: 'change-password.template.html',
    styleUrls: ['change-password.styles.scss']
})
export class ChangePasswordComponent extends FormAbstract implements OnInit{
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
            new_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
            confirm_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
        });

        this.setFormGroup(this.formChangePassword);
    }

    public onSubmit(): void {
        let fields = this.formChangePassword.value;

        this.userService.changePassword(fields)
            .subscribe(
                res => {
                    this.setSuccessMessage(true);
                    this.formChangePassword.reset();
                },
                err => this.getErrors(err)
            );
    }
}