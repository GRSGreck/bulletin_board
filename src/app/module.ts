import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './component';
import { HeaderComponent } from "./header/component";
import { FormRegisterComponent } from "./forms/register/component";
import { FormLoginComponent } from "./forms/login/component";
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { AppService } from "./service";

const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'register', component: FormRegisterComponent },
    { path: 'login', component: FormLoginComponent },
    { path: '**', component: NotFoundComponent }
    // { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        FormRegisterComponent,
        FormLoginComponent,
        NotFoundComponent
    ],
    providers: [ AppService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
