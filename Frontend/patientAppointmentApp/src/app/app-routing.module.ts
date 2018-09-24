import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppoinmentListComponent } from './appoinment-list/appoinment-list.component';
import { AssistantPanelComponent } from './assistant-panel/assistant-panel.component';
import { DoctorPanelComponent } from './doctor-panel/doctor-panel.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { MyAdminComponent } from './my-admin/my-admin.component';
import { LoginGuard } from './login.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'appointmentList', component: AppoinmentListComponent,canActivate: [LoginGuard] },
  { path: 'assitantPanel', component: AssistantPanelComponent,canActivate: [LoginGuard]  },
  { path: 'doctorPanel', component: DoctorPanelComponent ,canActivate: [LoginGuard] },
  { path: 'adminPanel', component: AdminPanelComponent,canActivate: [LoginGuard]  },
  { path: 'myAdmin', component: MyAdminComponent ,canActivate: [LoginGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full'  }
  //{ path: '', redirectTo: '/appointmentList', pathMatch: 'full' ,canActivate: [LoginGuard] }//,
 // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
