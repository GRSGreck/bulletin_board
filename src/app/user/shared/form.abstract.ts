import {FormGroup, FormControl, FormArray, Form} from '@angular/forms';
import {Response} from "@angular/http";
import * as _ from 'lodash';

import errors from '../../shared/errors';
import {SENDING, PREFIX_PASSWORD_GROUP} from '../../core/constants';

interface IOptionsGetErrors{
    isFormSubgroups?: boolean
}

export abstract class FormAbstract {
    private _formGroup: FormGroup = null;
    private _successMessage: boolean = false;
    private _isSending: boolean = false;

    public getInvalidFields(...fields: string[]): string[] {
        let errForms: Object = errors['forms'];

        for (let i = 0; i < fields.length; i++) {
            let _errors: any = (<FormControl>this._getFormGroup().get(fields[i]))['errors'];

            if (!_.size(_errors) && (fields.length - 1) !== i) continue;
            if (!_.size(_errors) && (fields.length - 1) === i) return [];

            return _.map(_errors, (value: string, key: string) => {
                let firstFieldName: string = fields[i].split('.')[0];
                key = key.toLowerCase();

                switch (firstFieldName) {
                    case 'email':
                    case 'new_email':
                    case 'phones':
                        if (key === 'pattern') key = `${key}_${firstFieldName}`;
                        break;
                }

                return errForms[key] ? errForms[key] : errForms['default']
            });
        }
    }

    public getSuccessMessage(): boolean {
        return this._successMessage;
    }

    public setSuccessMessage(value: boolean): void {
        this._successMessage = value;
    }

    public onKeyUp(event: any): void { if (event.keyCode !== 13) this.setSuccessMessage(false) }

    private _getFormGroup(): FormGroup { return this._formGroup }

    public setFormGroup(formGroup: FormGroup): void { this._formGroup = formGroup }


    public getErrors(errors: Response, options: IOptionsGetErrors = {}): void {
        let _errors: Object[] = JSON.parse( errors['_body'] );

        _errors.forEach((err) => {
            let fieldName: string = err['field'];
            let opt = { [ err['type'] ]: err['message'] };

            switch (fieldName) {
                case 'password':
                case 'new_password':
                case 'confirm_password':
                    fieldName = `${PREFIX_PASSWORD_GROUP}.${fieldName}`;
                    break;
            }

            let field = this._getFormGroup().get(fieldName);

            if (field instanceof FormArray) {
                if (err['reason'] && err['reason']['invalidValues']) {
                    let indexes = err['reason']['invalidValues'].map( (item: any) => item.index );
                    indexes.forEach( (i: number) => ( <FormControl>( <FormArray>field ).at(i) ).setErrors(opt) );
                } else {
                    ( <FormArray>field ).controls.forEach( (item) => ( <FormControl>item ).setErrors(opt) );
                }

                return;
            }

            ( <FormControl>field ).setErrors(opt);
        });
    }

    public isValid(field: string = ''): boolean {
        let formField = <FormControl>this._getFormGroup().get(field);
        return formField['valid'] && (formField['touched'] || formField['dirty']);
    }

    public isInvalid(...fields: string[]): boolean {
        for (let i = 0; i < fields.length; i++) {
            let formField = <FormControl|FormGroup>this._getFormGroup().get( fields[i] );
            let result = formField[ formField instanceof FormControl ? 'invalid' : 'errors'] && formField['touched'];
            if (result) return result;
        }
    }

    public isOldValue(oldValues: Object = {}, newValues: Object = {}): boolean {
        let result: boolean[] = [];
        for (let key in oldValues) result.push( oldValues[key] === newValues[key] );
        return result.every( (value: boolean) => value );
    }

    public getIsSending(): boolean {
        return this._isSending
    }

    public setIsSending(value: boolean): void {
        this._isSending = value
    }

    public getButtonText(value: string): string {
        return this.getIsSending() ? SENDING : value
    }

    public markAsTouchedAllFields(group: FormGroup|FormArray): void {
        group.markAsTouched();

        for (let key in group.controls) {
            if (!group.controls.hasOwnProperty(key)) continue;

            if (group.get(key) instanceof FormControl) {
                group.get(key).markAsTouched();
            } else {
                this.markAsTouchedAllFields( <FormGroup>group.get(key) );
            }
        }

    }

    // Validation
    public isEqual(group: FormGroup): { [ p: string ]: boolean } {
        let values = [];
        let dirtyFields = <boolean[]>[];
        let validFields = <boolean[]>[];
        let isTouchedFields: boolean;
        let isValid: boolean;

        for (let key in group.controls) {
            values.push( group.get(key).value );
            dirtyFields.push( group.get(key).dirty );
            validFields.push( group.get(key).valid );
        }

        isTouchedFields = dirtyFields.every( (field: boolean) => field );
        isValid = validFields.every( (field: boolean) => field );

        return _.uniq( _.compact(values) ).length > 1 && isTouchedFields && isValid ? { not_equal: false } : null;
    }

}