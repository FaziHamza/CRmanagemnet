import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../../../utility/services/common.service';

@Component({
  selector: 'app-settlment-type',
  templateUrl: './settlment-type.component.html',
  styleUrls: ['./settlment-type.component.scss']
})
export class SettlmentTypeComponent implements OnInit {
  @Input() data;
  settlementType = 'feSettlement';
  constructor(
    private commonService: CommonService,
    private _ngbActiveModal :NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }
  handleCancel() {
    this._ngbActiveModal.dismiss();
  }
  handleOk() {
    this._ngbActiveModal.close();
    if (this.settlementType == 'feSettlement')
      this.commonService.navigateToRouteWithQueryString(`/promissory-note/create-settlement`, { queryParams: { id: this.data?.orderId, type: 'full' } });
    else this.commonService.navigateToRouteWithQueryString(`/promissory-note/create-settlement`, { queryParams: { id: this.data?.orderId, type: 'partial' } });
  }
}
