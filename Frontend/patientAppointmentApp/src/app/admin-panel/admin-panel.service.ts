import { Injectable } from '@angular/core';
import { AppService } from '../app.service';

@Injectable()
export class AdminPanelService {

  constructor(private _appService:AppService) { }

  getData() {
    var url=this._appService.baseURL+`GetDoctorAdminInfo/json?drID=`+this._appService.drID;
   return this._appService.getData(url);
 }

 updateData(formValue:any) {
  var mbl= formValue.doctorMobile?formValue.doctorMobile:'';
   var newFee= formValue.newPatientPayment?formValue.newPatientPayment:'';
   var oldFee= formValue.oldPatientPayment?formValue.oldPatientPayment:'';
   var reportFee= formValue.reportPayment?formValue.reportPayment:'';
  var url=this._appService.baseURL+`UpdateDoctorAdminInfo/json?drID=`+this._appService.drID+
  '&drNumber='+mbl+'&newFee='+newFee+
  '&oldFee='+oldFee+'&reportFee='+reportFee;

 return this._appService.getData(url);
}

}
