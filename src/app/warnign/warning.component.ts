import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from "../user/user.service";

import {User} from "../user/shared/user.model";

@Component({
    selector: 'warning',
    templateUrl: 'warning.template.html',
    styles: [`
        .container-fluid { margin-bottom: 0 }
        .warning-container { padding: 10px 0 }
        p { margin-bottom: 0 }
    `]
})
export class WarningComponent implements OnInit, OnDestroy {
    public _warning: string = '';
    isLoggedIn: boolean = false;
    currentUser: User;
    subscription: any;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();
        this._isVerifiedCurrentUser();

        this.subscription = this.userService.getLoggedInChange().subscribe(() => {
            this.currentUser = this.userService.getCurrentUser();
            this._isVerifiedCurrentUser();
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public getWarning(): string {
        return this._warning;
    }

    private setWarning(text: string): void {
        this._warning = text;
    }

    private _isVerifiedCurrentUser(): void {
        if (this.currentUser && !this.currentUser.isVerified()) {
            this.setWarning('Чтобы завершить регистрацию, подтвердите Ваш email');
        } else {
            this.setWarning('');
        }
    }

    public onResendLetter(event: MouseEvent): void {
        event.preventDefault();

        this.userService.resendLetter().subscribe(
            (res) => {
                // TODO: сделать дайлог о успешной отправке запроса
                console.log(res);
            },
            err => {
                // TODO: сделать глобальную обработку ошибок
                console.error(err);
            }
        );
    }

}