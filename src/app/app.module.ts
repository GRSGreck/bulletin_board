import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

// App modules
import { UserModule } from './user/user.module';

// App components
import { AppService } from "./app.service";
import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { AppRoutingModule } from './app.routing';

@NgModule({
    imports: [
        // Angular modules
        BrowserModule,
        HttpModule,

        // App modules
        UserModule,

        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        NotFoundComponent
    ],
    providers: [ AppService ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }