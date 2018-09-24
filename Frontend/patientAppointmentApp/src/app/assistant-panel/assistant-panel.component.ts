import { Component, OnInit, TemplateRef } from '@angular/core';
import { HubConnection } from '@aspnet/signalr-client';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Http,Response } from '@angular/http';
import {AppService} from '../app.service';
import { AssistantPanelService } from './assistant-panel.service';
declare var alertify :any;
@Component({
  selector: 'app-assistant-panel',
  templateUrl: './assistant-panel.component.html',
  styleUrls: ['./assistant-panel.component.css'],
  providers:[AssistantPanelService]
})
export class AssistantPanelComponent implements OnInit {


  patientData:any;
  reportData:any;
  selectedRow :any;
  selectedReportTableRow :any;


  constructor(private modalService: BsModalService,
              private fb: FormBuilder,private _appService:AppService,private service:AssistantPanelService) { }

  ngOnInit() {

    this.addPatientForm = this.fb.group({
      'patientType': [null],
      'patientID': [null],
      'patientName': [null],
      'patientMobile': [null],
      'patientAge': [null],
      'patientLocation': [null]
  });

  this.addPrescriptionForm=this.fb.group({
    'location': [null],
    'age': [null],
    'weight': [null],
    'height': [null],
    'pressure': [null],
    'history': [null],
    'prescription': [null],
    'report': [null],
    'nextVisit': [null],
});

     this.loadPatientData();
     this.loadReportData();
     this.service.getRunningAppoinmentData();
  } 


  loadPatientData(){
          this.service.loadDataPatientData().
          subscribe(res=>
            {
              this.patientData=res['ResultSets'][0];
              this.patientData?this.service.totalPatient=this.patientData.length:0;
            });
   }

  
   loadReportData(){
      this.service.loadDataReportData().
      subscribe(res=>
        {
          this.reportData=res['ResultSets'][0];
          this.reportData?this.service.totalReport=this.reportData.length:0;
        });
} 

    /**Patient Table */
    callPatient(patient,patientType) { 
      this.service.callPatient(patient,patientType) ;
    }
    sendPatientToDoctor(patient,patientType) {this.service.sendPatientToDoctor(patient,patientType);}

    patientTableRowClick(index:any,row:any){
      this.selectedRow = index;
  }
  reportTableRowClick(index:any,row:any){
    this.selectedReportTableRow = index;
}

  isPresentChange(patient:any,isPresent:boolean,patientType:any){
       this._appService.showConfirmDialog("Confirm?","Is this patient present now?").then(res=>{
         if(res===true) this.service.updatePatientAttendance(patient,isPresent,patientType);
         else {
           if(patientType==='patient'){
            let index = this.patientData.findIndex(x => x.PatientID===patient.PatientID);
            this.patientData[index]['IsPatientPresent']=!isPresent;
           }
           else if(patientType==='report'){
            let index = this.reportData.findIndex(x => x.PatientID===patient.PatientID);
            this.reportData[index]['IsPatientPresent']=!isPresent;
          }                
         }
       });
  }

  isPatientDoneChange(patient:any,fee:any,isDone:boolean,patientType:any){
    console.log(patient);
    this._appService.showConfirmDialogWithInputField("Confirm?","Is appointment completed? Then set doctor's fee",fee)
    .then(res=>{
      if(res===false) {
        if(patientType==='patient'){
          let index = this.patientData.findIndex(x => x.PatientID===patient.PatientID);
          this.patientData[index].IsAppointmentDone=!isDone;
        }
        else if(patientType==='report'){
          let index = this.reportData.findIndex(x => x.PatientID===patient.PatientID);
          this.reportData[index].IsAppointmentDone=!isDone;
        }
        
      }
      else {
        // update to db //res
        this.service.updateIsAppoinmentDone(patient,res,isDone,patientType);
      }
    });
}

completeAllAppoinment() { this.service.completeAllAppoinment(); }

        /*ADD prescription modal*/
        selectedPatientReport:any;
        addPrescriptionForm: FormGroup;
        addPrescription(patient:any,modalRef:any){
          this.selectedPatientReport=patient;
          console.log(this.selectedPatientReport);
          modalRef.show();
        }


        addPrescriptionFN(addPrescriptionFormValue:any,modalRef:any){
              modalRef.hide();
               
              this.service.addPrescription(this.selectedPatientReport,addPrescriptionFormValue).
              then(res=>{
                this.selectedPatientReport=null;
                if(res===-1)  this._appService.showRedAlertMessage("Prescription Can't be empty");
                console.log(res);
              });
        }


    /*ADD patient modal*/
    patientTypeDropdownDATA: any = ["New Patient", "Old Patient", "Report"];
    addPatientForm: FormGroup;
    modalRef: BsModalRef;
    config = {
      animated: false,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'add-patient-modal'
    };

   
    patientTypeChangeEvent(dwValue: any){
      console.log(dwValue);
    }

    openAddPatientModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.config);
    }

    addPaitentFN(formData: any)
    {
     this.modalRef.hide();
     this.addPatientForm.reset();
     // call a SP to insert/update new paitent/old patient
     // then reload the list of patient and report table
       if(formData.patientType.trim()==='New Patient'){
        this.service.addNewPatient(formData).subscribe(res=>{
          var serial=res['ReturnValue'];
          if(serial===-1) this._appService.showRedAlertMessage("Can't add patient");
          else {
            this.loadPatientData();
            this.service.updateAddPatientDataViaSignalR();
          }
        });
       }
       else  {
        var id=formData.patientID.trim();
        var pType=formData.patientType.trim()==='Report'?'report':'patient';
         if( id ){
          this.service.addOldPatient(formData).subscribe(res=>{
            var serial=res['ReturnValue'];
            if(serial<1) this._appService.showRedAlertMessage("ID not found");
            else {
              if(pType==='report') {
                this.loadReportData();
                this.service.updateAddReportDataViaSignalR();
              }
              else {
                this.loadPatientData();
                this.service.updateAddPatientDataViaSignalR();
              }
            }
          });
         }
       }
    }

    
}
