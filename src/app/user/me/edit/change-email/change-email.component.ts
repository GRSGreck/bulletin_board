import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserService} from "../../../user.service";
import {User} from "../../../shared/user.model";
import {FormAbstract} from "../../../shared/form.abstract";

@Component({
    selector: 'profile',
    templateUrl: 'change-email.template.html',
    styleUrls: ['change-email.styles.scss']
})

export class ChangeEmailComponent extends FormAbstract implements OnInit {
    currentUser: User;
    formEmail: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();

        this.formEmail = this.fb.group({
            new_email: ['', [
                Validators.required,
                Validators.pattern(/^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/),
                Validators.maxLength(100)
            ]],
            password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]]
        });

        this.setFormGroup(this.formEmail);
    }

    public getMaskCurrentEmail(): string {
        let strArr = this.currentUser['email'].split('@');
        strArr[0] = strArr[0].slice(0, 3) + '***';
        return strArr.join('@');
    }

    public onSubmit(): void {
        let fields: User = this.formEmail.value;

        this.userService.changeEmail(fields)
            .subscribe(
                res => {
                    this.setSuccessMessage(true);
                    this.formEmail.reset();
                },
                err => this.getErrors(err)
            );
    }
}