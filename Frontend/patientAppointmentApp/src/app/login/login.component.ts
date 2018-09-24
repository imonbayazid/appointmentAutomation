import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder,private router: Router,private _appService:AppService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'username': [null],
      'password': [null]
  });
  }

  loginFN(formValue:any){
      var username=formValue.username?formValue.username.trim():'';
      var password=formValue.password?formValue.password:'';
      // for debug purpose

      if(username && password){
        var url=this._appService.baseURL+'LoginCheck/json?userName='+username+'&password='+password;
        this._appService.getData(url).subscribe(res=>{
          var response=res['ReturnValue'];
          if(response===1)   {
            this._appService.isUserLoggedIn=true;
            var drData=res['ResultSets'][0][0];
            console.log(drData);
            if(drData){
              this._appService.drID=drData.DrID;
              this._appService.drNumber=drData.DrNumber;
              this.router.navigate(['/appointmentList']);
            }
          } 
          else  this._appService.showRedAlertMessage('UserName and Password dont match');
        });
      } 
  }

}
