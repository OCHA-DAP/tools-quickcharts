import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BitesComponent } from './bites/bites.component';

const routes: Routes = [
  { path: 'show', component: BitesComponent },
  { path: '', redirectTo: '/show', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes /*, { useHash: true }*/, {})],
  exports: [RouterModule],
  providers: []
})
export class HxlBitesRoutingModule { }
