import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageModalComponent } from '../../../../../../shared/module/message-modal/message-modal.component';
import { ApiService } from '../../../../../../shared/services/api.service';

@Component({
  selector: 'app-full-early-settlement-request-details',
  templateUrl: './full-early-settlement-request-details.component.html',
  styleUrls: ['./full-early-settlement-request-details.component.scss']
})
export class FullEarlySettlementRequestDetailsComponent implements OnInit {
  isEmployee: boolean;
  details;
  discountFactor = '';
  rejectReason = '';
  @Input() data;
  total = { interest: 0, remainingAmount: 0, totalPNs: 0 };
  @Output() sendData = new EventEmitter();
  constructor(
    private _apiService: ApiService,
    public _activeModal: NgbActiveModal,
    public _modalService: NgbModal,
    public _toastrSerivce: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getEarlysettlementRequestDetails();
  }
  settleRequest() {
    if (this.data.action == 'approve') this.approveEarlySettlementRequest()
    else this.rejectEarlySettlementRequest();
  }
  handleRequest(action) {
    this.data = { ...this.data, action };
  }
  approveEarlySettlementRequest() {
    const formData = new FormData();
    formData.append('RequestId', this.details.requestID)
    formData.append('DiscountFactor', this.discountFactor)
    formData.append('DiscountAmount', this.details.eairlySettlement.discountAmount)
    formData.append('TotalEarlySettlementAmount', this.details.eairlySettlement.totalEarlySettlementAmount)
    this._apiService.approveEarlysettlementRequest(formData).subscribe(response => {
      if (response.isSuccess) {
        this.responseModal('success', 'Request approved successfully');
        this.sendData.emit(true);
        this._activeModal.close()
      }
      else if (!response.isSuccess) this.responseModal('error', response.errors[0].ErrorMessageEn);
    })
  }
  responseModal(type, message) {
    const modalRef = this._modalService.open(MessageModalComponent, { centered: true });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.message = message;
  }
  rejectEarlySettlementRequest() {
    const formData = new FormData();
    formData.append('RequestId', this.details.requestID)
    formData.append('RejectReason', this.rejectReason)
    this._apiService.rejectEarlysettlementRequest(formData).subscribe(response => {
      if (response.isSuccess) {
        this.sendData.emit(true);
        this.responseModal('success', 'Request rejected successfully');
        this._activeModal.close()
      }
      else if (!response.isSuccess) this.responseModal('error', response.errors[0].ErrorMessageEn);
    })
  }
  getEarlysettlementRequestDetails() {
    this._apiService.getEarlysettlementRequestDetails(this.data.requestId).subscribe(response => {
      if (response.isSuccess) {
        this.details = response.data;
        this.discountFactor = this.details?.eairlySettlement?.discountFactor;
        this.rejectReason = this.details?.rejectionReason;
        this.details.books.forEach(x => {
          let obj = {
            interest: this.total.interest + x.remainingInterestAmount,
            remainingAmount: this.total.remainingAmount + x.pnRemainingAmount,
            totalPNs: this.total.totalPNs + x.noOfUncollectedPNs,
          }
          this.total = obj;
        })
      }
    })
  }
  handleDiscountFactor(event) {
    let value = +event?.target.value;
    if (value > 100) {
      this._toastrSerivce.error('Value must be in range of 0-100', "Error")
    }
    if (value >= 0) {
      this.details.eairlySettlement.discountAmount = (this.total.remainingAmount / 100 * value);
      this.details.eairlySettlement.totalEarlySettlementAmount = this.total.remainingAmount - this.details.eairlySettlement.discountAmount;
    }
  }
}
