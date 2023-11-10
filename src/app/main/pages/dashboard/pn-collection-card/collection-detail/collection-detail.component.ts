import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss']
})
export class CollectionDetailComponent implements OnInit {
  @Input() data: any[] = [];
  tableLoader: any = false;
  loadRequestTab: any = false;
  collectionList: any[] = [];

  selectedDate: any;
  saveLoader: boolean = false;
  start = 1;
  end = 6;
  pnOrderId = 0;
  totalRecordCount = 0;
  customerList = [];
  constructor(
    private _ngbActiveModal: NgbActiveModal,

  ) { }
  handleCancel() {
    this._ngbActiveModal.dismiss();
  }
  ngOnInit(): void {
    this.collectionList = this.data;
    this.totalRecordCount = this.collectionList.length;
    this.displayData = this.collectionList.length > 6 ? this.collectionList.slice(0, 6) : this.collectionList;
    this.end = this.displayData.length > 6 ? 6 : this.displayData.length;
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
