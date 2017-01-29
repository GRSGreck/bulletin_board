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
        MeComponent
    ],
    entryComponents: [NgbdModalContent],
    providers: [UserService]
})

export class UserModule {}