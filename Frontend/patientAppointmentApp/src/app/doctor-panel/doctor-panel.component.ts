import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr-client';
import {Http, Response} from '@angular/http';
import { DoctorPanelService } from './doctor-panel.service';
import { AppService } from '../app.service';

@Component({
  selector: 'app-doctor-panel',
  templateUrl: './doctor-panel.component.html',
  styleUrls: ['./doctor-panel.component.css'],
  providers:[DoctorPanelService]
})
export class DoctorPanelComponent implements OnInit {

  private _hubConnection: HubConnection;

  constructor(private http:Http, private service:DoctorPanelService,private _appService:AppService) { }

  ngOnInit() {

    this._hubConnection = new HubConnection(this._appService.singnalRURL);

    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

      this._hubConnection.on('rcvrFnSendPatientToDoctor', (patientID: string) => {
        console.log('dr received the patient ID: '+patientID);
        this.getPatientData(patientID);
      });
  }

    getPatientData(patientID:any){
          this.service.getPatientData(patientID).
          subscribe(res=>
            {
              this.patientData=res['ResultSets'][0][0];
              console.log(this.patientData);
            });
   }

   patientData:any;
   

  patientPrescriptionDoneFN(){
    
  }

}
