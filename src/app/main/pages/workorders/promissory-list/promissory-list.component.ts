import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { orderParam } from '../models/orderParam';
import { CreateRequestComponent } from '../../create-request/create-request.component';

@Component({
  selector: 'app-promissory-list',
  templateUrl: './promissory-list.component.html',
  styleUrls: ['./promissory-list.component.scss']
})
export class PromissoryListComponent implements OnInit {

  searchByCustomerName$ = new Subject<any>();
  searchPartNo$ = new Subject<any>();
  tableLoader: any = false;
  loadRequestTab: any = false;
  orderList: any[] = [];
  pageSize = 6;
  statusList: any[] = [];
  orderParamObj: orderParam = { PageSize: 1000, BranchId: 1, Status: 0, Sort: 1, OrderNumber: '', FromDate: '', ToDate: '', Search: '' }

  searchByCustomer: string = '';
  searchByPartNo: string = '';
  statusType: any = "";
  selectedDate: any;
  saveLoader: boolean = false;
  constructor(private apiService: ApiService, public commonService: CommonService,private router:Router,
    private modal: NzModalService,) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Promissory Notes Order', routeLink: '' },
    ];
    this.getStatusLookup()
    this.getAllOrderList();
    this.searchByCustomerName$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {
        this.orderParamObj.Search = value;
        this.getAllOrderList();
      });
    this.searchPartNo$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {
        if(value > 0){
          this.orderParamObj.OrderNumber = value.toString();
          this.getAllOrderList();
        }else{
          this.orderParamObj.OrderNumber = '';
          this.getAllOrderList();
        }

      });
  }
  mySort() {

  }
  getAllOrderList() {
    const queryString = Object.entries(this.orderParamObj)
      .filter(([key, value]) => !(key === "Status" && value === 0))
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    this.saveLoader = true;
    this.apiService.getSparePartsWorkOrder(queryString).subscribe(res => {
      this.saveLoader = false;
      if (res.isSuccess) {
        this.orderList = res.data?.data;
      } else {
        this.orderList = [];
      }
    })
  }
  clearInput() {
    this.searchByCustomer = '';
    this.orderParamObj.Search = this.searchByCustomer;

    this.getAllOrderList();
  }
  clearPart() {
    this.searchByPartNo = '';
    this.orderParamObj.OrderNumber = this.searchByPartNo;
    this.getAllOrderList();
  }
  clearStatus() {
    this.statusType = "";
    this.orderParamObj.Status = 0;
    this.getAllOrderList();
  }
  customerChange() {
    if (this.searchByCustomer.length >= 0) {
      this.searchByCustomerName$.next(this.searchByCustomer);
    }
  }
  searchPart() {

    if (this.searchByPartNo.length >= 0) {
      this.searchPartNo$.next(this.searchByPartNo);
    }
  }
  sortType = null;
  sortCounter = 0;
  getSortFunction(sortType: string, columnName: string,) {
    if (this.orderList.length > 0) {
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
        this.getAllOrderList();
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
        this.getAllOrderList();
      }
      // if (columnName == 'date') {
      //   this.orderParamObj.Sort = sortType === "ascend" ? 4 : 5;
      //   this.getAllOrderList();
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
        this.getAllOrderList();
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
        this.getAllOrderList();
      }
    }
  }
  simpleSort = (a, b) => a - b; // simple sort function
  statusChange() {
    this.orderParamObj.Status = this.statusType;
    this.getAllOrderList();
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
    this.getAllOrderList();
  }
  getStatusLookup() {
    this.apiService.getStatusLookup(21).subscribe(res => {
      if (res.isSuccess) {
        this.statusList = res.data.slice(0,6);
      } else {
        this.statusList = [];
      }
    })
  }
  resetParam() {
    this.orderParamObj = { PageSize: 1000, BranchId: 1, Status: 0, Sort: 1, OrderNumber: '', FromDate: '', ToDate: '', Search: '' }
    this.searchByCustomer = '';
    this.searchByPartNo = '';
    this.selectedDate = [];
    this.statusType = '';
    this.getAllOrderList();
  }
  createRequest(orderId:any,requestType:string): void {
    const modal = this.modal.create<CreateRequestComponent>({
      nzWidth: 700,
      // nzTitle: 'Change Control Value',
      nzContent: CreateRequestComponent,
      // nzViewContainerRef: this.viewContainerRef,
      // nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzComponentParams: {
        data:orderId,
        statusType:requestType
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      this.ngOnInit();
      // if (res) {
      //   // this.controls(value, data, obj, res);
      // }
    });
  }
  gotoDetail(data:any){
    // let status = data.statusObj?.translations[0].lookupName.toLowerCase();
    // if( status == 'signed' || status == 'under collecting' || status == 'collected'){
    // }else{
    // }
    this.router.navigate(['/home/workorders',data.orderId])
  }
  tabClick(value:boolean){
    this.commonService.loadRequestTab = value;
  }
}
