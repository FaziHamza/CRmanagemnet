import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { orderParam } from '../models/orderParam';

@Component({
  selector: 'app-work-order-request',
  templateUrl: './work-order-request.component.html',
  styleUrls: ['./work-order-request.component.scss']
})

export class WorkOrderRequestComponent implements OnInit {

  searchByCustomerName$ = new Subject<any>();
  searchPartNo$ = new Subject<any>();
  tableLoader: any = false;
  orderList: any[] = [];
  pageSize = 6;
  statusList: any[] = [];
  orderParamObj: orderParam = { PageSize: 1000, BranchId: 1, Status: 0, Sort: 1, OrderNumber: '', FromDate: '', ToDate: '', Search: '' }

  searchByCustomer: string = '';
  searchByPartNo: string = '';
  statusType: any = "";
  selectedDate: any;
  saveLoader: boolean = false;
  selectedRequestValue :any = 0;
  tabs = [{id:1,name: 'All Requests'}, {id:2,name: 'Rescheduling Requests'}, {id:3,name: 'Transgerring Request'}];
  constructor(private apiService: ApiService, private commonService: CommonService) { }

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
        if (value > 0) {
          this.orderParamObj.OrderNumber = value.toString();
          this.getAllOrderList();
        } else {
          this.orderParamObj.OrderNumber = '';
          this.getAllOrderList();
        }

      });
  }
  mySort() {

  }
  selectTab(tabId: number): void {
    debugger
    this.selectedRequestValue = tabId;
  }
  getAllOrderList() {
    this.orderList = [
      {
        "orderId": 1,
        "customer": {
          "customerId": 100289,
          "customerName": "جمعية الحسين لرعاية وتاهيل ذوي التحديات الحركية",
          "mobile": "962790000038"
        },
        "branch": null,
        "orderDate": "2023-05-10T00:00:00",
        "statusObj": {
          "lookupId": 21002,
          "lookupBGColor": null,
          "lookupTextColor": null,
          "description": "generated",
          "translations": [
            {
              "languageId": 1001,
              "lookupName": "Print"
            }
          ]
        },
        "actionId": 20002,
        "actionToDo": [
          {
            "languageId": 1001,
            "lookupName": "generated"
          }
        ]
      },
      {
        "orderId": 4,
        "customer": {
          "customerId": 100293,
          "customerName": "شركة الدخان والسجائر الدولية",
          "mobile": "962790000039"
        },
        "branch": null,
        "orderDate": "2023-01-05T00:00:00",
        "statusObj": {
          "lookupId": 21001,
          "lookupBGColor": null,
          "lookupTextColor": null,
          "description": "pending",
          "translations": [
            {
              "languageId": 1001,
              "lookupName": "pending"
            }
          ]
        },
        "actionId": 20001,
        "actionToDo": [
          {
            "languageId": 1001,
            "lookupName": "Rescheduled"
          }
        ]
      },
      {
        "orderId": 5,
        "customer": {
          "customerId": 100328,
          "customerName": "عبد الله احمد خليف المناصير",
          "mobile": "962790000048"
        },
        "branch": null,
        "orderDate": "2023-01-05T00:00:00",
        "statusObj": {
          "lookupId": 21001,
          "lookupBGColor": null,
          "lookupTextColor": null,
          "description": "pending",
          "translations": [
            {
              "languageId": 1001,
              "lookupName": "pending"
            }
          ]
        },
        "actionId": 20001,
        "actionToDo": [
          {
            "languageId": 1001,
            "lookupName": "Transfer"
          }
        ]
      },
      {
        "orderId": 3,
        "customer": {
          "customerId": 100168,
          "customerName": "سحر محمد حامد عكلوك",
          "mobile": "962790000015"
        },
        "branch": null,
        "orderDate": "2023-01-04T00:00:00",
        "statusObj": {
          "lookupId": 21001,
          "lookupBGColor": null,
          "lookupTextColor": null,
          "description": "pending",
          "translations": [
            {
              "languageId": 1001,
              "lookupName": "Generated"
            }
          ]
        },
        "actionId": 20001,
        "actionToDo": [
          {
            "languageId": 1001,
            "lookupName": "Generated"
          }
        ]
      },
      {
        "orderId": 2,
        "customer": {
          "customerId": 100135,
          "customerName": "شركة كلية القدس",
          "mobile": "962790000012"
        },
        "branch": null,
        "orderDate": "2023-01-02T00:00:00",
        "statusObj": {
          "lookupId": 21001,
          "lookupBGColor": null,
          "lookupTextColor": null,
          "description": "generated",
          "translations": [
            {
              "languageId": 1001,
              "lookupName": "generated"
            }
          ]
        },
        "actionId": 20001,
        "actionToDo": [
          {
            "languageId": 1001,
            "lookupName": "Generated"
          }
        ]
      }
    ]
    // const queryString = Object.entries(this.orderParamObj)
    //   .filter(([key, value]) => !(key === "Status" && value === 0))
    //   .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    //   .join("&");
    // this.saveLoader = true;
    // this.apiService.getSparePartsWorkOrder(queryString).subscribe(res => {
    //   this.saveLoader = false;
    //   if (res.isSuccess) {
    //     this.orderList = res.data?.data;
    //   } else {
    //     this.orderList = [];
    //   }
    // })
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
    // if (columnName == 'customer') {
    //   this.orderParamObj.Sort = sortType === "ascend" ? 3 : 2;
    //   this.getAllOrderList();
    //   this.sortType = this.sortType === "ascend" ? "descend" : 'ascend';
    // }

  }
  simpleSort = (a, b) => a - b; // simple sort function
  statusChange() {
    this.orderParamObj.Status = this.statusType;
    this.getAllOrderList();
  }
  clearDate() {
    this.selectedDate = '';
  }
  changeDate(date: any) {
    debugger
    if (this.selectedDate) {
      const fromDate = new Date(this.selectedDate);
      const formattedFromDate = fromDate.toISOString();

      this.orderParamObj.FromDate = formattedFromDate
    } else {
      this.orderParamObj.FromDate = ''
    }
    this.getAllOrderList();
  }
  getStatusLookup() {
    this.statusList = [
      {
        "id": 10001,
        "description": "Issued",
        "imagePath": "http://localhost:27360/",
        "createdDateTime": null,
        "createdByUser": {
          "id": 7,
          "fullName": "Full Admin ",
          "email": "admin@markazia.jo",
          "mobile": "0775855048"
        },
        "name": [
          {
            "languageId": 1001,
            "lookupName": "Printed"
          }
        ]
      },
      {
        "id": 10002,
        "description": "Waiting",
        "imagePath": "http://localhost:27360/",
        "createdDateTime": null,
        "createdByUser": {
          "id": 7,
          "fullName": "Full Admin ",
          "email": "admin@markazia.jo",
          "mobile": "0775855048"
        },
        "name": [
          {
            "languageId": 1001,
            "lookupName": "Signed"
          }
        ]
      },
      {
        "id": 10003,
        "description": "Updated",
        "imagePath": "http://localhost:27360/",
        "createdDateTime": null,
        "createdByUser": {
          "id": 7,
          "fullName": "Full Admin ",
          "email": "admin@markazia.jo",
          "mobile": "0775855048"
        },
        "name": [
          {
            "languageId": 1001,
            "lookupName": "Printed"
          }
        ]
      },
      {
        "id": 10004,
        "description": "Collected",
        "imagePath": "http://localhost:27360/",
        "createdDateTime": null,
        "createdByUser": {
          "id": 7,
          "fullName": "Full Admin ",
          "email": "admin@markazia.jo",
          "mobile": "0775855048"
        },
        "name": [
          {
            "languageId": 1001,
            "lookupName": "Collected"
          }
        ]
      },
      {
        "id": 10005,
        "description": "Partial",
        "imagePath": "http://localhost:27360/",
        "createdDateTime": null,
        "createdByUser": {
          "id": 7,
          "fullName": "Full Admin ",
          "email": "admin@markazia.jo",
          "mobile": "0775855048"
        },
        "name": [
          {
            "languageId": 1001,
            "lookupName": "Printed"
          }
        ]
      },
      {
        "id": 10006,
        "description": "Cancelled",
        "imagePath": "http://localhost:27360/",
        "createdDateTime": null,
        "createdByUser": {
          "id": 7,
          "fullName": "Full Admin ",
          "email": "admin@markazia.jo",
          "mobile": "0775855048"
        },
        "name": [
          {
            "languageId": 1001,
            "lookupName": "Pending"
          }
        ]
      }
    ]
    // this.apiService.getStatusLookup(10).subscribe(res => {
    //   if (res.isSuccess) {
    //     this.statusList = res.data;
    //   } else {
    //     this.statusList = [];
    //   }
    // })
  }
  resetParam() {
    this.orderParamObj = { PageSize: 1000, BranchId: 1, Status: 0, Sort: 1, OrderNumber: '', FromDate: '', ToDate: '', Search: '' }
    this.searchByCustomer = '';
    this.searchByPartNo = '';
    this.selectedDate = [];
    this.statusType = '';
    this.getAllOrderList();
  }
}