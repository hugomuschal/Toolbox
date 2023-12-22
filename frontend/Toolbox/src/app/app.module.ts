import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {StartPageComponent} from "./contents/start-page/start-page.component";
import {MatIconModule} from "@angular/material/icon";
import { SideMenuComponent } from './header/side-menu/side-menu.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ImpressumComponent } from './contents/impressum/impressum.component';
import { DatenschutzComponent } from './contents/datenschutz/datenschutz.component';
import { WheelComponent } from './contents/wheel/wheel.component';
import { DiceComponent } from './contents/dice/dice.component';
import { DiceElementComponent } from './contents/dice/dice-element/dice-element.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    StartPageComponent,
    SideMenuComponent,
    ImpressumComponent,
    DatenschutzComponent,
    WheelComponent,
    DiceComponent,
    DiceElementComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatIconModule,
        BrowserAnimationsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
