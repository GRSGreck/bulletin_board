import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { UserRoutingModule } from './user.routing';

import { UserService } from './user.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgbdModalContent } from "./modal/modal.content";
import {MeComponent} from "./me/me.component";
import {EditMeComponent} from "./me/edit/edit.component";
import {ProfileComponent} from "./me/edit/profile/profile.component";
import {ForgotPasswordComponent} from "./me/edit/forgot-password/forgot-password.component";
import {ChangeEmailComponent} from "./me/edit/change-email/change-email.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UserRoutingModule,
        NgbModule
    ],
    declarations: [
        RegisterComponent,
        LoginComponent,
        NgbdModalContent,
        MeComponent,
        EditMeComponent,
        ProfileComponent,
        ForgotPasswordComponent,
        ChangeEmailComponent
    ],
    entryComponents: [NgbdModalContent],
    providers: [UserService]
})

export class UserModule {}