import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/utility/services/common.service';

@Injectable()
export class EnvService {
  // The values that are defined here are the default values that can
  // be overridden by env.js

  // Dev URL
  public Url = 'https://creditmanagementtest.azurewebsites.net/POSAPI/api/';
  public GeneralToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3NiIsInVuaXF1ZV9uYW1lIjoiQ3JlZGl0IE1hbmFnZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6Ijc3NTg1NTA0NCIsIm5iZiI6MTY4Mzg3MDg5NCwiZXhwIjoxNjg2NTQ5Mjk0LCJpYXQiOjE2ODM4NzA4OTR9.iFh6Agey3Dg8mv4dg_Bb6BL-gfFn3p68RLHHKV5-rUo';
  

  public loginMode = '';

  // Whether or not to enable debug mode
  public enableDebug = true;

  //for version of the application
  public versionId = 1.0;

  //for ag-grid Enterprise Key
  public agGridKey = '';

  constructor(private commonService:CommonService ) {
  }
  showWarning(){
    this.commonService.showWarning("You are not <b> Sign in</b>  ","Please Sign in");
  }
  
}
