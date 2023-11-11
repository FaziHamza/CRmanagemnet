import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from 'src/app/models/AppResponse';
import { toFilteringUrl } from 'src/app/utility/util';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  message!: string;
  header: any;
  token!: string;
  headers!: HttpHeaders;
  profilePic: string = '';

  constructor(private http: HttpClient) { }

  getUser() {
    return JSON.parse(localStorage.getItem('userDetail'));
  }

  saveCmsSetupv1(obj: any): Observable<AppResponse> {
    let url = environment.apiUrl + 'Setup/UpdateSetup';
    return this.http.post<AppResponse>(url, obj);
  }

  saveCmsSetup(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + 'Setup/UpdateSetup';
    return this.http.post<AppResponse>(url, formData, {});
  }
  generatePNRescheduleOrderRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/GeneratePNRescheduleOrderRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  generatePNPartialRescheduleOrderRequest(formData: any): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/GeneratePNPartialRescheduleOrderRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  generatePNTransferOrderRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/GeneratePNTransferOrderRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  rejectRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/RejectRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  approveRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/ApproveRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  performReschedulePNOrders(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/PerformReschedulePNOrders";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  performTransferPNOrder(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/PerformTransferPNOrder";
    return this.http.post<AppResponse>(url, formData, {
    });
  }

  getCMSSetup(): Observable<AppResponse> {
    let url = environment.apiUrl + 'Setup/GetCMSetup';
    return this.http.get<AppResponse>(url);
  }

  GetUserDetails(id: number) {
    let url = environment.apiUrl2 + `User/GetUSERDetails?userId=${id}`;
    return this.http.get<AppResponse>(url);
  }
  //FOLLOW UP START 
  getPNsForFollowUp(params): Observable<AppResponse> {
    let url = environment.apiUrl + `FollowUp/GetPNsForFollowUp${params}`;
    return this.http.get<AppResponse>(url);
  }
  getPNsForFollowUpDetails(noteId): Observable<AppResponse> {
    let url = environment.apiUrl + `FollowUp/GetPNsForFollowUpDetails?pnNoteId=${noteId}`;
    return this.http.get<AppResponse>(url);
  }
  addFollowUp(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "FollowUp/AddFollowUp";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  //FOLLOW UP END
  getEarlysettlementRequestDetails(id): Observable<AppResponse> {
    let url = environment.apiUrl + `EarlySettlement/GetEarlysettlementRequestDetails?requestId=${id}`;
    return this.http.get<AppResponse>(url);
  }
  approveEarlysettlementRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "EarlySettlement/ApproveEarlysettlementRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  addMarkaziaCustomer(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "Customer/AddMarkaziaCustomer";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  updateCustomer(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "Customer/UpdateCustomer";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  rejectEarlysettlementRequest(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + "EarlySettlement/RejectEarlysettlementRequest";
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  getPNOrderBookNotesList(params): Observable<AppResponse> {
    let url =
      environment.apiUrl +
      `PNOrders/GetPNOrderBookNotes${params}`
    return this.http.get<AppResponse>(url);
  }
  returnOrderPNs(data) {
    let url = environment.apiUrl + `PNOrders/ReturnOrderPNs`;
    return this.http.post<AppResponse>(url, data);
  }
  //REPORTS
  getReportTemplate(): Observable<AppResponse> {
    let url = environment.apiUrl + `ReportsTemplate/GetReportTemplate?PageNo=0&PageSize=1000`;
    return this.http.get<AppResponse>(url);
  }
  generateReport(formData: FormData): Observable<AppResponse> {
    let url = environment.apiUrl + `ReportsTemplate/GenerateReport`;
    return this.http.post<AppResponse>(url, formData, {
    });
  }
  //END REPORTS
  EditUser(body: any) {
    let url = environment.apiUrl2 + `User/EditUser`;
    return this.http.post<AppResponse>(url, body);
  }

  getStatusLookup(id: number): Observable<AppResponse> {
    let url =
      environment.apiUrl +
      'Lookups/GetLookups?lookupTypeId=' +
      id + '&PageNo=0&PageSize=1000';
    return this.http.get<AppResponse>(url);
  }

  getPNOrders(id: number): Observable<AppResponse> {
    let url =
      environment.apiUrl +
      'PNOrders/GetPNOrderDetails?orderId=' +
      id;
    return this.http.get<AppResponse>(url);
  }
  getRescheduleRequestDetails(id: number): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/GetRescheduleRequestDetails?requestId=" + id;
    return this.http.get<AppResponse>(url);
  }
  getTransfereRequestDetails(id: number): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/GetTransfereRequestDetails?requestId=" + id;
    return this.http.get<AppResponse>(url);
  }
  getSparePartsWorkOrder(param: string = null): Observable<AppResponse> {
    let url =
      environment.apiUrl + 'PNOrders/GetPNOrders?' + param;
    return this.http.get<AppResponse>(url);
  }
  getDashboardCollections(param: string = null): Observable<AppResponse> {
    let url =
      environment.apiUrl + 'Dashboard/GetPNsCollections?' + param;
    return this.http.get<AppResponse>(url);
  }
  checkGuarantor(param: string = null): Observable<AppResponse> {
    let url =
      environment.apiUrl + 'PNOrdersRequests/CheckGuarantor?' + param;
    return this.http.get<AppResponse>(url);
  }
  getrequestWorkOrder(param: string = null): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/GetPNOrdersRequests?" + param;
    return this.http.get<AppResponse>(url);
  }
  getPNOrderBooks(params): Observable<AppResponse> {
    let url = environment.apiUrl + `PNOrders/GetPNOrderBooks${params}`;
    return this.http.get<AppResponse>(url);
  }
  getPNOrderAllNotes(params): Observable<AppResponse> {
    let url = environment.apiUrl + `PNOrders/GetPNOrderAllNotes${params}`;
    return this.http.get<AppResponse>(url);
  }
  createEarlySettlement(params): Observable<AppResponse> {
    let url = environment.apiUrl + 'EarlySettlement/CreateEarlySettlement';
    return this.http.post<AppResponse>(url, params);
  }
  getPNOrderBookNotes(id, Sort: number): Observable<AppResponse> {
    let url =
      environment.apiUrl +
      'PNOrders/GetPNOrderBookNotes?orderId=' + id + "&Sort=" + Sort;
    return this.http.get<AppResponse>(url);
  }
  getPermissions(id): Observable<AppResponse> {
    let url =
      environment.apiUrl +
      'Permissions/GetPermissions?portalId=' +
      id;
    return this.http.get<AppResponse>(url);
  }

  saveGeneratingNotes(formData: any): Observable<AppResponse> {
    let url =
      environment.apiUrl + 'PNOrders/GeneratePromissoryNotes';
    return this.http.post<AppResponse>(url, formData, {});
  }

  updatePNBookStatus(formData: any): Observable<AppResponse> {
    let url = environment.apiUrl + 'PNOrders/UpdatePNBookStatus';
    return this.http.post<AppResponse>(url, formData, {});
  }
  getDashboardCards(): Observable<AppResponse> {
    let url = environment.apiUrl + 'Dashboard/GetDashboardCards';
    return this.http.get<AppResponse>(url);
  }

  getPromissoryNotesAgingReport(filter: any): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      toFilteringUrl(
        `${environment.apiUrl}Dashboard/GetPromissoryNotesAgingReport`,
        filter
      )
    );
  }

  getPromissoryNotesOrders(filter: any): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      toFilteringUrl(
        `${environment.apiUrl}Dashboard/PromissoryNotesOrders`,
        filter
      )
    );
  }
  getPromissoryNotesPerCarModel(filter: any): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      toFilteringUrl(
        `${environment.apiUrl}Dashboard/GetPromissoryNotesPerCarModel`,
        filter
      )
    );
  }
  getPromissoryNotesPerAddress(pns: any): Observable<AppResponse> {
    return this.http.get<AppResponse>(`${environment.apiUrl}Dashboard/GetPromissoryNotesPerAddress?PNsRequired=${pns}`);
  }
  getPromissoryNotesPayment(filter: any): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      toFilteringUrl(
        `${environment.apiUrl}Dashboard/GetPromissoryNotesPayment`,
        filter
      )
    );
  }

  getPromissoryNotesPerYear(filter: any): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      toFilteringUrl(
        `${environment.apiUrl}Dashboard/PromissoryNotesPerYear`,
        filter
      )
    );
  }
  getPNOrderRemainingAmountforRescheduling(OrderId: number, InterestRate: number, InterestValue: number): Observable<AppResponse> {
    let url = environment.apiUrl + "PNOrdersRequests/GetPNOrderRemainingAmountforRescheduling?OrderId=" + OrderId + "&InterestRate=" + InterestRate + "&InterestValue=" + InterestValue;
    return this.http.get<AppResponse>(url);
  }
  getCustomer(name: string): Observable<AppResponse> {
    let obj = "&PageNo=0&PageSize=10000"
    let url = environment.apiUrl + "Customer/GetCustomers?Search=" + name + obj;
    return this.http.get<AppResponse>(url);
  }
  getCustomerList(): Observable<AppResponse> {
    let obj = "?PageNo=0&PageSize=10000"
    let url = environment.apiUrl + "Customer/GetCustomers" + obj;
    return this.http.get<AppResponse>(url);
  }
  getBrandList(): Observable<any> {
    let url = environment.apiUrl + "VINS/GetBrands";
    return this.http.get<any>(url);
  }
  getModelList(brandId): Observable<any> {
    let url = environment.apiUrl + "VINS/GetModels?BrandId=" + brandId;
    return this.http.get<any>(url);
  }
  downloadFile(file) {
    return this.http.get(file, { responseType: 'blob' })
  }
}
