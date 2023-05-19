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
    let url = environment.intermediate + "Setup/UpdateSetup";
    return this.http.post<AppResponse>(url,obj);
  }
  getCMSSetup():Observable<AppResponse> {
    let url = environment.intermediate + "Setup/GetCMSetup";
    return this.http.get<AppResponse>(url);
  }
  getParts(partno:any):Observable<AppResponse> {
    partno = partno + "&BranchId=" +this.getUser().branch.branchId
    let url = environment.intermediate + "Parts/GetParts?part="+partno;
    return this.http.get<AppResponse>(url);
  }
  getCustomer(name:string):Observable<AppResponse> {
    let obj = "&PageNo=0&PageSize=10000"
    let url = environment.intermediate + "Customer/GetCustomers?Search=" + name + obj;
    return this.http.get<AppResponse>(url);
  }
  createWorkOrder(obj:any) :Observable<AppResponse> {
    let url = environment.intermediate + "SalesOrders/CreateWorkOrder";
    return this.http.post<AppResponse>(url,obj);
  }

  getStatusLookup(id:number):Observable<AppResponse> {
    let url = environment.intermediate + "Lookups/GetLookups?lookupTypeId="+id;
    return this.http.get<AppResponse>(url);
  }

  getSparePartsWorkOrder(param:string=null):Observable<AppResponse> {
    let url = environment.intermediate + "SalesOrders/GetSparePartsWorkOrders?"+param;
    return this.http.get<AppResponse>(url);
  }

}
