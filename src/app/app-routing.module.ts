import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { FormUserComponent } from './form-user/form-user.component';
import { FormVehicleComponent } from './form-vehicle/form-vehicle.component';

const routes: Routes = [
  { path: 'formUser', component: FormUserComponent },
  { path: 'formVehicle', component: FormVehicleComponent },
  { path: 'detail', component: DetailComponent },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
