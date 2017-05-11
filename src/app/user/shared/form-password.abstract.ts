import {FormAbstract} from './form.abstract';

export abstract class FormPasswordAbstract extends FormAbstract {

    public isShowPwd(input: HTMLInputElement): boolean {
        // Может вернуть undefined поэтому приводим к boolean-му типу
        return <boolean>!!this[`isActive_${ input.getAttribute('id') }`];
    }

    public showPwd(input: HTMLInputElement): void {
        let value = input.getAttribute('type') === 'password' ? 'text' : 'password';
        let inputId = input.getAttribute('id');

        this[`isActive_${inputId}`] = !this[`isActive_${inputId}`];
        input.setAttribute('type', value);
    }

}