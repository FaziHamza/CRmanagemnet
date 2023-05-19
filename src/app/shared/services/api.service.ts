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
  get Authorised_HttpOptions() {
    const authToken = JSON.parse(localStorage.getItem('userDetail'));
    const httpOptions = new HttpHeaders({
      Authorization: `Bearer ${authToken?.token}`
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
    partno = partno + "&BranchId=" +this.getUser().branch.branchId
    let url = environment.intermediate + "Parts/GetParts?part="+partno;
    return this.http.get<AppResponse>(url,this.Authorised_HttpOptions);
  }
  getCustomer(name:string):Observable<AppResponse> {
    let obj = "&PageNo=0&PageSize=10000"
    let url = environment.intermediate + "Customer/GetCustomers?Search=" + name + obj;
    return this.http.get<AppResponse>(url,this.Authorised_HttpOptions);
  }
  createWorkOrder(obj:any) :Observable<AppResponse> {
    let url = environment.intermediate + "SalesOrders/CreateWorkOrder";
    return this.http.post<AppResponse>(url,obj,this.Authorised_HttpOptions);
  }

  getStatusLookup(id:number):Observable<AppResponse> {
    let url = environment.intermediate + "Lookups/GetLookups?lookupTypeId="+id;
    return this.http.get<AppResponse>(url,this.Authorised_HttpOptions);
  }

  getSparePartsWorkOrder(param:string=null):Observable<AppResponse> {
    let url = environment.intermediate + "SalesOrders/GetSparePartsWorkOrders?"+param;
    return this.http.get<AppResponse>(url,this.Authorised_HttpOptions);
  }

}
