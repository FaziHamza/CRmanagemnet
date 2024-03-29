import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageModalComponent } from '../../../../shared/module/message-modal/message-modal.component';
import { ApiService } from '../../../../shared/services/api.service';
import { PnDetailsComponent } from './components/pn-details/pn-details.component';

@Component({
  selector: 'follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpComponent implements OnInit {
  date = [];
  pDate = [];
  pnList = [];
  pnBookNo = '';
  searchCustomer = '';
  notes = '';
  dateObj = { fromDate: '', toDate: '' };
  pDateObj = { fromPromisDate: '', toPromisDate: '' };
  details;
  pageNo = 1;
  totalRecords = 0;
  aging: string = ''
  agingList :any[] = [ ]
  selectedDate: Date | null = null;
  sort = 1;
  addFuModalRef: NgbModalRef;
  saveLoader: boolean = false;
  constructor(
    private _modalService: NgbModal,
    private _apiService: ApiService,
    private _datePipe: DatePipe,
    private _toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getPNsForFollowUp();
    this.getAgingList();
  }
  getPNsForFollowUp() {
    let params = `?Search=${this.pnBookNo}&customer=${this.searchCustomer}&FromDueDate=${this.dateObj.fromDate}&ToDueDate=${this.dateObj.toDate}
    &FromPromisDate=${this.pDateObj.fromPromisDate}&ToPromisDate=${this.pDateObj.toPromisDate}&Aging=${this.aging}
    &Sort=${this.sort}&PageNo=${this.pageNo - 1}&PageSize=6`;
    this._apiService.getPNsForFollowUp(params).subscribe(response => {
      this.pnList = response.data;
      this.totalRecords = response.totalRecordCount;
    })
  }
  getAgingList (){
    this._apiService.getStatusLookup(25).subscribe(res => {
      if (res.isSuccess) {
        this.agingList = res.data;
      }
    })
  }
  identify(index, item) {
    return item.pnBookNoteId;
  }
  openDetailsModal(pnBookID) {
    this.saveLoader = true;
    this._apiService.getPNsForFollowUpDetails(pnBookID).subscribe(response => {
      this.saveLoader = false;
      if (response.isSuccess) {
        const modalRef = this._modalService.open(PnDetailsComponent, { size: 'lg', centered: true });
        modalRef.componentInstance.data = { details: response.data }
      }
    },
      (erorr) => {
        this.saveLoader = false;
        this.responseModal('error', erorr.errors[0].ErrorMessageEn);
      }
    )
  }

  openAddFuModal(content, item) {
    this.selectedDate = null;
    this.details = {};
    this.details = item
    this.addFuModalRef = this._modalService.open(content, { size: 'lg', centered: true });
  }
  pageChange(pageNo) {
    this.pageNo = pageNo;
    this.getPNsForFollowUp();
  }
  submit() {
    const formData = new FormData();
    formData.append("PnNoteId", this.details?.pnBookNoteId);
    formData.append("FollowUpNotes", this.notes);
    formData.append("PromiseDate", this.selectedDate?.toISOString());
    this._apiService.addFollowUp(formData).subscribe(response => {
      if (response.isSuccess) {
        this.selectedDate = null;
        this.responseModal('success', 'Data saved successfully!');
        this.notes = '';
        this.getPNsForFollowUp();
        this.addFuModalRef.close();
      }
      else if (!response.isSuccess) this.responseModal('error', response.errors[0].ErrorMessageEn);
    })
  }
  responseModal(type, message) {
    const modalRef = this._modalService.open(MessageModalComponent, { centered: true });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.message = message;
  }
  //SERACH PARAMS
  onDateChange(event) {
    if (event) {
      this.dateObj['fromDate'] = event.length > 0 && this._datePipe.transform(event[0], 'yyyy-MM-dd') || '';
      this.dateObj['toDate'] = event.length > 0 && this._datePipe.transform(event[1], 'yyyy-MM-dd') || '';
    }
    this.resetSearch();
  }
  onProDateChange(event) {
    if (event) {
      this.pDateObj['fromPromisDate'] = event.length > 0 && this._datePipe.transform(event[0], 'yyyy-MM-dd') || '';
      this.pDateObj['toPromisDate'] = event.length > 0 && this._datePipe.transform(event[1], 'yyyy-MM-dd') || '';
    }
    this.resetSearch();
  }
  agingChange() {
    this.resetSearch();
  }
  searchByPnBookNo(event) {
    this.resetSearch();
  }
  clearPnBookSearch() {
    this.pnBookNo = '';
    this.resetSearch();
  }
  searchByCustomer(event) {
    this.resetSearch();
  }
  clearSearchByCustomer() {
    this.searchCustomer = '';
    this.resetSearch();
  }
  clearSearchByAgaing() {
    this.aging = '';
    this.resetSearch();
  }
  resetSearch() {
    this.pageNo = 1;
    this.getPNsForFollowUp();
  }
  //SORT
  sortByBookNo() {
    this.sort = this.sort == 3 ? 1 : this.sort == 2 ? 3 : 2;
    this.resetSearch();
  }
  sortByPnSerial() {
    this.sort = this.sort == 5 ? 1 : this.sort == 4 ? 5 : 4;
    this.resetSearch();
  }
  sortByCustomer() {
    this.sort = this.sort == 7 ? 1 : this.sort == 6 ? 7 : 6;
    this.resetSearch();
  }
  sortByDueDate() {
    this.sort = this.sort == 9 ? 1 : this.sort == 8 ? 9 : 8;
    this.resetSearch();
  }
  sortByPnAmount() {
    this.sort = this.sort == 11 ? 1 : this.sort == 10 ? 11 : 10;
    this.resetSearch();
  }
  sortByRa() {
    this.sort = this.sort == 13 ? 1 : this.sort == 12 ? 13 : 12;
    this.resetSearch();
  }
  sortByLastFu() {
    this.sort = this.sort == 15 ? 1 : this.sort == 14 ? 15 : 14;
    this.resetSearch();
  }
  sortByLastFo() {
    this.sort = this.sort == 17 ? 1 : this.sort == 16 ? 17 : 14;
    this.resetSearch();
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

  // Function to disable past dates
  disabledDate = (current: Date): boolean => {
    // Get the current date without the time (set hours, minutes, and seconds to 0)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Disable if the date is before today
    return current && current < currentDate;
  };


}
