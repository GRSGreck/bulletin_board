import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Router} from "@angular/router";

import {FormPasswordAbstract} from "../shared/form-password.abstract";
import {PREFIX_PASSWORD_GROUP} from '../../core/constants';
import {UserService} from "../user.service";

@Component({
    selector: 'form-register',
    templateUrl: './register.template.html',
    styleUrls: ['./register.styles.scss']
})

export class RegisterComponent extends FormPasswordAbstract implements OnInit {
    formRegister: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ){
        super();
    }

    ngOnInit(): void {
        this.formRegister = this.fb.group({
            email: ['', [
                Validators.required,
                Validators.pattern(/^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/),
                Validators.maxLength(100)
            ]],

            [PREFIX_PASSWORD_GROUP]: this.fb.group({
                password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
                confirm_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]]
            }, { validator: this.isEqual })
        });

        this.setFormGroup(this.formRegister);
    }

    public onSubmit(): void {
        let user = {
            email: this.formRegister.get('email').value,
            password: this.formRegister.get(`${PREFIX_PASSWORD_GROUP}.password`).value,
            confirm_password: this.formRegister.get(`${PREFIX_PASSWORD_GROUP}.confirm_password`).value,
        };

        this.markAsTouchedAllFields(this.formRegister);
        this.setIsSending(true);

        this.userService.create(user)
            .subscribe(
                res => {
                    this.router.navigate(['/me']);
                    this.formRegister.reset();
                    this.setIsSending(false);
                },
                err => {
                    this.getErrors(err, { isFormSubgroups: true });
                    this.setIsSending(false);
                }
            );
    }
}

