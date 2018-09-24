import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
//import * as _ from "lodash";
//declare var alertify :any;
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { AdminPanelService } from './admin-panel.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers:[AdminPanelService]
})
export class AdminPanelComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private fb: FormBuilder,private http: Http,private service:AdminPanelService) {}
  adminForm: FormGroup;
  ngOnInit() {
    this.adminForm = this.fb.group({
        'doctorMobile': [null],
        'newPatientPayment': [null],
        'oldPatientPayment': [null],
        'reportPayment': [null]
    });
    this.loadData();
  }
  drAdminInfo:any;
  loadData(){
    this.service.getData().subscribe(res=>{
      console.log("");
      this.drAdminInfo=res['ResultSets'][0][0];
     });
  }
  saveFN(formValue:any){
      console.log(formValue);
      // need to optimize
      if(formValue) this.service.updateData(formValue).subscribe(res=>{
        console.log(res);
       });
  }


}
