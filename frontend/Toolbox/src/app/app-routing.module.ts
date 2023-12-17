import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartPageComponent} from "./contents/start-page/start-page.component";
import {ImpressumComponent} from "./contents/impressum/impressum.component";
import {DatenschutzComponent} from "./contents/datenschutz/datenschutz.component";

const routes: Routes = [
  {path: "impressum", component: ImpressumComponent},
  {path: "datenschutz", component: DatenschutzComponent},
  {path: "**", component: StartPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
