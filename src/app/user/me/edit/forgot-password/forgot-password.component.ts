import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {UserService} from "../../../user.service";
import {User} from "../../../shared/user.model";
import {FormValidationAbstract} from "../../../shared/form-validation.abstract";
import {NgbdModalContent} from "../../../modal/modal.content";

@Component({
    selector: 'forgot-password',
    templateUrl: 'forgot-password.template.html',
    styleUrls: ['forgot-password.styles.scss']
})
export class ForgotPasswordComponent extends FormValidationAbstract implements OnInit{
    currentUser: User;
    formForgotPassword: FormGroup;
    closeResult: string;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private modalService: NgbModal,
        private router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();

        this.formForgotPassword = this.fb.group({
            current_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
            new_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
            confirm_password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]],
        });
    }
    public getFormControl(fieldName: string): FormControl {
        return <FormControl>this.formForgotPassword.controls[fieldName];
    }

    public onSubmit(): void {
        let user: User = this.formForgotPassword.value;
        let self = this;

        this.userService.editCurrentUser(user)
            .subscribe(
                function (res) {
                    console.log('Password updated success:', res);
                    self.router.navigate(['/me']);
                },
                err => {
                    let modalRef = this.open(NgbdModalContent);
                    modalRef.componentInstance.invalidErrors = this._getError(err);
                }
            );
    }

    private _getError(err: Object): Object[] {
        return JSON.parse(err['_body']);
    }

    private open(content: any): NgbModalRef {
        let modalRef = this.modalService.open(content);

        modalRef.result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                console.log('close result_1:', this.closeResult);
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                console.log('close result_2:', this.closeResult);
            });

        modalRef.componentInstance.modalTitle = 'Регистрация';

        return modalRef;
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}