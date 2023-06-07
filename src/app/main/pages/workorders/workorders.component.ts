import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/utility/services/common.service';
import { orderParam } from './models/orderParam';
import { ApiService } from 'src/app/shared/services/api.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

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
  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Promissory Notes Order', routeLink: '' },
    ];

  }


  tabClick(value:boolean,tabNumber:number){
    this.commonService.loadRequestTab = value;
    this.commonService.selectedWorkorder = tabNumber;
  }
}
