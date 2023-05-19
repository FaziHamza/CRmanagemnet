import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  paramId:any;
  sparePartList: any[] = [];
  pageSize = 6
  constructor(private activeRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(res=>{
        if(res['id']){
          this.paramId = res['id'];
        }
      this.getSparePartList()
    })
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
