import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  paramId: any;
  sparePartList: any[] = [];
  pageSize = 6;
  customerDetail: any[] = [];
  sparePartDetailList: any[] = [];
  totalPriceSum: number = 0;
  constructor(private activeRoute: ActivatedRoute, private _apiService: ApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(res => {
      if (res['id']) {
        this.paramId = res['id'];
        this.getCustomerDetail(this.paramId);
        this.getSparePartsDetail(this.paramId);
      }
      }
    )
    this.commonService.breadcrumb = [
      { title: ' Spare Parts', routeLink: '' },
      { title: ' Order Details ', routeLink: 'order' },
    ]
  }
  getCustomerDetail(id: any) {
    let param = "OpportunityId=" + id
    this._apiService.getSparePartsWorkOrder(param).subscribe(res => {
      if (res.isSuccess) {
        this.customerDetail = res.data;
      } else {
        this.customerDetail = [];
      }
    })
  }
  getSparePartsDetail(id: any) {
    this._apiService.getSparePartsWorkParts(id).subscribe(res => {
      if (res.isSuccess) {
        this.sparePartDetailList = res.data;
        this.totalPriceSum = this.sparePartDetailList.reduce((sum, item) => sum + item.totalPrice, 0);
      } else {
        this.sparePartDetailList = [];
      }
    })
  }
  // getSparePartList() {
  //   debugger
  //   this.sparePartList = [
  //     {
  //       id: 1,
  //       partNo: 'P001',
  //       description: 'Oil filter',
  //       qty: 3,
  //       unitPrice: '20JD',
  //       discount: '10%',
  //       net: 0.000,
  //       tax: '16%',
  //       totalPrice: '60JD'
  //     },
  //     {
  //       id: 2,
  //       partNo: 'P001',
  //       description: 'Oil filter',
  //       qty: 3,
  //       unitPrice: '20JD',
  //       discount: '10%',
  //       net: 0.000,
  //       tax: '16%',
  //       totalPrice: '60JD'
  //     },
  //     {
  //       id: 3,
  //       partNo: 'P001',
  //       description: 'Oil filter',
  //       qty: 3,
  //       unitPrice: '20JD',
  //       discount: '10%',
  //       net: 0.000,
  //       tax: '16%',
  //       totalPrice: '60JD'
  //     }
  //   ]
  // }
}
