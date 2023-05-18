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
  pageSize = 10;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // this.getAllOrderList();
  }
  getAllOrderList() {
    this.apiService.getAllOrders().subscribe(res => {
      if (res.isSuccess) {
        this.orderList = res.data;
      } else {
        this.orderList = [];
      }
    })
  }
  detail(id: number) {

  }
}
