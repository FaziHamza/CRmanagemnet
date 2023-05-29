import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { orderParam } from './models/orderParam';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-workorders',
  templateUrl: './workorders.component.html',
  styleUrls: ['./workorders.component.scss']
})
export class WorkordersComponent implements OnInit {

  searchByCustomerName$ = new Subject<any>();
  searchPartNo$ = new Subject<any>();
  tableLoader: any = false;
  orderList: any[] = [];
  pageSize = 6;
  statusList: any[] = [];
  orderParamObj: orderParam = { PageSize: 1000, BranchId: 1, Customer: '', Status: 0, Sort: 1, Part: '' }

  searchByCustomer: string = '';
  searchByPartNo: string = '';
  statusType: any = "";
  saveLoader: boolean = false;
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
    this.orderList = [
      {
        "sparePartsSalesOrderOpportunityNo": 33,
        "customer": {
          "customerId": 100531,
          "customerName": "شركة الصادق لصناعة المطهرات والاكياس والفلاتر",
          "email": null,
          "mobile": "962790000091",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10006,
            "statusName": "Pending"
          }
        ],
        "status": 10006,
        "grandAmount": 566.82,
        "orderDate": "2023-05-25T16:36:20.372218",
        "salesNote": "",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T13:36:20.263",
        "pnEndDate": "2023-05-25T13:36:20.263",
        "collection": null
      },
      {
        "sparePartsSalesOrderOpportunityNo": 32,
        "customer": {
          "customerId": 100135,
          "customerName": "شركة كلية القدس",
          "email": null,
          "mobile": "962790000012",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10002,
            "statusName": "Printed"
          }
        ],
        "status": 10002,
        "grandAmount": 202.814,
        "orderDate": "2023-05-25T15:32:10.1908768",
        "salesNote": "",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:32:10.14",
        "pnEndDate": "2023-05-25T12:32:10.14",
        "collection": null
      },
      {
        "sparePartsSalesOrderOpportunityNo": 31,
        "customer": {
          "customerId": 100252,
          "customerName": "شركة الفاهوم وشركاه التعليمية /مدارس اكاديمية عمان",
          "email": null,
          "mobile": "962790000026",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10004,
            "statusName": "Signed"
          }
        ],
        "status": 10004,
        "grandAmount": 37.676,
        "orderDate": "2023-05-25T15:31:25.5362716",
        "salesNote": "note order 2",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:31:25.49",
        "pnEndDate": "2023-05-25T12:31:25.49",
        "collection": null
      },
      {
        "sparePartsSalesOrderOpportunityNo": 30,
        "customer": {
          "customerId": 101009,
          "customerName": "عدنان سعيد سعود ابو ضريس وشركاه",
          "email": null,
          "mobile": "962790000187",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10006,
            "statusName": "Collected"
          }
        ],
        "status": 10006,
        "grandAmount": 227.198,
        "orderDate": "2023-05-25T15:29:32.6528327",
        "salesNote": "notee",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:29:32.357",
        "pnEndDate": "2023-05-25T12:29:32.357",
        "collection": null
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
    //     this.orderList = res.data;
    //   } else {
    //     this.orderList = [];
    //   }
    // })
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
  sortType = null;
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
    if (columnName == 'amount') {
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
  simpleSort = (a, b) => a - b; // simple sort function
  statusChange() {
    this.orderParamObj.Status = this.statusType;
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

  
}
