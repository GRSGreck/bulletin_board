import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

import { User } from '../../models/user';
import {AppService} from "../../service";

// interface FormValidationInterface {
//     getFormControl(fieldName: string): FormControl;
// }

abstract class FormValidationAbstract {
    public getInvalidFields(formControl: FormControl): string[] {

        return _.map(formControl['errors'], function (value, key) {
            let result: string = '';

            switch(key) {
                case 'required':
                    result = 'Поле обязательное к заполнению';
                    break;
                case 'pattern':
                    result = 'В поле введено не корректное значение!';
                    break;
                case 'minlength':
                    result = 'Введено слишком мало символов';
                    break;
                case 'maxlength':
                    result = 'Привышен лимит символов';
                    break;
                default:
                    result = 'В поле введено не корректное значение!';
            }

            return result;
        });

    }

    public isValid(formControl: FormControl): boolean {
        return formControl['valid'] && formControl['touched'];
    }

    public isInvalid(formControl: FormControl): boolean {
        return formControl['invalid'] && formControl['touched'];
    }
}



@Component({
    selector: 'form-register',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})

export class FormRegisterComponent extends FormValidationAbstract/* implements FormValidationInterface */{
    formRegister: FormGroup;

    constructor(
        private fb: FormBuilder,
        private appService: AppService
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

        this.appService.registeredUser(user)
            .subscribe(
                user => console.log('user:', user),
                err => console.error(err)
            );
    }
}