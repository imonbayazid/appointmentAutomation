import { Component, OnInit } from '@angular/core';
import {Http, Response} from '@angular/http';
import { AppoinmentListService } from './appoinment-list.service';
import { HubConnection } from '@aspnet/signalr-client';
import { AppService } from '../app.service';
import { forkJoin } from "rxjs/observable/forkJoin";
declare var $;
@Component({
  selector: 'app-appoinment-list',
  templateUrl: './appoinment-list.component.html',
  styleUrls: ['./appoinment-list.component.css'],
  providers:[AppoinmentListService]
})
export class AppoinmentListComponent implements OnInit {
  patientData:any;
  reportData:any;
  drDetails:any;
  selectedReportTableRow:any;
  selectedPatientTableRow:any;
  appoinmentInfo:any;
  private _hubConnection: HubConnection;

  constructor(private http:Http,private service:AppoinmentListService,private _appService:AppService) { }

  ngOnInit() {
    this._hubConnection = new HubConnection(this._appService.singnalRURL);
    this._hubConnection
    .start()
    .then(() => console.log('Connection started! appoinment list'))
    .catch(err => console.log('Error while establishing connection :('));
    // singnalR receiver
    this._hubConnection.on('rcvrFnSendPatientToDoctor', (patientID: string) => {
      console.log('receiverFnSendPatientToDoctor from appoinment list '+patientID);
      this.loadRunningAppoinmentData();
    });

    this._hubConnection.on('rcvrFnWhenPatientAdded', (res: string) => {
      console.log('rcvrFnWhenPatientAdded from appoinment list ');
      this.loadPatientData();
    });

    this._hubConnection.on('rcvrFnWhenReportAdded', (res: string) => {
      console.log('rcvrFnWhenReportAdded from appoinment list ');
      this.loadReportData();
    });

    this.loadDataDrDetails();
    this.loadPatientnReportData();
  }

  loadRunningAppoinmentData(){
    this.service.getRunningAppoinmentData().subscribe(res=>{
      var data=res['ResultSets'][0][0];
      if(data){
        this.service.runningPatientSerial=data.RunningPatientSL;
        this.service.runningReportSerial=data.RunningReportSL;
        this.service.completedPatient=data.CompletedPatient;
        this.service.completedReport=data.CompletedReport;
        this.service.totalPatient=data.TotalPatient;
        this.service.totalReport=data.TotalReport;
        this.patientTableRowClick(data.RunningPatientSL); 
        this.reportTableRowClick(data.RunningReportSL); 
      }
     });
  }

  loadPatientnReportData(){
    let patientDT =  this.service.getPatientData()
    let reportDT =  this.service.getReportData()

    forkJoin([patientDT, reportDT]).subscribe(results => {
      this.patientData=(results[0])['ResultSets'][0];
      this.reportData=(results[1])['ResultSets'][0];
      this.loadRunningAppoinmentData();
    });
  }

  loadPatientData(){
    this.service.getPatientData().
    subscribe(res=>
      {
        this.patientData=res['ResultSets'][0];
      });
  }

  loadReportData(){

      this.service.getReportData().
      subscribe(res=>
        {
          this.reportData=res['ResultSets'][0];
        });
  }

  loadDataDrDetails(){
        this.service.getDrDetails().
        subscribe(res=>
          {
            this.drDetails=res['ResultSets'][0][0];
          });
  }

  reportTableRowClick(index){
      var i=index-1;
      console.log('report row click index'+i);
      this.selectedReportTableRow = i;
      var elem = document.getElementById("report"+i);  
      elem.scrollIntoView(true); 
  }

  patientTableRowClick(index){
    var i=index-1;
    console.log('patient row click index'+i);
    this.selectedPatientTableRow = i;
    var elem = document.getElementById("patient"+i);  
    elem.scrollIntoView(true); 
  }

}
