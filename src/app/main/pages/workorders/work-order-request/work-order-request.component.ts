import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { requestParam } from '../requestParam';
import { Router } from '@angular/router';
import { ErrorsComponent } from '../../common/errors/errors.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RejectComponent } from '../../common/reject/reject.component';
import { ConfirmPopupComponent } from '../../common/confirm-popup/confirm-popup.component';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullEarlySettlementRequestDetailsComponent } from './components/full-early-settlement-request-details/full-early-settlement-request-details.component';

@Component({
  selector: 'app-work-order-request',
  templateUrl: './work-order-request.component.html',
  styleUrls: ['./work-order-request.component.scss']
})

export class WorkOrderRequestComponent implements OnInit {

  searchByCustomerName$ = new Subject<any>();
  searchPartNo$ = new Subject<any>();
  tableLoader: any = false;
  requestList: any[] = [];
  pageSize = 6;
  pageIndex: number = 1;
  displayData: any[] = [];
  statusList: any[] = [];
  errorsList: any[] = [];
  start = 1;
  end = 6;
  orderParamObj: requestParam = {
    RequestTypeID: 0, PNOrderID: 0, NewCustomerID: 0, CustomerName: '', Status: 0,
    OrderStatus: 0, FromDate: '', ToDate: '', Sort: 1, PageNo: 0, PageSize: 1000
  }
  searchByCustomer: string = '';
  searchByRequestNo: number;
  statusType: any = "";
  selectedDate: any;
  saveLoader: boolean = false;
  selectedRequestValue: any = -1;
  selectedIndex: any = -1; // manage the active tab
  radioSelected: any[] = [];

  tabs: any[] = [];
  constructor(private apiService: ApiService, private commonService: CommonService, private router: Router, private _modalService: NgbModal,
    private modal: NzModalService, private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Promissory Notes Order', routeLink: '' },
    ];
    this.getStatusLookup();
    this.radioSelected.fill(false);
    this.radioSelected[0] = true;
    this.getAllRequestList();
    this.getTabs();
    this.searchByCustomerName$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {

        this.orderParamObj.CustomerName = value;
        this.getAllRequestList();
      });
    this.searchPartNo$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {
        if (value > 0) {
          this.orderParamObj.PNOrderID = value;
          this.getAllRequestList();
        } else {
          // this.orderParamObj.OrderNumber = '';
          this.getAllRequestList();
        }

      });
  }
  earlySettlementAction(data, action) {
    const modalRef = this._modalService.open(FullEarlySettlementRequestDetailsComponent, { size: 'xl', centered: true });
    modalRef.componentInstance.data = { requestId: data.requestID, requestTypeId: data?.requestTypeID, action};
    modalRef.componentInstance.sendData.subscribe(x => {
      if (x) {
        this.getAllRequestList();
      }
    })
  }

  requestTabChange(index: any) {

    this.radioSelected.fill(false);
    this.radioSelected[index] = true;
    // other logic
    if (index) {
      this.orderParamObj.RequestTypeID = index;
      this.getAllRequestList();
    } else if (index == 0) {
      this.orderParamObj.RequestTypeID = index;
      this.getAllRequestList();
    }

  }


  mySort() {

  }
  selectTab(tabId: number): void {

    this.selectedRequestValue = tabId;
  }
  getAllRequestList() {

    const queryString = Object.entries(this.orderParamObj)
      .filter(([key, value]) => value !== 0)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    this.saveLoader = true;
    this.apiService.getrequestWorkOrder(queryString).subscribe(res => {
      this.saveLoader = false;
      if (this.searchByRequestNo == 0)
        this.searchByRequestNo = null;
      if (res) {
        this.requestList = res.data;
        this.displayData = this.requestList.length > 6 ? this.requestList.slice(0, 6) : this.requestList;
        this.end = this.displayData.length > 6 ? 6 : this.displayData.length;
      } else {
        this.requestList = [];
      }
    })
  }

  clearInput() {
    this.searchByCustomer = '';
    this.orderParamObj.CustomerName = this.searchByCustomer;

    this.getAllRequestList();
  }
  clearPart() {
    this.searchByRequestNo = 0;
    this.orderParamObj.PNOrderID = this.searchByRequestNo;
    this.getAllRequestList();
  }
  clearStatus() {
    this.statusType = "";
    this.orderParamObj.Status = 0;
    this.getAllRequestList();
  }
  customerChange() {

    if (this.searchByCustomer.length >= 0) {
      this.searchByCustomerName$.next(this.searchByCustomer);
    }
  }
  searchPart() {

    if (this.searchByRequestNo > 0) {
      this.searchPartNo$.next(this.searchByRequestNo);
    }
  }
  sortType = null;
  sortCounters = {
    'orderno': 0,
    'customer': 0,
    'date': 0,
    'status': 0
  };
  lastSortedColumn = null;

  getSortFunction(sortType: string, columnName: string,) {
    if (this.requestList.length > 0) {

      if (this.lastSortedColumn && this.lastSortedColumn !== columnName) {
        // reset the sort counter for other columns
        for (let key in this.sortCounters) {
          if (key !== columnName) {
            this.sortCounters[key] = 0;
          }
        }
      }

      this.sortCounters[columnName]++;

      switch (this.sortCounters[columnName] % 3) {
        case 0: // no sort
          this.sortType = null;
          this.orderParamObj.Sort = 1;
          break;
        case 1: // ascending
          this.sortType = "ascend";
          this.orderParamObj.Sort = columnName === 'orderno' ? 2 :
            columnName === 'customer' ? 4 :
              columnName === 'date' ? 6 :
                8; // assuming 'status' for the default case
          break;
        case 2: // descending
          this.sortType = "descend";
          this.orderParamObj.Sort = columnName === 'orderno' ? 3 :
            columnName === 'customer' ? 5 :
              columnName === 'date' ? 7 :
                9; // assuming 'status' for the default case
          break;
      }

      this.lastSortedColumn = columnName;
      this.getAllRequestList();
    }
  }

  simpleSort = (a, b) => a - b; // simple sort function
  statusChange() {
    this.orderParamObj.Status = this.statusType;
    this.getAllRequestList();
  }
  clearDate() {
    this.selectedDate = '';
  }
  changeDateOld(date: any) {

    if (this.selectedDate) {
      const fromDate = new Date(this.selectedDate);
      const formattedFromDate = fromDate.toISOString();

      this.orderParamObj.FromDate = formattedFromDate
    } else {
      this.orderParamObj.FromDate = ''
    }
    this.getAllRequestList();
  }
  changeDate(date: any) {
    if (this.selectedDate.length > 0) {
      const fromDate = new Date(this.selectedDate[0].toString());
      const toDate = new Date(this.selectedDate[1]);

      const formattedFromDate = fromDate.toISOString();
      const formattedToDate = toDate.toISOString();

      this.orderParamObj.FromDate = formattedFromDate
      this.orderParamObj.ToDate = formattedToDate
    } else {
      this.orderParamObj.FromDate = ''
      this.orderParamObj.ToDate = ''
    }
    this.getAllRequestList();
  }
  getStatusLookup() {

    this.apiService.getStatusLookup(21).subscribe(res => {
      if (res.isSuccess) {
        this.statusList = res.data.slice(6, 15);
      } else {
        this.statusList = [];
      }
    })
  }

  getTabs(): any {
    this.apiService.getStatusLookup(24).subscribe(res => {
      if (res.isSuccess) {
        let obj = { id: 0, description: 'All Requests' };
        this.tabs = res.data;
        // this.tabs.push(obj);
        this.tabs.unshift(obj);
      } else {
        this.tabs = [];
      }
    })
  }
  resetParam() {
    this.selectedRequestValue = -1;
    this.selectedIndex = -1; // manage the active tab
    this.radioSelected = [];
    this.radioSelected.fill(false);
    this.radioSelected[0] = true;
    this.orderParamObj = {
      RequestTypeID: 0, PNOrderID: 0, NewCustomerID: 0, CustomerName: '', Status: 0,
      OrderStatus: 0, FromDate: '', ToDate: '', Sort: 1, PageNo: 0, PageSize: 1000
    }
    this.searchByCustomer = '';
    this.searchByRequestNo = null;
    this.selectedDate = [];
    this.statusType = '';
    this.getAllRequestList();
  }
  gotoDetail(data: any) {
    if (!this.canPerformAction(7, 40, 81) || !this.canPerformAction(7, 40, 82)) {
      if (data.requestTypeID == 24001) {
        this.router.navigate(['/home/transfer', data.requestID])
      }
      else if (data.requestTypeID == 24003 || data?.requestTypeID == 24004) {
        const modalRef = this._modalService.open(FullEarlySettlementRequestDetailsComponent, { size: 'xl', centered: true });
        modalRef.componentInstance.sendData.subscribe(x => {
          if (x) {
            this.getAllRequestList();
          }
        })
        modalRef.componentInstance.data = { requestId: data.requestID, requestTypeId: data?.requestTypeID, actionTaken: data?.actionTaken,action: 'view'}
      }
      else {
        this.router.navigate(['/home/reschedule', data.requestID])
      }
      // if((data.status == 21009 || data.status == 21010) && data.actionTaken){

      // }else{
      //   if(data.requestTypeID  == 24001){
      //     this.router.navigate(['/home/transfer',data.requestID])
      //   }else{
      //     this.router.navigate(['/home/reschedule',data.requestID])
      //   }
      // }
    }

  }
  approveRequest(id: any) {
    let formData = new FormData();
    formData.append('requestId', id);
    this.saveLoader = true;
    this.apiService.approveRequest(formData).subscribe(
      (response) => {
        this.saveLoader = false;
        if (response.isSuccess) {
          this.commonService.showSuccess("Data updated successfully..!", "Success");
          this.ngOnInit();
          // this.router.navigate(['/home/workorders'])
        }
        else {
          this.errorsList = response["errors"] ? response["errors"] : response["Errors"];
          this.error(this.errorsList)
          this.commonService.showError("found some error..!", "Error");
        }
      },
      (error) => {
        this.saveLoader = false;
        this.errorsList = error.errors ? error.errors : error.Errors;
        this.error(this.errorsList)
        this.commonService.showError("found some error..!", "Error");
      }
    )
  }
  error(errorsList: any) {
    const modal = this.modal.create<ErrorsComponent>({
      nzWidth: 600,
      nzContent: ErrorsComponent,
      nzComponentParams: {
        errorsList: errorsList,
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        // this.controls(value, data, obj, res);
      }
    });
  }
  rejected(requestId: any) {
    const modal = this.modal.create<RejectComponent>({
      nzWidth: 600,
      nzContent: RejectComponent,
      nzComponentParams: {
        requestId: requestId,
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      this.ngOnInit();
    });
  }
  reschedule(id: any) {
    let formData = new FormData();
    formData.append('requestId', id);
    this.saveLoader = true;
    this.apiService.performReschedulePNOrders(formData).subscribe(
      (response) => {
        this.saveLoader = false;
        if (response.isSuccess) {
          this.commonService.showSuccess("Data updated successfully..!", "Success");
          this.confirm("Reschedule Order Successfully Created");
          // this.router.navigate(['/home/workorders'])
        }
        else {
          this.errorsList = response["errors"] ? response["errors"] : response["Errors"];
          this.error(this.errorsList)
          this.commonService.showError("found some error..!", "Error");
        }
      },
      (error) => {
        this.saveLoader = false;
        this.errorsList = error.errors ? error.errors : error.Errors;
        this.error(this.errorsList)
        this.commonService.showError("found some error..!", "Error");
      }
    )
  }
  transfer(id: any) {
    let formData = new FormData();
    formData.append('requestId', id);
    this.saveLoader = true;
    this.apiService.performTransferPNOrder(formData).subscribe(
      (response) => {
        this.saveLoader = false;
        if (response.isSuccess) {
          this.commonService.showSuccess("Data updated successfully..!", "Success");
          this.confirm("Order Successfully Transferred");
          // this.router.navigate(['/home/workorders'])
        }
        else {
          this.errorsList = response["errors"] ? response["errors"] : response["Errors"];
          this.error(this.errorsList)
          this.commonService.showError("found some error..!", "Error");
        }
      },
      (error) => {
        this.saveLoader = false;
        this.errorsList = error.errors ? error.errors : error.Errors;
        this.error(this.errorsList)
        this.commonService.showError("found some error..!", "Error");
      }
    )
  }
  confirm(message: string): void {
    const modal = this.modal.create<ConfirmPopupComponent>({
      nzWidth: 500,
      nzContent: ConfirmPopupComponent,
      nzFooter: null,
      nzComponentParams: {
        message: message,
      },
    });
    modal.afterClose.subscribe(res => {
      this.commonService.loadRequestTab = false;
      this.commonService.selectedWorkorder = 0;
    });
  }
  canPerformAction(catId: number, subCatId: number, perItemName: number) {
    return this.permissionService.checkPermission(catId, subCatId, perItemName);
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.updateDisplayData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.updateDisplayData();
  }

  updateDisplayData(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.start = start == 0 ? 1 : ((this.pageIndex * this.pageSize) - this.pageSize) + 1;
    this.displayData = this.requestList.slice(start, end);
    this.end = this.displayData.length != 6 ? this.requestList.length : this.pageIndex * this.pageSize;
  }
}
