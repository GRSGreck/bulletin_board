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
    templateUrl: './profile.template.html',
    styleUrls: ['./profile.styles.scss']
})

export class ProfileComponent extends FormValidationAbstract implements OnInit{
    currentUser: User;
    formProfile: FormGroup;
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

        this.formProfile = this.fb.group({
            name: [this.currentUser['name'], [ Validators.required, Validators.minLength(3), Validators.maxLength(30) ]],
            phone: [this.currentUser['phone'], Validators.pattern(/^(\+\d{2})?\d{10}$/)]
        });
    }
    public getFormControl(fieldName: string): FormControl {
        return <FormControl>this.formProfile.controls[fieldName];
    }

    public onSubmit(): void {
        let user: User = this.formProfile.value;
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