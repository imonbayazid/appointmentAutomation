import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import { AppService } from '../app.service';
declare var alertify :any;

@Injectable()
export class MyAdminService {

  constructor(private _appService:AppService) { }

   addDoctorAndInsertHisPAtientTable(drName,drKey,drMobile,drDepartment,
    drChamber,drDivision,drEmail,drDetails1,drDetails2,drDetails3){
    var url='http://localhost:53674/AddDoctorNhisPatientTbl/json?DrName='+drName+
    '&DrKey='+drKey+
    '&DrNumber='+drMobile+
    '&DrDepartment='+drDepartment+
    '&DrChamber='+drChamber+
    '&DrDivision='+drDivision+
    '&DrEmail='+drEmail+
    '&DrDetails1='+drDetails1+
    '&DrDetails2='+drDetails2+
    '&DrDetails3='+drDetails3;
       return this._appService.getData(url);
   }
}
