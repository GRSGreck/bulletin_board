import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormControl, FormArray, Validators, FormBuilder} from '@angular/forms';

import {UserService} from "../../../user.service";
import {User} from "../../../shared/user.model";
import {FormAbstract} from "../../../shared/form.abstract";
import {NUMBER_TELEPHONE_NUMBERS} from '../../../../core/constants';
import * as _ from 'lodash';

@Component({
    selector: 'profile',
    templateUrl: './profile.template.html',
    styleUrls: ['./profile.styles.scss']
})

export class ProfileComponent extends FormAbstract implements OnInit, OnDestroy{
    public currentUser: User;
    public formProfile: FormGroup;
    private _subscription: any;
    private _isOldValue: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService
    ) {
        super();
    }

    ngOnInit(): void {
        this.currentUser = this.userService.getCurrentUser();

        this.formProfile = this.fb.group({
            firstName: [this.currentUser['firstName'], [ Validators.required, Validators.minLength(3), Validators.maxLength(30) ]],
            lastName: [this.currentUser['lastName'], [ Validators.required, Validators.minLength(3), Validators.maxLength(30) ]],
            phones: this.fb.array( this.getCurrentPhones(this.currentUser) )
        });

        this.setFormGroup(this.formProfile);

        this._subscription = this.userService.getCurrentUserUpdated().subscribe(
            () => this.currentUser = this.userService.getCurrentUser()
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    private getCurrentPhones(user: User): [string, Validators[]][] {
        if ( !user['phones'].length ) return [ ['+380', [Validators.pattern(/^(\+\d{2})?\d{10}$/)]] ];
        return user['phones'].map((phone: string) => [phone, [Validators.pattern(/^(\+\d{2})?\d{10}$/)]]);
    }

    getPhones(): FormArray {
        return <FormArray>this.formProfile.get('phones');
    }

    public addPhone(event: MouseEvent) {
        event.preventDefault();

        if (this.getPhones().length < NUMBER_TELEPHONE_NUMBERS) {
            this.getPhones().push( new FormControl('+380', Validators.pattern(/^(\+\d{2})?\d{10}$/)) );
        }
    }

    public removePhone(event: MouseEvent): void {
        event.preventDefault();

        // Always delete the last one item
        if (!this.isLastPhone()) {
            this.getPhones().removeAt(this.getPhones().length - 1);
        } else {
            this.getPhones().get('0').setValue('+380');
        }
    }

    public isMaxNumberPhones(): boolean {
        return this.getPhones().length >= NUMBER_TELEPHONE_NUMBERS;
    }

    public isLastPhone(): boolean {
        return this.getPhones().length === 1;
    }

    public getIsOldValue(): boolean {
        return this._isOldValue;
    }

    //TODO: разобраться
    public setIsOldValue(value: boolean): void {
        this._isOldValue = value;
    }

    public onKeyUp(event: any): void {
        let profileFields = _.pick(this.currentUser, _.keys(this.formProfile.value));
        this.setIsOldValue( this.isOldValue(profileFields, this.formProfile.value) );
        if (event.keyCode !== 13) this.setSuccessMessage(false);
    }

    public onSubmit(): void {
        let fields = this.formProfile.value;

        this.markAsTouchedAllFields(this.formProfile);
        this.setSuccessMessage(false);
        this.setIsSending(true);

        this.userService.editProfile(fields)
            .subscribe(
                (res) => {
                    // this.setIsOldValue(true);
                    this.setSuccessMessage(true);
                    this.setIsSending(false);
                },
                err => {
                    this.getErrors(err, { isFormSubgroups: true });
                    this.setIsSending(false);
                }
            );
    }
}