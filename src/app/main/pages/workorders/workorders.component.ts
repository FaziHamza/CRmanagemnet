import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { orderParam } from './models/orderParam';
import { ApiService } from 'src/app/shared/services/api.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-workorders',
  templateUrl: './workorders.component.html',
  styleUrls: ['./workorders.component.scss']
})
export class WorkordersComponent implements OnInit {

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
  permissionList = [];
  constructor(public commonService: CommonService, private apiService: ApiService, private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Promissory Notes Order', routeLink: '' },
    ];

  }
  getPermission() {


  }
  canPerformAction(catId: number, subCatId: number, perItemName: number) {
    if (this.permissionService.checkPermission(7, 39, 80)) {
      this.commonService.loadRequestTab = true;
      this.commonService.selectedWorkorder = 1;
    }
    return this.permissionService.checkPermission(catId, subCatId, perItemName);
  }
  tabClick(value: boolean, tabNumber: number) {
    this.commonService.loadRequestTab = value;
    this.commonService.selectedWorkorder = tabNumber;
  }

}
