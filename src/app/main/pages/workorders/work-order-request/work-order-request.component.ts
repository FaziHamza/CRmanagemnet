import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { requestParam } from '../requestParam';
import { Router } from '@angular/router';

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
  statusList: any[] = [];
  orderParamObj: requestParam = {
    RequestTypeID: 0, PNOrderID: 0, NewCustomerID: 0, CustomerName: '', Status: 0,
    OrderStatus: 0, FromDate: '', ToDate: '', Sort: 1, PageNo: 0, PageSize: 1000
  }
  searchByCustomer: string = '';
  searchByRequestNo: string = '';
  statusType: any = "";
  selectedDate: any;
  saveLoader: boolean = false;
  selectedRequestValue: any = -1;
  selectedIndex: any = -1; // manage the active tab
  radioSelected: any[] = [];

  tabs :any[] = []; 
  constructor(private apiService: ApiService, private commonService: CommonService,private router:Router) { }

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
        debugger
        this.orderParamObj.CustomerName = value;
        this.getAllRequestList();
      });
    this.searchPartNo$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {
        if (value > 0) {
          // this.orderParamObj.OrderNumber = value.toString();
          this.getAllRequestList();
        } else {
          // this.orderParamObj.OrderNumber = '';
          this.getAllRequestList();
        }

      });
  }
  requestTabChange(index: any) {
    debugger
    this.radioSelected.fill(false);
    this.radioSelected[index] = true;
    // other logic
    if(index){
      this.orderParamObj.RequestTypeID=index;
      this.getAllRequestList();
    }else if(index == 0){
      this.orderParamObj.RequestTypeID=index;
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
    if (res) {
      this.requestList = res.data;
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
    this.searchByRequestNo = '';
    // this.orderParamObj.OrderNumber = this.searchByRequestNo;
    this.getAllRequestList();
  }
  clearStatus() {
    this.statusType = "";
    this.orderParamObj.Status = 0;
    this.getAllRequestList();
  }
  customerChange() {
    debugger
    if (this.searchByCustomer.length >= 0) {
      this.searchByCustomerName$.next(this.searchByCustomer);
    }
  }
  searchPart() {

    if (this.searchByRequestNo.length >= 0) {
      this.searchPartNo$.next(this.searchByRequestNo);
    }
  }
  sortType = null;
  sortCounter = 0;
  getSortFunction(sortType: string, columnName: string,) {
    if (this.requestList.length > 0) {
      if (columnName === 'orderno') {
        this.sortCounter++;
        switch (this.sortCounter % 3) {
          case 0: // no sort
            this.sortType = null;
            this.orderParamObj.Sort = 1;
            break;
          case 1: // ascending
            this.sortType = "ascend";
            this.orderParamObj.Sort = 2;
            break;
          case 2: // descending
            this.sortType = "descend";
            this.orderParamObj.Sort = 3;
            break;
        }
        this.getAllRequestList();
      }
      if (columnName === 'customer') {
        this.sortCounter++;
        switch (this.sortCounter % 3) {
          case 0: // no sort
            this.sortType = null;
            this.orderParamObj.Sort = 1;
            break;
          case 1: // ascending
            this.sortType = "ascend";
            this.orderParamObj.Sort = 4;
            break;
          case 2: // descending
            this.sortType = "descend";
            this.orderParamObj.Sort = 5;
            break;
        }
        this.getAllRequestList();
      }
      // if (columnName == 'date') {
      //   this.orderParamObj.Sort = sortType === "ascend" ? 4 : 5;
      //   this.getAllRequestList();
      //   this.sortType = this.sortType === "ascend" ? "descend" : "ascend";
      // }
      if (columnName == 'date') {
        this.sortCounter++;
        switch (this.sortCounter % 3) {
          case 0: // no sort
            this.sortType = null;
            this.orderParamObj.Sort = 1;
            break;
          case 1: // ascending
            this.sortType = "ascend";
            this.orderParamObj.Sort = 6;
            break;
          case 2: // descending
            this.sortType = "descend";
            this.orderParamObj.Sort = 7;
            break;
        }
        this.getAllRequestList();
      }
      if (columnName == 'status') {
        this.sortCounter++;
        switch (this.sortCounter % 3) {
          case 0: // no sort
            this.sortType = null;
            this.orderParamObj.Sort = 1;
            break;
          case 1: // ascending
            this.sortType = "ascend";
            this.orderParamObj.Sort = 8;
            break;
          case 2: // descending
            this.sortType = "descend";
            this.orderParamObj.Sort = 9;
            break;
        }
        this.getAllRequestList();
      }
    }
    // if (columnName == 'customer') {
    //   this.orderParamObj.Sort = sortType === "ascend" ? 3 : 2;
    //   this.getAllRequestList();
    //   this.sortType = this.sortType === "ascend" ? "descend" : 'ascend';
    // }

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
        this.statusList = res.data;
      } else {
        this.statusList = [];
      }
    })
  }

  getTabs():any {
      this.apiService.getStatusLookup(24).subscribe(res => {
      if (res.isSuccess) {
        let obj = { id: 0, description: 'All Requests' };
        this.tabs= res.data;
        // this.tabs.push(obj);
        this.tabs.unshift(obj);
      }else{
        this.tabs=[];
      }
    })
  }
  resetParam() {
    this.selectedRequestValue= -1;
    this.selectedIndex = -1; // manage the active tab
    this. radioSelected = [];
    this.radioSelected.fill(false);
    this.radioSelected[0] = true;
    this.orderParamObj = {
      RequestTypeID: 0, PNOrderID: 0, NewCustomerID: 0, CustomerName: '', Status: 0,
      OrderStatus: 0, FromDate: '', ToDate: '', Sort: 1, PageNo: 0, PageSize: 1000
    }
    this.searchByCustomer = '';
    this.searchByRequestNo = '';
    this.selectedDate = [];
    this.statusType = '';
    this.getAllRequestList();
  }
  gotoDetail(id:any){
    if(id  == 24001){
      this.router.navigate(['/home/transfer',id])
    }else{
      this.router.navigate(['/home/reschedule',id])
    }
  }
}