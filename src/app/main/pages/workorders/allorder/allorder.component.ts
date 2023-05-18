import { ApiService } from './../../../../shared/services/api.service';
import { Component, OnInit } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-allorder',
  templateUrl: './allorder.component.html',
  styleUrls: ['./allorder.component.scss']
})
export class AllorderComponent implements OnInit {
  tableLoader: any = false;
  orderList: any[] = [];
  pageSize = 6;
  statusList: any[] = [];
  sparePartOrder: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getStatusLookup()
    this.getAllOrderList();
  }
  getAllOrderList() {
    this.apiService.getSparePartsWorkOrder().subscribe(res => {
      if (res.isSuccess) {
        this.orderList = res.data;
      } else {
        this.orderList = [];
      }
    })
  }
  detail(id: number) {

  }
  getStatusLookup() {
    this.apiService.getStatusLookup().subscribe(res => {
      if (res.isSuccess) {
        this.statusList = res.data;
      } else {
        this.statusList = [];
      }
    })
  }

  getSparePartOrder() {
    this.apiService.getSparePartsWorkOrder().subscribe(res => {
      if (res.isSuccess) {
        this.sparePartOrder = res.data;
      } else {
        this.sparePartOrder = [];
      }
    })
  }
  

}


