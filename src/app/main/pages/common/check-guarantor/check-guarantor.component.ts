import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-check-guarantor',
  templateUrl: './check-guarantor.component.html',
  styleUrls: ['./check-guarantor.component.scss']
})

export class CheckGuarantorComponent implements OnInit {
  @Input() data: any;
  tableLoader: any = false;
  loadRequestTab: any = false;
  collectionList: any[] = [];

  selectedDate: any;
  saveLoader: boolean = false;
  start = 1;
  end = 6;
  pnOrderId = 0;
  totalRecordCount = 0;
  checkParamObj: orderParam = { GuarantorId: 0 }
  customerList = [];
  constructor(private _ngbActiveModal: NgbActiveModal, private apiService: ApiService) { }
  handleCancel() {
    this._ngbActiveModal.dismiss();
  }
  ngOnInit(): void {

    this.checkParamObj.GuarantorId = this.data;
    this.getcheckGuarantor();
  }
  getcheckGuarantor() {
    const queryString = Object.entries(this.checkParamObj)
      .filter(([key, value]) => !(key === "Status" && value === 0))
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    this.saveLoader = true;
    this.apiService.checkGuarantor(queryString).subscribe(res => {
      this.saveLoader = false;
      if (res.isSuccess) {
        this.collectionList = res.data;
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
    this.displayData = this.collectionList.slice(start, end);
    this.end = this.displayData.length != 6 ? this.collectionList.length : this.pageIndex * this.pageSize;
  }

}
export class orderParam {
  GuarantorId: number;
  // PageSize: number;
  // PageNo: number;
};