import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Guards
import {AuthGuard} from "../core/guards/auth.guard";
import {NotAuthGuard} from "../core/guards/not-auth.guard";

// Components
import {RegisterComponent} from './register/register.component';
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {LoginComponent} from './login/login.component';
import {MeComponent} from "./me/me.component";
import {EditMeComponent} from "./me/edit/edit.component";
import {ProfileComponent} from "./me/edit/profile/profile.component";
import {ChangePasswordComponent} from "./me/edit/change-password/change-password.component";
import {ChangeEmailComponent} from "./me/edit/change-email/change-email.component";

const routes: Routes = [
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuard] },
    { path: 'me', component: MeComponent, canActivate: [NotAuthGuard] },
    { path: 'me/edit', redirectTo: '/me/edit/profile', pathMatch: 'full' },
    { path: 'me/edit', component: EditMeComponent, canActivate: [NotAuthGuard], children: [
        { path: 'profile', component: ProfileComponent },
        { path: 'change-email', component: ChangeEmailComponent },
        { path: 'change-password', component: ChangePasswordComponent }
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, NotAuthGuard]
})

export class UserRoutingModule { }