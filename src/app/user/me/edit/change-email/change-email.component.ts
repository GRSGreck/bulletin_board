import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {UserService} from "../../../user.service";
import {User} from "../../../shared/user.model";
import {FormValidationAbstract} from "../../../shared/form-validation.abstract";
import {NgbdModalContent} from "../../../modal/modal.content";

@Component({
    selector: 'profile',
    templateUrl: 'change-email.template.html',
    styleUrls: ['change-email.styles.scss']
})

export class ChangeEmailComponent extends FormValidationAbstract implements OnInit {
    currentUser: User;
    formEmail: FormGroup;
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

        this.formEmail = this.fb.group({
            current_email: [this.currentUser['email'], [
                Validators.required,
                Validators.pattern(/^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/),
                Validators.maxLength(100)
            ]],
            new_email: ['', [
                Validators.required,
                Validators.pattern(/^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/),
                Validators.maxLength(100)
            ]],
            password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(24) ]]
        });
    }
    public getFormControl(fieldName: string): FormControl {
        return <FormControl>this.formEmail.controls[fieldName];
    }

    public onSubmit(): void {
        let user: User = this.formEmail.value;
        let self = this;

        this.userService.editCurrentUser(user)
            .subscribe(
                function (res) {
                    console.log('Your profile was successfully updated:', res);
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