import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
declare var alertify :any;
@Injectable()
export class AppService {

  constructor(private http:Http) { }


   showConfirmDialog(title:any,msg:any):Promise<boolean> {
    return new Promise((re, ri) => {
      alertify.confirm(title, msg,
        function(){
            re(true);
         }
         , function(){ 
          re(false);
         });
  });

  }


   showConfirmDialogWithInputField(title:any,msg:any,value:any)
   {
    return new Promise((re, ri) => {
      alertify.prompt( title, msg, value
      , function(evt, value) { 
        if(value) re(value);
        else re(false);
       }
      , function() { 
        re(false);
       });
    });

   }

   showRedAlertMessage(msg:any){
        alertify.error(msg);
   }
   showSuccessMessage(msg:any){
    alertify.success(msg);
}


   getData(url:any){
    return this.http.get(url).map((res:Response) => res.json()); 
 }

 TTS( msg:any){
    var tts = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    tts.voice = voices[1]; // Note: some voices don't support altering params
    // msg.voiceURI = 'native';
    tts.volume = 1; // 0 to 1
    tts.rate = 1; // 0.1 to 10
    tts.pitch = 2; //0 to 2
    tts.text = msg;
    tts.lang = 'en-US';
    speechSynthesis.speak(tts);
 }

   isUserLoggedIn:any=true;

  drID:any=4;
  drKey:any;
  drNumber:any='46544';
  baseURL:any='http://localhost:53674/';
  singnalRURL='http://localhost:5000/chat';
  apiURL:any='http://localhost:53674/'
}
