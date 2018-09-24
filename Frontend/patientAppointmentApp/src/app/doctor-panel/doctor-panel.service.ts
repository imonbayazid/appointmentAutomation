import { Injectable } from '@angular/core';
import { AppService } from '../app.service';

@Injectable()
export class DoctorPanelService {

  constructor(private _appService:AppService) { }

  getPatientData(patientID:any) {
    console.log('ds');
    var url=this._appService.baseURL+'GetPatientDataForDoctorView/json?drID='+this._appService.drID+
    '&patientID='+patientID;
    return this._appService.getData(url);
  }
  

}
