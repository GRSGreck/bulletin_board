import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

// App modules
import {UserModule} from './user/user.module';

// Services
import {AppService} from "./app.service";
import {UserService} from "./user/user.service";

// App components
import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {WarningComponent} from "./warnign/warning.component";
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './errors/not-found/not-found.component';
import {AppRoutingModule} from './app.routing';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

function appServiceFactory(service: any): Function {
    return () => service.load();
}

let preloading = {
    provide: APP_INITIALIZER,
    useFactory: appServiceFactory,
    deps: [UserService],
    multi: true
};

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
        WarningComponent,
        HomeComponent,
        NotFoundComponent
    ],
    providers: [
        AppService,
        preloading
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }