import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app.service';

@Injectable()
export class LoginGuard implements CanActivate {
  /*canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
    } */
    constructor(private _appService:AppService) {}; 

    canActivate() {
      console.log("OnlyLoggedInUsers");
      if (this._appService.isUserLoggedIn) { 
        return true;
      } else {
        window.alert("You don't have permission to view this page"); 
        return false;
      }
    }
}
