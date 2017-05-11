import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {UserService} from "../../../user.service";
import {User} from "../../../shared/user.model";
import {FormAbstract} from "../../../shared/form.abstract";
import {NgbdModalContent} from "../../../modal/modal.content";
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
        private userService: UserService,
        private modalService: NgbModal,
        private router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.currentUser = this.userService.getCurrentUser();

        this.formProfile = this.fb.group({
            name: [this.currentUser['name'], [ Validators.required, Validators.minLength(3), Validators.maxLength(30) ]],
            phone: [this.currentUser['phone'], Validators.pattern(/^(\+\d{2})?\d{10}$/)]
        });

        this.setFormGroup(this.formProfile);

        this._subscription = this.userService.getCurrentUserUpdated().subscribe(
            () => this.currentUser = this.userService.getCurrentUser()
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public getIsOldValue(): boolean {
        return this._isOldValue;
    }

    public setIsOldValue(value: boolean): void {
        this._isOldValue = value;
    }

    public onKeyUp(event: any): void {
        let profileFields = _.pick(this.currentUser, _.keys(this.formProfile.value));
        this.setIsOldValue( this.isOldValue(profileFields, this.formProfile.value) );
        if (event.keyCode !== 13) this.setSuccessMessage(false);
    }

    public onSubmit(): void {
        let user: User = this.formProfile.value;

        this.userService.editProfile(user)
            .subscribe(
                (res) => {
                    this.setIsOldValue(true);
                    this.setSuccessMessage(true);
                },
                err => {
                    this.getErrors(err);
                }
                // err => {
                //     let modalRef = this.open(NgbdModalContent);
                //     modalRef.componentInstance.invalidErrors = this.getErrors(err);
                // }
            );
    }

    private open(content: any): NgbModalRef {
        let modalRef = this.modalService.open(content);
        modalRef.componentInstance.modalTitle = 'Регистрация';

        return modalRef;
    }
}