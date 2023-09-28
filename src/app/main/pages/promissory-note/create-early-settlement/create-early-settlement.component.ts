import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageModalComponent } from '../../../../shared/module/message-modal/message-modal.component';
import { ApiService } from '../../../../shared/services/api.service';
import { LoaderService } from '../../../../shared/services/LoaderService/loader.service';

@Component({
  selector: 'app-create-early-settlement',
  templateUrl: './create-early-settlement.component.html',
  styleUrls: ['./create-early-settlement.component.scss']
})
export class CreateEarlySettlementComponent implements OnInit {
  notesList = [];
  pnOrderDetails;
  selectAll;

  totalRecordCount = 0;
  pageNo = 1;

  pnOrderId = 0;
  details;
  orderBookList = [];
  unCollectedPns = [];
  isEmployee: boolean;
  checkedItems = [];
  remainingPnInterestAmount = 0;
  remainingPnAmount = 0;
  settlementType = '';
  total = { interest: 0, remainingAmount: 0, totalPNs: 0 };
  discountFactor = '';
  discountAmount = 0;
  totalPaymentAmount = 0;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _apiService: ApiService,
    private _datePipe: DatePipe,
    private _toastrService: ToastrService,
    private _modalService: NgbModal,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._activeRoute.queryParams.subscribe(params => {
      this.pnOrderId = params['id'];
      this.settlementType = params['type'];
      this.getPnOrderById();
    })
  }
  createEarlySettlement() {
    let params = {
      orderId: this.pnOrderId,
      requestType: (this.settlementType == 'partial') && 24004 || 24003,
      forEmployee: this.isEmployee,
      pNsCountForEarlySettlement: this.checkedItems.length,
      pNsAmountForEarlySettlement: this.settlementType == 'partial' && this.remainingPnAmount || this.total.remainingAmount,
      pNsIntrestValueForEarlySettlement: this.settlementType == 'partial' && this.remainingPnInterestAmount || this.total.interest,
      discountFactor: +this.discountFactor,
      discountAmount: this.discountAmount,
      totalEarlySettlementAmount: this.totalPaymentAmount,
      pnNotesIds: this.checkedItems.map(x => x.pnBookNoteId),
    }
    this._apiService.createEarlySettlement(params).subscribe(response => {
      if (response.isSuccess) {
        this.responseModal('success', 'Early Settlement Successfully Created',3);
          setTimeout(() => {
            this._router.navigate(['/workorders']);
          }, 3000)
        // if (this.details.interesValue <= 0 && !this.isEmployee) {
         
        // }
        // else {
        //   this._router.navigate(['/workorders'])
        // }
      }
      else if (!response.isSuccess) {
        this.responseModal('error', response.errors[0].ErrorMessageEn);
      }
    })
  }
  responseModal(type, message,autoCloseDelay?) {
    const modalRef = this._modalService.open(MessageModalComponent, { centered: true });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.autoCloseDelay = autoCloseDelay;
  }
  handleDiscountFactor(event?) {
    let value = +((event?.target?.value) || this.discountFactor);
    if (value > 100) {
      this._toastrService.error('Discount must be in range of 0-100.', 'Error')
    }
    if (value >= 0) {
      if (this.details.interesValue <= 0) {
        if (this.settlementType == 'partial') {
          this.discountAmount = this.remainingPnAmount / 100 * value;
          this.totalPaymentAmount = this.remainingPnAmount - this.discountAmount;
        }
        else {
          this.discountAmount = this.total.remainingAmount / 100 * value;
          this.totalPaymentAmount = this.total.remainingAmount - this.discountAmount;
        }
      }
    }
  }
  calculateDiscountWithTax() {
    if (this.details.interesValue > 0) {
      if (this.settlementType == 'partial') {
        if (this.details.salesTax > 0) {
          this.discountAmount = this.remainingPnInterestAmount / 100 * this.details.salesTax;
          this.totalPaymentAmount = this.remainingPnAmount - this.discountAmount;
        }
        else {
          this.discountAmount = this.remainingPnInterestAmount;
          this.totalPaymentAmount = this.remainingPnAmount - this.discountAmount;
        }
      }
      else {
        if (this.details.salesTax > 0) {
          this.discountAmount = this.total.interest / 100 * this.details.salesTax;
          this.totalPaymentAmount = this.total.remainingAmount - this.discountAmount;
        }
        else {
          this.discountAmount = this.total.interest;
          this.totalPaymentAmount = this.total.remainingAmount - this.discountAmount;
        }
      }
    }
  }
  getPnOrderById() {
    let params = `OrderNumber=${this.pnOrderId}`;
    this._apiService.getSparePartsWorkOrder(params).subscribe((response) => {
      this.details = (response.data.data)[0];
      this.getPNOrderBooks();
      if (this.settlementType == "partial") {
        this.getPNOrderAllNotes();
      }
    })
  }
  getPNOrderBooks() {
    let params = `?PNOrderId=${this.pnOrderId}&pageNo=0&pageSize=1000`;
    this._apiService.getPNOrderBooks(params).subscribe(response => {
      this.orderBookList = response.data;
      this.orderBookList.forEach((x) => {
        let obj = {
          interest: this.total.interest + x.remainingInterestAmount,
          remainingAmount: this.total.remainingAmount + x.remainingPNAmount,
          totalPNs: this.total.totalPNs + x.uncollectedPNsTotal,
        }
        this.total = obj;
      })
      this.calculateDiscountWithTax();
    })
  }
  getPNOrderAllNotes() {
    let params = `?PNOrderId=${this.pnOrderId}&UnCollectedOnly=true&DueOverDueOnly=false&pageNo=${this.pageNo - 1}&pageSize=1000`;
    this._apiService.getPNOrderAllNotes(params).subscribe(response => {
      this.unCollectedPns = response.data.map(x => { return { ...x, checked: false } });
      this.calculateDiscountWithTax();
    })
  }
  calcValue() {
    this.checkedItems = this.unCollectedPns.filter((x: any) => x.checked);
    this.remainingPnInterestAmount = 0;
    this.remainingPnAmount = 0;
    this.checkedItems.forEach(x => {
      this.remainingPnAmount += x.remainingAmount;
      this.remainingPnInterestAmount += x.remainingPNInterestAmount;
    })
    if (+this.discountFactor > 0) {
      this.handleDiscountFactor();
    }
    if (this.details.interesValue > 0) {
      this.calculateDiscountWithTax();
    }
  }
  handleCheckBoxChange() {
    this.calcValue();
  }
  checkAll(event) {
    let check = event.target.checked;
    if (check) this.unCollectedPns = this.unCollectedPns.map(x => { return { ...x, checked: true } });
    else this.unCollectedPns = this.unCollectedPns.map(x => { return { ...x, checked: false } });
    this.calcValue();
  }
  highlightDate(date) {
    let currentDate = new Date(this._datePipe.transform(new Date(), 'MMM d, y'));
    let pnDate = new Date(date);
    if (currentDate > pnDate)
      return 'primary-bg'
    else if (currentDate < pnDate)
      return 'blue-bg'
    else
      return 'green-bg'
  }
}
