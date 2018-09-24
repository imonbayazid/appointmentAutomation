import { Component, OnInit } from '@angular/core';
import { Http,Response } from '@angular/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../app.service';
import { MyAdminService } from './my-admin.service';

@Component({
  selector: 'app-my-admin',
  templateUrl: './my-admin.component.html',
  styleUrls: ['./my-admin.component.css'],
  providers: [MyAdminService]
})
export class MyAdminComponent implements OnInit {

  constructor(private fb: FormBuilder,private _appService:AppService,private myservice:MyAdminService) { }
  adminForm: FormGroup;
  ngOnInit() {
    this.adminForm = this.fb.group({
      'doctorName': [null],
      'doctorMobile': [null],
      'doctorKey': [null],
      'doctorDepartment': [null],
      'doctorChamber': [null],
      'doctorDivision': [null],
      'doctorDetails1': [null],
      'doctorDetails2': [null],
      'doctorDetails3': [null],
      'doctorEmail':[null]
  });

  }

  saveFN(formValue:any){
    console.log(formValue);
    var drName:any=formValue.doctorName?formValue.doctorName:null;
    var drMobile:any=formValue.doctorMobile?formValue.doctorMobile:null;
    var drKey:any=formValue.doctorKey?formValue.doctorKey:null;
    var drChamber:any=formValue.doctorChamber?formValue.doctorChamber:"";
    var drDepartment:any=formValue.doctorDepartment?formValue.doctorDepartment:"";
    var drDetails1:any=formValue.doctorDetails1?formValue.doctorDetails1:"";
    var drDetails2:any=formValue.doctorDetails2?formValue.doctorDetails2:"";
    var drDetails3:any=formValue.doctorDetails3?formValue.doctorDetails3:"";
    var drDivision:any=formValue.doctorDivision?formValue.doctorDivision:"";
    var drEmail:any=formValue.doctorEmail?formValue.doctorEmail:"";
    if(drName && drMobile &&  drKey){
     this.myservice.addDoctorAndInsertHisPAtientTable
     (drName,drKey,drMobile,drDepartment,
      drChamber,drDivision,drEmail,drDetails1,
      drDetails2,drDetails3
      ).subscribe(res=>{
        console.log(res);
      });
    }
    else this._appService.showRedAlertMessage("Enter DR name,mobile and KEY");
   
}

}
