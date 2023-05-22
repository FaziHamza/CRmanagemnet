import { ApiService } from './../../../../shared/services/api.service';
import { Component, OnInit } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { orderParam } from '../models/orderParam';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-allorder',
  templateUrl: './allorder.component.html',
  styleUrls: ['./allorder.component.scss']
})
export class AllorderComponent implements OnInit {
  searchByCustomerName$ = new Subject<any>();
  searchPartNo$ = new Subject<any>();
  tableLoader: any = false;
  orderList: any[] = [];
  pageSize = 6;
  statusList: any[] = [];
  orderParamObj: orderParam = {PageSize:1000, BranchId: 1, Customer: '', Status: 0, Sort: 1, Part: '' }
  
  searchByCustomer: string = '';
  searchByPartNo: string = '';
  statusType: any = "";
  saveLoader: boolean = false;
  constructor(private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Spare Parts', routeLink: '' },
      { title: ' Order List ', routeLink: 'order' },
    ]
    this.getStatusLookup()
    this.getAllOrderList();
    this.searchByCustomerName$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {
        this.orderParamObj.Customer = value;
        this.getAllOrderList();
      });
    this.searchPartNo$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {
        this.orderParamObj.Part = value;
        this.getAllOrderList();
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
        this.orderList = res.data;
      } else {
        this.orderList = [];
      }
    })
  }
  clearInput() {
    this.searchByCustomer = '';
    this.orderParamObj.Customer = this.searchByCustomer;

    this.getAllOrderList();
  }
  clearPart() {
    this.searchByPartNo = '';
    this.orderParamObj.Part = this.searchByPartNo;

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
  sortType=null;
  sortCounter = 0;
  getSortFunction(sortType: string, columnName: string,) {
    debugger
    // if (columnName == 'customer') {
    //   this.orderParamObj.Sort = sortType === "ascend" ? 3 : 2;
    //   this.getAllOrderList();
    //   this.sortType = this.sortType === "ascend" ? "descend" : 'ascend';
    // }
    if (columnName === 'customer') {
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
    if (columnName === 'date') {
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
    if (columnName == 'amount')  {
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
    if (columnName == 'status')  {
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
  simpleSort = (a, b) => a - b; // simple sort function
  statusChange() {
    this.orderParamObj.Status = this.statusType;
    this.getAllOrderList();
  }
  getStatusLookup() {
    this.apiService.getStatusLookup(10).subscribe(res => {
      if (res.isSuccess) {
        this.statusList = res.data;
      } else {
        this.statusList = [];
      }
    })
  }
}


