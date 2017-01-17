import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

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

    constructor(
        private fb: FormBuilder,
        private userService: UserService
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
        console.log('form value:', this.formRegister.value);

        this.userService.registeredUser(user)
            .subscribe(
                user => console.log('user:', user),
                err => console.error('Error:', err)
            );
    }
}