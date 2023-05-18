import { ApiService } from './../../../../shared/services/api.service';
import { Component, OnInit } from '@angular/core';

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
  filterValue = "";
  statusValue = "";
  sortDir = -1;
  sortingDesc = false;
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
  
  filterByCustomer() {
    debugger;
    if (this.filterValue) {
      const inputValue = this.filterValue.toLowerCase();
      this.orderList = this.orderList.filter((item) => {
      return item.customer.customerName.toLowerCase().includes(inputValue);
      });
    }
  }

  // filterByStatus() {
  //   debugger;
  //   if (this.statusValue) {
  //     const inputValue = this.filterValue.toLowerCase();
  //     this.orderList = this.orderList.filter((item) => {
  //     return item.statusObj[0].statusName.toLowerCase().includes(inputValue);
  //     });
  //   }
  // }  
  
  onSort(colName:string){
    this.sortingDesc = !this.sortingDesc;
    if (!this.sortingDesc) {
      this.sortDir = 1
    } else {
      this.sortDir = -1
    }
    this.sortArr(this.orderList, colName, this.sortDir)
  }

  sortArr(arr:any[], colName:string, sortDir: number ){
    arr.sort((a,b) =>{
      const aVal = a[colName].toLowerCase();
      const bVal = b[colName].toLowerCase();
      return aVal.localCompare(bVal) * sortDir
    })
  }
}


