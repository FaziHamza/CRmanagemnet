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
  generatePNRescheduleOrderRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.creditmanagement + "PNOrdersRequests/GeneratePNRescheduleOrderRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  generatePNTransferOrderRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.creditmanagement + "PNOrdersRequests/GeneratePNTransferOrderRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  rejectRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.creditmanagement + "PNOrdersRequests/RejectRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  approveRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.creditmanagement + "PNOrdersRequests/ApproveRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  performReschedulePNOrders(formData: FormData): Observable<AppResponse> {
    let url = environment.creditmanagement + "PNOrdersRequests/PerformReschedulePNOrders";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  performTransferPNOrder(formData: FormData): Observable<AppResponse> {
    let url = environment.creditmanagement + "PNOrdersRequests/PerformTransferPNOrder";
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
  getRescheduleRequestDetails(id: number): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrdersRequests/GetRescheduleRequestDetails?requestId=" + id;
    return this.http.get<AppResponse>(url);
  }
  getTransfereRequestDetails(id: number): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrdersRequests/GetTransfereRequestDetails?requestId=" + id;
    return this.http.get<AppResponse>(url);
  }
  getSparePartsWorkOrder(param: string = null): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrders/GetPNOrders?" + param;
    return this.http.get<AppResponse>(url);
  }
  getrequestWorkOrder(param: string = null): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrdersRequests/GetPNOrdersRequests?" + param;
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
  getPNOrderRemainingAmountforRescheduling(OrderId:number,InterestRate:number,InterestValue:number): Observable<AppResponse> {
    let url = environment.creditmanagementtest + "PNOrdersRequests/GetPNOrderRemainingAmountforRescheduling?OrderId="+OrderId+"&InterestRate="+InterestRate+"&InterestValue="+InterestValue;
    return this.http.get<AppResponse>(url);
  }
  getCustomer(name:string):Observable<AppResponse> {
    let obj = "&PageNo=0&PageSize=10000"
    let url = environment.creditmanagementtest + "Customer/GetCustomers?Search=" + name + obj;
    return this.http.get<AppResponse>(url);
  }
}
