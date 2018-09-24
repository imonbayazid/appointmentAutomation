import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppoinmentListComponent } from './appoinment-list/appoinment-list.component';
import { AssistantPanelComponent } from './assistant-panel/assistant-panel.component';
import { DoctorPanelComponent } from './doctor-panel/doctor-panel.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

import { ModalModule } from 'ngx-bootstrap';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';
import { MyAdminComponent } from './my-admin/my-admin.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AppoinmentListComponent,
    AssistantPanelComponent,
    DoctorPanelComponent,
    AdminPanelComponent,
    MyAdminComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    ModalModule.forRoot(),
    SlimLoadingBarModule.forRoot()
  ],
  providers: [AppService,LoginGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
