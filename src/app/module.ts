import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './component';
import { HeaderComponent } from "./header/component";
import { FormRegisterComponent } from "./forms/register/component";
import { FormLoginComponent } from "./forms/login/component";
import { AppService } from "./service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FormRegisterComponent,
        FormLoginComponent
    ],
    providers: [ AppService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
