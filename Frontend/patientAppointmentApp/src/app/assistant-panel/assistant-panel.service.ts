import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { HubConnection } from '@aspnet/signalr-client';

@Injectable()
export class AssistantPanelService {

  private _hubConnection: HubConnection;

  constructor(private _appService:AppService) { 
    this._hubConnection = new HubConnection(this._appService.singnalRURL);
    this._hubConnection
      .start()
      .then(() => console.log('Connection started! assistant panel'))
      .catch(err => console.log('Error while establishing connection :('));
  }


      loadDataPatientData(){
        var url='http://localhost:53674/GetPatientDataForAssistantView/json?drID='+this._appService.drID;
        return this._appService.getData(url);
    }

    loadDataReportData(){
      var url='http://localhost:53674/GetReportDataForAssistantView/json?drID='+this._appService.drID;
      return this._appService.getData(url);
    }

    runningPatientSerial:any=0;
    runningReportSerial:any=0;
    completedPatient:any=0;
    completedReport:any=0;
    totalPatient:any=0;
    totalReport:any=0;
    getRunningAppoinmentData(){
      var url=this._appService.baseURL+'GetRunningAppoinmentData/json?drID='+this._appService.drID;
       this._appService.getData(url).subscribe(res=>{
        var data=res['ResultSets'][0][0];
        if(data){
          this.runningPatientSerial=data.RunningPatientSL;
          this.runningReportSerial=data.RunningReportSL;
          this.completedPatient=data.CompletedPatient;
          this.completedReport=data.CompletedReport;
          this.totalPatient=data.TotalPatient;
          this.totalReport=data.TotalReport;
        }
       });
    }

    callPatient(patient:any,patientType:any){
      this._appService.showConfirmDialog("Confirm?","Want to call the patient?").then(res=>{
        if(res===true) {
          // call the patient 
          if(patientType==='patient'){
            this._appService.TTS("Patient serial number "+patient.PatientSerial);
          }
          else  if(patientType==='report'){
            this._appService.TTS("Report serial number "+patient.PatientSerial);
          }
        }
        else {
           // don't call
        }
      });
    }

    sendPatientToDoctor(patient:any,patientType:any){
      this._appService.showConfirmDialog("Confirm?","Want to send the patient to doctor?").then(res=>{
       if(res===true) {
         if(patient && this._appService.drID){      

          var url=this._appService.baseURL+"UpdateRunningAppoinmentData/json?drID="+this._appService.drID+
          "&patientType="+patientType+"&patientSL="+patient.PatientSerial;
          this._appService.getData(url).subscribe(res=>{
              var response=res['ReturnValue'];
              if(response===1) {
                this.sendPatientToDoctorViaSignalR(patient.PatientID);
                patientType==='patient'? this.runningPatientSerial=patient.PatientSerial:this.runningReportSerial=patient.PatientSerial;
              }
              else console.log(" running "+patientType+" serial can't be updated to db");
          });
         }

       }
     });
     }

     sendPatientToDoctorViaSignalR(patientID:any){
              // send the patient to the doctor panel
              this._hubConnection
              .invoke('SendPatientToDoctor',patientID)
              .catch(err => console.error(err));   
     }

     updateAppoinmentDataViaSignalR(){
      //send update of the appoinment data to all window
      console.log('UpdateAppointmentData called via signalR');
      this._hubConnection
      .invoke('UpdateAppointmentData')
      .catch(err => console.error(err));   
     }

     updateAddPatientDataViaSignalR(){
      //send update of the appoinment data to all window
      console.log('AddPatient called via signalR');
      this._hubConnection
      .invoke('AddPatient')
      .catch(err => console.error(err));   
     }
     updateAddReportDataViaSignalR(){
      //send update of the appoinment data to all window
      console.log('AddPatient called via signalR');
      this._hubConnection
      .invoke('AddReport')
      .catch(err => console.error(err));   
     }


     updateIsAppoinmentDone(patient:any,fee:any,isDone:boolean,patientType:any){
      // call SP and update isPresent value to that patient and then reload the list
       var url=this._appService.baseURL+'UpdateIsAppoinmentDone/json?drID='+this._appService.drID+'&'+
                '&patientID='+patient.PatientID+'&patientType='+patientType+
                '&patientSL='+patient.PatientSerial+'&isAppointmentDone='+isDone+
                '&givenPayment='+fee;

      this._appService.getData(url).subscribe(res=>{
           console.log(res['ReturnValue']);
           if( res['ReturnValue']!=-1) {
             this.updateAppoinmentDataViaSignalR();
             if(patientType==='patient') this.completedPatient=res['ReturnValue'];
             else if(patientType==='report') this.completedReport=res['ReturnValue'];
            this._appService.showSuccessMessage("Successfully done");
           }
           else this._appService.showRedAlertMessage("Something is wrong");
      });
  }

  updatePatientAttendance(patient:any,updateIsPresent:boolean,patientType:any){
    // call SP and update isPresent value to that patient and then reload the list
     var url='http://localhost:53674/UpdatePatientReportAttendance/json?drID='+this._appService.drID+'&'+
              '&patientID='+patient.PatientID+'&patientType='+patientType+
              '&patientSL='+patient.PatientSerial+'&patientAttendance='+updateIsPresent;

    this._appService.getData(url).subscribe(res=>{
         console.log(res['ReturnValue']);
         //
    });
  }

  addPrescription(selectedPatientReport,addPrescriptionFormValue){

               var patientID=selectedPatientReport?selectedPatientReport.PatientID:null;
               var age=addPrescriptionFormValue.age?addPrescriptionFormValue.age.trim():"";
               var height=addPrescriptionFormValue.height?addPrescriptionFormValue.height.trim():"";
               var history=addPrescriptionFormValue.history?addPrescriptionFormValue.history.trim():"";
               var location=addPrescriptionFormValue.location?addPrescriptionFormValue.location.trim():"";
               var nextVisit=addPrescriptionFormValue.nextVisit?addPrescriptionFormValue.nextVisit.trim():"";
               var prescription=addPrescriptionFormValue.prescription?addPrescriptionFormValue.prescription.trim():"";
               var pressure=addPrescriptionFormValue.pressure?addPrescriptionFormValue.pressure.trim():"";
               var report=addPrescriptionFormValue.report?addPrescriptionFormValue.report.trim():"";
               var weight=addPrescriptionFormValue.weight?addPrescriptionFormValue.weight.trim():"";
             if(!patientID) {
              return new Promise((resolve, reject) => {
                resolve(0);
              });
             }


             if(age || history || location || history || prescription || report){
               //api/Utilization/addPrescription
              var url="http://localhost:53674/AddPrescription/json?drID="+this._appService.drID+
              "&patientID="+patientID+ "&location="+location+  "&age="+age+"&weight="+weight+ 
               "&height="+height+ "&pressure="+pressure+  "&history="+history+ "&prescription="+prescription+ 
                "&report="+report+"&nextVisit="+nextVisit;
              return this._appService.getData(url).toPromise();
             } 
             else {
              return new Promise((resolve, reject) => {
                resolve(-1);
              });
             }

  }



  addNewPatient(formData: any){
    var name=formData.patientName.trim();
    var mobileNo=formData.patientMobile.trim();
    if( name && mobileNo ){

    }
    var url=this._appService.baseURL+'AddAppoinmentNewPatient/json?drID='+this._appService.drID+
    '&patientName='+name+'&patientMobile='+mobileNo;
    return this._appService.getData(url);
}


addOldPatient(formData: any){
   var url;
   var id=formData.patientID.trim();
   var pType=formData.patientType.trim()==='Report'?'report':'patient';
       url=this._appService.baseURL+'AddAppoinmentOldPatient/json?drID='+this._appService.drID+
       '&patientID='+id+'&patientType='+pType;
        return this._appService.getData(url);
}


  completeAllAppoinment(){
    this._appService.showConfirmDialog("Is all appointment completed?","Do you want to send a report about today's total appoinment to the Admin?").
    then(res=>{
      if(res){
         // send report to the doctor's mobile
         var url=this._appService.baseURL+'GetTotalAppointmentFees/json?drID='+this._appService.drID;
         this._appService.getData(url).
         subscribe(res=>{
          var data=res['ResultSets'][0];
          var patientData=data.filter(_=>_.PatientType==='patient'); 
          var reportData=data.filter(_=>_.PatientType==='report');
          console.log(patientData) ;
          console.log(reportData) ;         
           if(patientData && reportData){
             var totalPatientFees=0;
              for(var i=0;i<patientData.length;i++){
                totalPatientFees=totalPatientFees+parseInt(patientData[i].GivenPayment);
              }
              console.log('total patient '+patientData.length+' and total fees: '+totalPatientFees);

              var totalReportFees=0;
              for(var i=0;i<reportData.length;i++){
                totalReportFees=totalReportFees+parseInt(reportData[i].GivenPayment);
              }
              if(totalPatientFees && totalReportFees){
                var totalFees=totalPatientFees+totalReportFees;
                console.log('total patient '+reportData.length+' and total fees: '+totalReportFees);
                var msg1="Total patient: "+patientData.length+",report: "+reportData.length;
                var msg3=" Actual total payment: "+totalFees;
                console.log("Total payment "+totalFees);
                var drFeesURL=this._appService.baseURL+'GetDrFees/json?drID='+this._appService.drID;
                this._appService.getData(drFeesURL).
                subscribe(res=>{
                  var data=res['ResultSets'][0][0];
                  if(data){
                    var patientFee=data.NewPatientFee;
                    var reportFee=data.ReportFee;
                    var expectedPayment=(patientFee*patientData.length)+(reportFee*reportData.length);
                    console.log("regular patientFee "+patientFee+" ,reportFee "+reportFee+" total expected payment "+expectedPayment);
                    var msg2=" Expected payment: "+expectedPayment;
                    var msg4=" Adjustment: "+(expectedPayment-totalFees);
                    console.log("adjustment: "+(expectedPayment-totalFees));
                    var finalReportToBsent=msg1+msg2+msg3+msg4;
                    console.log(finalReportToBsent);
                    this.sendSMS(finalReportToBsent);
                  }
                });
              }
           }
         });
      }
      else {

      }
    });
}

sendSMS(msg:any)
{
  var url=this._appService.apiURL+'api/Utilization/SendSMSToUser?destination='
          +this._appService.drNumber+'&msg='+msg;
  this._appService.getData(url).subscribe(res=>{
      console.log(res);
  });
}

}
