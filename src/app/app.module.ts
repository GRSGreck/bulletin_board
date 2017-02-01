import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

// App modules
import { UserModule } from './user/user.module';

// Services
import { AppService } from "./app.service";
import {ConstService} from "./core/const.service";

// App components
import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { AppRoutingModule } from './app.routing';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        // Angular modules
        BrowserModule,
        HttpModule,

        // App modules
        UserModule,

        AppRoutingModule,
        NgbModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        NotFoundComponent
    ],
    providers: [ AppService, ConstService ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }