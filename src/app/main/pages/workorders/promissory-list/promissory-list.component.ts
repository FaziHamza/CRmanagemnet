import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { orderParam } from '../models/orderParam';
import { CreateRequestComponent } from '../../create-request/create-request.component';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettlmentTypeComponent } from './componets/settlment-type/settlment-type.component';

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
  statusList: any[] = [];
  orderParamObj: orderParam = { PageSize: 1000, BranchId: 1, Status: 0, Sort: 1, OrderNumber: '', FromDate: '', ToDate: '', Search: '' }

  searchByCustomer: string = '';
  searchByPartNo: string = '';
  statusType: any = "";
  selectedDate: any;
  saveLoader: boolean = false;
  start = 1;
  end = 6;
  pnOrderId = 0;
  totalRecordCount = 0;
  customerList = [];
  constructor(private apiService: ApiService, public commonService: CommonService,
    private router: Router,
    private _ngbModalService: NgbModal,
    private modal: NzModalService, private permissionService: PermissionService) { }

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
  openModal(orderId) {
    const modalRef = this._ngbModalService.open(SettlmentTypeComponent);
    modalRef.componentInstance.data = { orderId };
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
        this.totalRecordCount = res.totalRecordCount;
        this.displayData = this.orderList.length > 6 ? this.orderList.slice(0, 6) : this.orderList;
        this.end = this.displayData.length > 6 ? 6 : this.displayData.length;
      } else {
        this.orderList = [];
        this.displayData = [];
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

  pageIndex: number = 1;
  pageSize: number = 6;
  displayData: any[] = [];

  sortType = null;
  sortCounter = 0;
  sortCounters = {
    'orderno': 0,
    'customer': 0,
    'date': 0,
    'status': 0
  };


  lastSortedColumn = null;

  getSortFunction(sortType: string, columnName: string,) {
    if (this.orderList.length > 0) {

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
        case 0:
          this.sortType = null;
          this.orderParamObj.Sort = 1;
          break;
        case 1: // ascending
          this.sortType = "ascend";
          this.orderParamObj.Sort = columnName === 'orderno' ? 2 :
            columnName === 'customer' ? 4 :
              columnName === 'date' ? 6 :
                8;
          break;
        case 2: // descending
          this.sortType = "descend";
          this.orderParamObj.Sort = columnName === 'orderno' ? 3 :
            columnName === 'customer' ? 5 :
              columnName === 'date' ? 7 :
                9;
          break;
      }

      this.lastSortedColumn = columnName;
      this.getAllOrderList();
    }
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
    this.displayData = this.orderList.slice(start, end);
    this.end = this.displayData.length != 6 ? this.orderList.length : this.pageIndex * this.pageSize;
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
        let warningStatus = res.data.find(x => x.id == 21016);
        this.statusList = res.data.slice(0, 6);
        this.statusList.push(warningStatus);
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
  createRequest(orderId: any, requestType: string): void {
    const modal = this.modal.create<CreateRequestComponent>({
      nzWidth: 1000,
      // nzTitle: 'Change Control Value',
      nzContent: CreateRequestComponent,
      // nzViewContainerRef: this.viewContainerRef,
      // nzOnOk: () => console.log('OK'),
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => console.log('Click ok'),
      // nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzComponentParams: {
        data: orderId,
        statusType: requestType
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      if (!res)
        this.ngOnInit();
      // if (res) {
      //   // this.controls(value, data, obj, res);
      // }
    });
  }
  gotoDetail(data: any) {
    // let status = data.statusObj?.translations[0].lookupName.toLowerCase();
    // if( status == 'signed' || status == 'under collecting' || status == 'collected'){
    // }else{
    // }
    if (!this.canPerformAction(7, 39, 79) || !this.canPerformAction(7, 39, 78)) {
      localStorage.setItem('pnActionType', data?.actionToDo[0]?.lookupName)
      this.router.navigate(['/home/workorders', data.orderId])
    }
  }
  tabClick(value: boolean) {
    this.commonService.loadRequestTab = value;
  }
  canPerformAction(catId: number, subCatId: number, perItemName: number) {
    return this.permissionService.checkPermission(catId, subCatId, perItemName);
  }
}
