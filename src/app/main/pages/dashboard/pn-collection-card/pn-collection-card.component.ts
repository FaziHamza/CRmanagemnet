import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CollectionDetailComponent } from './collection-detail/collection-detail.component';

@Component({
  selector: 'app-pn-collection-card',
  templateUrl: './pn-collection-card.component.html',
  styleUrls: ['./pn-collection-card.component.scss']
})


export class PnCollectionCardComponent implements OnInit {

  tableLoader: any = false;
  loadRequestTab: any = false;
  collectionList: any[] = [];
  orderParamObj: orderParam = { PageNo: 0, PageSize: 6, DateFrom: '', DateTo: '' }

  selectedDate: any;
  saveLoader: boolean = false;
  start = 1;
  end = 6;
  pnOrderId = 0;
  totalRecordCount = 0;
  customerList = [];
  constructor(private apiService: ApiService, public commonService: CommonService,
    private _ngbModalService: NgbModal,
    private modal: NzModalService,) { }

  ngOnInit(): void {
    // Get the current date
    const currentDate = new Date();

    // Get the current year
    const currentYear = currentDate.getFullYear();

    // Create the start date of the current year
    const yearStartDate = new Date(currentYear, 0, 1); // Month is 0-based, so 0 is January

    // Create the end date of the current year
    const yearEndDate = new Date(currentYear, 11, 31); // Month is 0-based, so 11 is December
    const formattedDateFrom = yearStartDate.toISOString();
    const formattedDateTo = yearEndDate.toISOString();

    this.orderParamObj.DateFrom = formattedDateFrom
    this.orderParamObj.DateTo = formattedDateTo

    this.getDashboardCollectionsList();
  }
  openModal(data) {
    const modalRef = this._ngbModalService.open(CollectionDetailComponent);
    modalRef.componentInstance.data = data || [];
  }
  getDashboardCollectionsList() {
    const queryString = Object.entries(this.orderParamObj)
      .filter(([key, value]) => !(key === "Status" && value === 0))
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    this.saveLoader = true;
    this.apiService.getDashboardCollections(queryString).subscribe(res => {
      this.saveLoader = false;
      if (res.isSuccess) {
        const findLatestDate = (collection) => {
          return collection.reduce((latest, current) => {
            const currentDate = new Date(current.createdAt);
            return currentDate > latest ? currentDate : latest;
          }, new Date(0));
        };

        // Update the data array with the latestCollectionDate property
        const updatedData = res.data.map((item) => {
          if (item?.collections?.length > 0) {
            const lastCollectionDate = findLatestDate(item.collections);
            return { ...item, lastCollectionDate };
          } else {
            return { ...item };
          }
        });
        this.collectionList = updatedData;
        this.totalRecordCount = res.totalRecordCount;
        this.displayData = this.collectionList.length > 6 ? this.collectionList.slice(0, 6) : this.collectionList;
        this.end = this.displayData.length > 6 ? 6 : this.displayData.length;

      } else {
        this.collectionList = [];
        this.displayData = [];
      }
    })
  }

  pageIndex: number = 1;
  pageSize: number = 6;
  displayData: any[] = [];

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.orderParamObj.PageNo = index -1;
    this.getDashboardCollectionsList();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.updateDisplayData();
  }

  updateDisplayData(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.start = start == 0 ? 1 : ((this.pageIndex * this.pageSize) - this.pageSize) + 1;
    this.displayData = this.collectionList.slice(start, end);
    this.end = this.displayData.length != 6 ? this.collectionList.length : this.pageIndex * this.pageSize;
  }



  changeDate(date: any) {
    if (this.selectedDate.length > 0) {
      const DateFrom = new Date(this.selectedDate[0].toString());
      const DateTo = new Date(this.selectedDate[1]);

      const formattedDateFrom = DateFrom.toISOString();
      const formattedDateTo = DateTo.toISOString();

      this.orderParamObj.DateFrom = formattedDateFrom
      this.orderParamObj.DateTo = formattedDateTo
    } else {
      this.orderParamObj.DateFrom = ''
      this.orderParamObj.DateTo = ''
    }
    this.getDashboardCollectionsList();
  }
  // resetParam() {
  //   this.orderParamObj = { PageNo: 0, PageSize: 1000, DateFrom: '', DateTo: '' }
  //   this.selectedDate = [];
  //   this.getDashboardCollectionsList();
  // }
}


export class orderParam {
  DateFrom: any;
  DateTo: any;
  PageSize: number;
  PageNo: number;
};