import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './component';
import { HeaderComponent } from "./header/component";
import { FormRegisterComponent } from "./forms/register/component";
import { FormLoginComponent } from "./forms/login/component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FormRegisterComponent,
        FormLoginComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
