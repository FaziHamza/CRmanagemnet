import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  sparePartList: any[] = [];

  pageSize = 2
  constructor() { }

  ngOnInit(): void {
this.getSparePartList()
  }
  getSparePartList() {
    debugger
    this.sparePartList = [
      {
        id: 1,
        partNo: 'P001',
        description: 'Oil filter',
        qty: 3,
        unitPrice: '20JD',
        discount: '10%',
        net: 0.000,
        tax: '16%',
        totalPrice: '60JD'
      },
      {
        id: 2,
        partNo: 'P001',
        description: 'Oil filter',
        qty: 3,
        unitPrice: '20JD',
        discount: '10%',
        net: 0.000,
        tax: '16%',
        totalPrice: '60JD'
      },
      {
        id: 3,
        partNo: 'P001',
        description: 'Oil filter',
        qty: 3,
        unitPrice: '20JD',
        discount: '10%',
        net: 0.000,
        tax: '16%',
        totalPrice: '60JD'
      }
    ]
  }
}
