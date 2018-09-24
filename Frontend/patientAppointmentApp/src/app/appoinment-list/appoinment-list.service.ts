import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import { AppService } from '../app.service';
import { HubConnection } from '@aspnet/signalr-client';

@Injectable()
export class AppoinmentListService {

  constructor(private _appService:AppService) {
    
   }

  getReportData() {
    var url='http://localhost:53674/GetReportData/json?drID='+this._appService.drID;
    return  this._appService.getData(url);
  }

  getPatientData() {
    var url='http://localhost:53674/GetPatientData/json?drID='+this._appService.drID;
    return  this._appService.getData(url);
    }

    getDrDetails() {
      var url='http://localhost:53674/GetDoctorInfo/json?drID='+this._appService.drID;
      return  this._appService.getData(url);
      }


        runningPatientSerial:any=0;
        runningReportSerial:any=0;
        completedPatient:any=0;
        completedReport:any=0;
        totalPatient:any=0;
        totalReport:any=0;
        getRunningAppoinmentData(){
          var url=this._appService.baseURL+'GetRunningAppoinmentData/json?drID='+this._appService.drID;
          return this._appService.getData(url);
        }

}
