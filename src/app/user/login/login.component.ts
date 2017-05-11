import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {FormPasswordAbstract} from "../shared/form-password.abstract";
import {UserService} from "../user.service";

@Component({
    selector: 'form-login',
    templateUrl: './login.template.html',
    styleUrls: ['./login.styles.scss']
})

export class LoginComponent extends FormPasswordAbstract implements OnInit {
    formLogin: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.formLogin = this.fb.group({
            email: ['', [
                Validators.required,
                Validators.pattern(/^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/),
                Validators.maxLength(100)
            ]],
            password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
            remember_me: [true]
        });

        this.setFormGroup(this.formLogin);
    }

    public onSubmit(): void {
        let user = this.formLogin.value;

        this.markAsTouchedAllFields(this.formLogin);
        this.setIsSending(true);

        this.userService.login(user)
            .subscribe(
                res => {
                    this.router.navigate(['/me']);
                    this.formLogin.reset();
                    this.setIsSending(false);
                },
                err => {
                    this.getErrors(err);
                    this.setIsSending(false);
                }
            );
    }
}