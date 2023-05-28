import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from 'src/app/models/AppResponse';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  message!: string;
  header: any;
  token!: string;
  headers!: HttpHeaders;
  profilePic :string = '';

  constructor(
    private http: HttpClient,
  ) { }
  getUser(){
    return JSON.parse(localStorage.getItem('userDetail'))
  }
  saveCmsSetup(obj:any) :Observable<AppResponse> {
    let url = environment.creditmanagement + "Setup/UpdateSetup";
    return this.http.post<AppResponse>(url,obj);
  }
  getCMSSetup():Observable<AppResponse> {
    let url = environment.creditmanagement + "Setup/GetCMSetup";
    return this.http.get<AppResponse>(url);
  }
  

  
}
