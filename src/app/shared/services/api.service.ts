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
  profilePic: string = '';

  constructor(
    private http: HttpClient,
  ) { }
  getUser() {
    return JSON.parse(localStorage.getItem('userDetail'))
  }
  saveCmsSetupv1(obj: any): Observable<AppResponse> {
    let url = environment.creditmanagement + "Setup/UpdateSetup";
    return this.http.post<AppResponse>(url, obj);
  }
  saveCmsSetup(formData: FormData): Observable<AppResponse> {
    let url = environment.creditmanagement + "Setup/UpdateSetup";
    return this.http.post<AppResponse>(url, formData, {
    });
  }

  getCMSSetup(): Observable<AppResponse> {
    let url = environment.creditmanagement + "Setup/GetCMSetup";
    return this.http.get<AppResponse>(url);
  }

  GetUserDetails(id: number) {
    let url = environment.administration + `User/GetUSERDetails?userId=${id}`;
    return this.http.get<AppResponse>(url);
  }
  EditUser(body: any) {
    let url = environment.administration + `User/EditUser`;
    return this.http.post<AppResponse>(url, body);
  }
  getStatusLookup(id: number): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "Lookups/GetLookups?lookupTypeId=" + id;
    return this.http.get<AppResponse>(url);
  }
  getPNOrders(id: number): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrders/GetPNOrderDetails?orderId=" + id;
    return this.http.get<AppResponse>(url);
  }
  getSparePartsWorkOrder(param: string = null): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrders/GetPNOrders?" + param;
    return this.http.get<AppResponse>(url);
  }
  getPNOrderBookNotes(id): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrders/GetPNOrderBookNotes?orderId=" + id;
    return this.http.get<AppResponse>(url);
  }
  saveGeneratingNotes(formData: any): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrders/GeneratePromissoryNotes";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  updatePNBookStatus(formData: any): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrders/UpdatePNBookStatus";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
}
