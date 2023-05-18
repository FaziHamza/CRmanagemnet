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
  get Authorised_HttpOptions() {
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3NiIsInVuaXF1ZV9uYW1lIjoiQ3JlZGl0IE1hbmFnZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6Ijc3NTg1NTA0NCIsIm5iZiI6MTY4Mzg3MDg5NCwiZXhwIjoxNjg2NTQ5Mjk0LCJpYXQiOjE2ODM4NzA4OTR9.iFh6Agey3Dg8mv4dg_Bb6BL-gfFn3p68RLHHKV5-rUo";
    const httpOptions = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return { headers: httpOptions };
  }

  saveCmsSetup(obj:any) :Observable<AppResponse> {
    let url = environment.intermediate + "Setup/UpdateSetup";
    return this.http.post<AppResponse>(url,obj,this.Authorised_HttpOptions);
  }
  getCMSSetup():Observable<AppResponse> {
    let url = environment.intermediate + "Setup/GetCMSetup";
    return this.http.get<AppResponse>(url,this.Authorised_HttpOptions);
  }
  getParts(partno:any):Observable<AppResponse> {
    let url = environment.intermediate + "Parts/GetParts?part="+partno;
    return this.http.get<AppResponse>(url,this.Authorised_HttpOptions);
  }
  getCustomer(name:string):Observable<AppResponse> {
    let url = environment.intermediate + "Customer/GetCustomers?Search="+name;
    return this.http.get<AppResponse>(url,this.Authorised_HttpOptions);
  }
  createWorkOrder(obj:any) :Observable<AppResponse> {
    let url = environment.intermediate + "SalesOrders/CreateWorkOrder";
    return this.http.post<AppResponse>(url,obj,this.Authorised_HttpOptions);
  }
  getAllOrders():Observable<AppResponse> {
    let url = environment.intermediate + "Setup/GetCMSetup";
    return this.http.get<AppResponse>(url,this.Authorised_HttpOptions);
  }
}
