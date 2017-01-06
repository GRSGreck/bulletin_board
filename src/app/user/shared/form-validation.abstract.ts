import { FormControl } from '@angular/forms';
import * as _ from 'lodash';

export abstract class FormValidationAbstract {
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